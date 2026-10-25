"use client";

import { useSearchParams } from "next/navigation";
import { trackContactEvent } from "@/lib/analytics";
import { useActionState, useRef } from "react";
import { useTranslations } from "next-intl";
import { sendContactMessage, type ContactFormState } from "@/lib/actions/contact";
import { Button } from "@/components/ui/Button";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const search = useSearchParams();
  const requestId = useRef<string | null>(null);
  const trackedRequest = useRef<string | null>(null);
  const selectedService = search.get("service");
  const [state, formAction, pending] = useActionState(
    async (previous: ContactFormState, data: FormData) => {
      requestId.current ??= crypto.randomUUID();
      data.set("requestId", requestId.current);
      const result = await sendContactMessage(previous, data);
      if (result.status === "success" && result.requestId && trackedRequest.current !== result.requestId) {
        trackedRequest.current = result.requestId;
        trackContactEvent("generate_lead", data.get("service") === "resurfacage" ? "resurfacage" : "ebenisterie");
      }
      return result;
    },
    initialState,
  );

  return (
    <form className="space-y-6" action={formAction}>
      <input type="hidden" name="projectReference" value={search.get("projet") ?? ""} />
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="prenom"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
          >
            {t("firstName")}
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            maxLength={100}
            required
            autoComplete="given-name"
            className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
            placeholder={t("firstNamePlaceholder")}
          />
        </div>
        <div>
          <label
            htmlFor="nom"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
          >
            {t("lastName")}
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            maxLength={100}
            required
            autoComplete="family-name"
            className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
            placeholder={t("lastNamePlaceholder")}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="courriel"
          className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
        >
          {t("email")}
        </label>
        <input
          type="email"
          id="courriel"
          name="courriel"
            maxLength={254}
          required
          autoComplete="email"
          className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="telephone"
          className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
        >
          {t("phone")}
        </label>
        <input
          type="tel"
          id="telephone"
          name="telephone"
            maxLength={50}
          autoComplete="tel"
          className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
          placeholder={t("phonePlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="service"
          className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
        >
          {t("projectType")}
        </label>
        <select
          id="service"
          name="service"
          required
          className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
          key={selectedService}
          defaultValue={selectedService === "ebenisterie" || selectedService === "resurfacage" ? selectedService : ""}
        >
          <option value="" disabled>
            {t("selectService")}
          </option>
          <option value="ebenisterie">{t("options.woodworking")}</option>
          <option value="resurfacage">{t("options.resurfacing")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="municipality" className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted">{t("municipality")}</label>
        <input id="municipality" name="municipality" required maxLength={120} autoComplete="address-level2" placeholder={t("municipalityPlaceholder")} className="w-full border border-border bg-background px-4 py-3 focus:border-wood focus:outline-none" />
      </div>
      <div>
        <label htmlFor="source" className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted">{t("source")}</label>
        <select id="source" name="source" defaultValue="unknown" className="w-full border border-border bg-background px-4 py-3">
          {(["unknown", "google", "google_ads", "referral", "social", "returning", "other"] as const).map((key) => <option key={key} value={key}>{t(`sources.${key}`)}</option>)}
        </select>
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
            maxLength={5000}
          rows={6}
          required
          className="w-full resize-y border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
          placeholder={t("messagePlaceholder")}
        />
      </div>

      <p className="text-sm text-muted">{t("photosHint")}</p>
      <p aria-live="polite" className="text-sm text-muted">
        {state.status === "success" && t("successMessage")}
        {state.status === "error" &&
          t(`errors.${state.errorKey ?? "serverError"}`)}
      </p>

      {state.status === "success" && state.requestId ? <p className="break-all text-sm">{t("reference")} : {state.requestId}</p> : null}
      {state.status === "error" ? <p className="text-sm">
        {t("fallback")} <a className="underline" href="mailto:info@lafabric.ca">info@lafabric.ca</a> · <a className="underline" href="tel:+18193221041">819 322-1041</a>
      </p> : null}
      <Button type="submit" size="lg" disabled={pending || state.status === "success"}>
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
