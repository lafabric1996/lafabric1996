import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.contact" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/contact",
  });
}

export default async function ContactPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("contactPage");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <Section className="pt-0">
        <div className="grid gap-16 lg:grid-cols-5">
          <AnimatedReveal className="lg:col-span-3">
            <form className="space-y-6" action="#" method="post">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="prenom"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
                  >
                    {t("form.firstName")}
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    autoComplete="given-name"
                    className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
                    placeholder={t("form.firstNamePlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="nom"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
                  >
                    {t("form.lastName")}
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    autoComplete="family-name"
                    className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
                    placeholder={t("form.lastNamePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="courriel"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
                >
                  {t("form.email")}
                </label>
                <input
                  type="email"
                  id="courriel"
                  name="courriel"
                  autoComplete="email"
                  className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
                  placeholder={t("form.emailPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="telephone"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
                >
                  {t("form.phone")}
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  autoComplete="tel"
                  className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
                  placeholder={t("form.phonePlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
                >
                  {t("form.projectType")}
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {t("form.selectService")}
                  </option>
                  <option value="cuisine">{t("form.options.kitchen")}</option>
                  <option value="salle-de-bain">
                    {t("form.options.bathroom")}
                  </option>
                  <option value="mobilier">{t("form.options.builtIn")}</option>
                  <option value="resurfacage">
                    {t("form.options.resurfacing")}
                  </option>
                  <option value="autre">{t("form.options.other")}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
                >
                  {t("form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full resize-y border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-wood focus:outline-none"
                  placeholder={t("form.messagePlaceholder")}
                />
              </div>

              <p className="text-sm text-muted">{t("form.disclaimer")}</p>

              <Button type="submit" size="lg">
                {t("form.submit")}
              </Button>
            </form>
          </AnimatedReveal>

          <AnimatedReveal delay={150} className="lg:col-span-2">
            <div className="border border-border bg-surface p-8 lg:p-10">
              <h2 className="font-display text-3xl tracking-tight">
                {t("info.title")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {t("info.description")}
              </p>

              <div className="mt-8 space-y-6">
                {(["address", "phone", "email", "hours"] as const).map(
                  (field) => (
                    <div key={field}>
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-wood">
                        {t(`info.${field}`)}
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        {tCommon("comingSoon")}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </Section>
    </>
  );
}
