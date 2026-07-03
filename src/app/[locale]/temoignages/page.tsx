import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/sections/PageHeader";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.temoignages" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/temoignages",
  });
}

export default async function TemoignagesPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("temoignagesPage");
  const tCta = await getTranslations("cta");

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <Section className="pt-0">
        <AnimatedReveal>
          <div className="mx-auto max-w-3xl border border-border bg-surface p-10 text-center md:p-16">
            <span className="font-display text-6xl leading-none text-wood/30">
              &ldquo;
            </span>
            <p className="mt-6 font-display text-2xl leading-relaxed text-foreground md:text-3xl">
              {t("placeholderQuote")}
            </p>
            <p className="mt-6 text-sm text-muted">{t("placeholderNote")}</p>
          </div>
        </AnimatedReveal>
      </Section>

      <Section variant="surface">
        <SectionHeader
          align="center"
          eyebrow={t("experienceEyebrow")}
          title={t("experienceTitle")}
          description={t("experienceDescription")}
        />
      </Section>

      <CTABanner
        title={t("ctaTitle")}
        description={t("ctaDescription")}
        primaryLabel={tCta("contactUs")}
      />
    </>
  );
}
