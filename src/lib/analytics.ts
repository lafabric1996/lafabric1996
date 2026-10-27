/**
 * v2 : le consentement couvre maintenant la mesure publicitaire (Google Ads).
 * Changer la clé redemande l'accord aux visiteurs qui avaient accepté la v1,
 * puisque la finalité a changé.
 */
export const CONSENT_KEY = "lafabric-analytics-consent-v2";

export type ContactService = "ebenisterie" | "resurfacage";

/** Never send contact details, message text, municipality or request IDs to GA. */
export function trackContactEvent(
  name: "generate_lead" | "contact_phone_click",
  service: ContactService,
) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") return;
    if (!["lafabric.ca", "www.lafabric.ca"].includes(location.hostname)) return;
    const w = window as Window & { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", name, { service, contact_method: name === "generate_lead" ? "form" : "phone" });
  } catch { /* Measurement must never prevent contact. */ }
}
