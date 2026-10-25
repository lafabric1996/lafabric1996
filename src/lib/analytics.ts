export type ContactService = "ebenisterie" | "resurfacage";

/** Never send contact details, message text, municipality or request IDs to GA. */
export function trackContactEvent(
  name: "generate_lead" | "contact_phone_click",
  service: ContactService,
) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("lafabric-analytics-consent-v1") !== "accepted") return;
    if (!["lafabric.ca", "www.lafabric.ca"].includes(location.hostname)) return;
    const w = window as Window & { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", name, { service, contact_method: name === "generate_lead" ? "form" : "phone" });
  } catch { /* Measurement must never prevent contact. */ }
}
