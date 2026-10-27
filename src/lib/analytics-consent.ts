const ID = "G-H3XMDY9CM0";
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  lafabricAnalyticsInitialized?: boolean;
  "ga-disable-G-H3XMDY9CM0"?: boolean;
};

/** Initialize the consent queue before requesting Google's script. */
export function applyAnalyticsConsent(consent: string | null) {
  const w = window as AnalyticsWindow;
  const accepted = consent === "accepted" && ["lafabric.ca", "www.lafabric.ca"].includes(location.hostname);
  w["ga-disable-G-H3XMDY9CM0"] = !accepted;
  const denied = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  if (!accepted) {
    w.gtag?.("consent", "update", denied);
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.trim().split("=")[0];
      if (!name.startsWith("_ga") && !name.startsWith("_gcl")) continue;
      for (const domain of ["", `; domain=${location.hostname}`, "; domain=.lafabric.ca"]) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
      }
    }
    return;
  }
  w.dataLayer ??= [];
  // Google expects Arguments objects in its command queue.
  // eslint-disable-next-line prefer-rest-params
  w.gtag ??= function () { w.dataLayer?.push(arguments); };
  if (!w.lafabricAnalyticsInitialized) w.gtag("consent", "default", denied);
  w.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied" });
  if (w.lafabricAnalyticsInitialized) return;
  w.lafabricAnalyticsInitialized = true;
  w.gtag("js", new Date());
  w.gtag("config", ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement("script");
  script.id = "lafabric-analytics";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  script.onerror = () => { script.remove(); w.lafabricAnalyticsInitialized = false; };
  document.head.appendChild(script);
}
