"use client";

import { CONSENT_KEY, trackContactEvent } from "@/lib/analytics";
import { applyAnalyticsConsent } from "@/lib/analytics-consent";
import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const KEY = CONSENT_KEY;
const EVENT = "lafabric-consent";
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
    applyAnalyticsConsent(consent);
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
