import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

const PROCESS_STEP_KEYS = [
  "consultation",
  "design",
  "fabrication",
  "installation",
] as const;

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.services" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/services",
  });
}

export default async function ServicesPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("servicesPage");

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <ImagePlaceholder aspectRatio="wide" label={t("heroPhoto")} />

      <ServicesGrid />

      <Section>
        <SectionHeader
          eyebrow={t("processEyebrow")}
          title={t("processTitle")}
          description={t("processDescription")}
        />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEP_KEYS.map((key, index) => (
            <AnimatedReveal key={key} delay={index * 80}>
              <div className="border-t-2 border-wood pt-6">
                <span className="font-display text-4xl text-wood/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-2xl tracking-tight">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {t(`steps.${key}.description`)}
                </p>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
