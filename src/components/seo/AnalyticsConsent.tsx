"use client";

import { trackContactEvent } from "@/lib/analytics";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const ID = "G-H3XMDY9CM0";
const KEY = "lafabric-analytics-consent-v1";
const EVENT = "lafabric-consent";
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  "ga-disable-G-H3XMDY9CM0"?: boolean;
};
function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener("storage", callback); };
}
function snapshot() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
function choose(value: string | null) {
  try { if (value === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, value); } catch { /* Browsing still works without storage. */ }
  window.dispatchEvent(new Event(EVENT));
}
export function AnalyticsConsent() {
  const t = useTranslations("analyticsConsent");
  const consent = useSyncExternalStore(subscribe, snapshot, () => null);
  useEffect(() => {
    const w = window as AnalyticsWindow;
    w["ga-disable-G-H3XMDY9CM0"] = consent !== "accepted";
    if (consent !== "accepted") {
      w.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.trim().split("=")[0];
        if (!name.startsWith("_ga")) continue;
        for (const domain of ["", `; domain=${location.hostname}`, "; domain=.lafabric.ca"]) document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
      }
    } else {
      w.gtag?.("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    }
  }, [consent]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="tel:"]') : null;
      if (!anchor) return;
      trackContactEvent("contact_phone_click", anchor.dataset.service === "resurfacage" ? "resurfacage" : "ebenisterie");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return <>
    {consent === "accepted" ? <Script id="lafabric-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" onReady={() => {
      // Keep staging visits out of the existing production property.
      if (!["lafabric.ca", "www.lafabric.ca"].includes(location.hostname)) return;
      const w = window as AnalyticsWindow;
      if (snapshot() !== "accepted") return;
      w.dataLayer ??= [];
      // Google’s command queue uses Arguments objects, not plain event arrays.
      // eslint-disable-next-line prefer-rest-params
      w.gtag ??= function () { w.dataLayer?.push(arguments); };
      w.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      w.gtag("js", new Date());
      w.gtag("config", ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    }} /> : null}
    {consent === null ? <aside aria-label={t("settings")} className="fixed bottom-0 inset-x-0 z-[10001] border-t border-border bg-white p-5 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-foreground">{t("text")}</p>
        <button type="button" onClick={() => choose("declined")} className="border px-5 py-3 text-sm">{t("decline")}</button>
        <button type="button" onClick={() => choose("accepted")} className="bg-foreground px-5 py-3 text-sm text-white">{t("accept")}</button>
      </div>
    </aside> : null}
    <div className="bg-surface px-6 py-3 text-center"><button type="button" onClick={() => choose(null)} className="text-xs underline underline-offset-4">{t("settings")}</button></div>
  </>;
}
