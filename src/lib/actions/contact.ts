"use server";

import { createHash, randomUUID } from "node:crypto";
import { realisations } from "@/lib/realisations";
import { Resend } from "resend";

const CONTACT_SERVICES = {
  ebenisterie: {
    label: "Ébénisterie",
    recipients: ["info@lafabric.ca"],
  },
  resurfacage: {
    label: "Resurfaçage",
    recipients: ["info@lafabric.ca", "louis@lafabric.ca"],
  },
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  requestId?: string;
  errorKey?: "missingFields" | "invalidEmail" | "serverError" | "tooLong";
};

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (String(formData.get("website") ?? "").trim()) return { status: "success" };
  const firstName = String(formData.get("prenom") ?? "").trim();
  const lastName = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("courriel") ?? "").trim();
  const phone = String(formData.get("telephone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const municipality = String(formData.get("municipality") ?? "").trim();
  const source = String(formData.get("source") ?? "unknown").trim();
  const sourceLabels: Record<string, string> = { unknown: "Non précisé", google: "Recherche Google", google_ads: "Annonce Google", referral: "Recommandation", social: "Réseaux sociaux", returning: "Déjà client", other: "Autre" };
  const projectReference = String(formData.get("projectReference") ?? "").trim();
  const project = realisations.find((item) => item.slug === projectReference);
  const suppliedId = String(formData.get("requestId") ?? "");
  const requestId = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(suppliedId) ? suppliedId : randomUUID();
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName || !lastName || !email || !message || !municipality) {
    return { status: "error", errorKey: "missingFields" };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { status: "error", errorKey: "invalidEmail" };
  }

  if (service !== "ebenisterie" && service !== "resurfacage") {
    return { status: "error", errorKey: "missingFields" };
  }

  if (firstName.length > 100 || lastName.length > 100 || email.length > 254 || phone.length > 50 || message.length > 5000 || municipality.length > 120) return { status: "error", errorKey: "tooLong" };

  if (!Object.hasOwn(sourceLabels, source)) return { status: "error", errorKey: "missingFields" };

  const selectedService = CONTACT_SERVICES[service];
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY manquant : impossible d'envoyer le courriel du formulaire de contact.");
    return { status: "error", errorKey: "serverError" };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Site La Fab'ric 1996 <onboarding@resend.dev>",
      to: selectedService.recipients,
      replyTo: email,
      subject: `Nouvelle demande de soumission — ${selectedService.label} — ${firstName.replace(/[\r\n]/g, " ")} ${lastName.replace(/[\r\n]/g, " ")}`,
      text: [
        `Référence : ${requestId}`,
        `Entreprise : ${service === "resurfacage" ? "La Fab’ric Resurfaçage inc." : "La Fab’ric 1996 inc."}`,
        `Municipalité : ${municipality.replace(/[\r\n]/g, " ")}`,
        `Source déclarée par le client : ${sourceLabels[source]}`,
        `Projet consulté : ${project?.title ?? "Non précisé"}`,
        "Statut : nouvelle demande à qualifier (ni soumission ni vente confirmée)",
        "",
        `Prénom : ${firstName}`,
        `Nom : ${lastName}`,
        `Courriel : ${email}`,
        `Téléphone : ${phone || "Non fourni"}`,
        `Type de projet : ${selectedService.label}`,
        "",
        "Message :",
        message,
      ].join("\n"),
    }, {
      // Retry the same payload without sending a second notification; allow corrected submissions.
      idempotencyKey: `contact/${requestId}/${createHash("sha256").update(JSON.stringify([firstName, lastName, email, phone, municipality, service, source, projectReference, message])).digest("hex")}`,
    });

    if (error) {
      console.error("Erreur Resend :", error);
      return { status: "error", errorKey: "serverError" };
    }

    return { status: "success", requestId };
  } catch (err) {
    console.error("Échec de l'envoi du formulaire de contact :", err);
    return { status: "error", errorKey: "serverError" };
  }
}
