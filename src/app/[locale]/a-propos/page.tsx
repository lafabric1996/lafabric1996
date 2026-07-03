import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/sections/PageHeader";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

const VALUE_KEYS = ["quality", "craftsmanship", "listening", "durability"] as const;

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.aPropos" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/a-propos",
  });
}

export default async function AProposPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("aProposPage");

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <Section className="pt-0">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimatedReveal>
            <ImagePlaceholder aspectRatio="portrait" label={t("teamPhoto")} />
          </AnimatedReveal>
          <AnimatedReveal delay={150}>
            <h2 className="font-display text-4xl tracking-tight md:text-5xl">
              {t("storyTitle")}
            </h2>
            <div className="mt-6 space-y-4 text-muted leading-relaxed">
              <p>{t("storyP1")}</p>
              <p>{t("storyP2")}</p>
              <p>{t("storyP3")}</p>
            </div>
          </AnimatedReveal>
        </div>
      </Section>

      <Section variant="surface">
        <SectionHeader
          align="center"
          eyebrow={t("valuesEyebrow")}
          title={t("valuesTitle")}
          description={t("valuesDescription")}
        />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_KEYS.map((key, index) => (
            <AnimatedReveal key={key} delay={index * 80}>
              <div className="text-center">
                <span className="inline-block h-px w-8 bg-wood" />
                <h3 className="mt-4 font-display text-2xl tracking-tight">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {t(`values.${key}.description`)}
                </p>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <ImagePlaceholder aspectRatio="video" label={t("workshopPhoto")} />
          <ImagePlaceholder aspectRatio="video" label={t("projectPhoto")} />
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
