"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { sendContactMessage, type ContactFormState } from "@/lib/actions/contact";
import { Button } from "@/components/ui/Button";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );

  return (
    <form className="space-y-6" action={formAction}>
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
          className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            {t("selectService")}
          </option>
          <option value="ebenisterie">{t("options.woodworking")}</option>
          <option value="resurfacage">{t("options.resurfacing")}</option>
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
          rows={6}
          required
          className="w-full resize-y border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
          placeholder={t("messagePlaceholder")}
        />
      </div>

      <p aria-live="polite" className="text-sm text-muted">
        {state.status === "success" && t("successMessage")}
        {state.status === "error" &&
          t(`errors.${state.errorKey ?? "serverError"}`)}
      </p>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
