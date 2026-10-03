"use server";

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
  errorKey?: "missingFields" | "invalidEmail" | "serverError";
};

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const firstName = String(formData.get("prenom") ?? "").trim();
  const lastName = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("courriel") ?? "").trim();
  const phone = String(formData.get("telephone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName || !lastName || !email || !message) {
    return { status: "error", errorKey: "missingFields" };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { status: "error", errorKey: "invalidEmail" };
  }

  if (service !== "ebenisterie" && service !== "resurfacage") {
    return { status: "error", errorKey: "missingFields" };
  }

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
      subject: `Nouvelle demande de soumission — ${selectedService.label} — ${firstName} ${lastName}`,
      text: [
        `Prénom : ${firstName}`,
        `Nom : ${lastName}`,
        `Courriel : ${email}`,
        `Téléphone : ${phone || "Non fourni"}`,
        `Type de projet : ${selectedService.label}`,
        "",
        "Message :",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Erreur Resend :", error);
      return { status: "error", errorKey: "serverError" };
    }

    return { status: "success" };
  } catch (err) {
    console.error("Échec de l'envoi du formulaire de contact :", err);
    return { status: "error", errorKey: "serverError" };
  }
}
