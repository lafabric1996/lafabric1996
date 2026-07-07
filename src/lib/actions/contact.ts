"use server";

import { Resend } from "resend";

const CONTACT_EMAIL = "info@lafabric.ca";
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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY manquant : impossible d'envoyer le courriel du formulaire de contact.");
    return { status: "error", errorKey: "serverError" };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Site La Fab'ric 1996 <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Nouvelle demande de soumission — ${firstName} ${lastName}`,
      text: [
        `Prénom : ${firstName}`,
        `Nom : ${lastName}`,
        `Courriel : ${email}`,
        `Téléphone : ${phone || "Non fourni"}`,
        `Type de projet : ${service || "Non précisé"}`,
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
