import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { ServicePageLayout } from "@/components/sections/ServicePageLayout";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

const BLOCK_KEYS = ["storage", "integration", "craftsmanship"] as const;

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: "metadata.mobilierIntegre",
  });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/mobilier-integre",
  });
}

export default async function MobilierIntegrePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("mobilierIntegrePage");

  return (
    <>
      <ServicePageLayout
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        blocks={BLOCK_KEYS.map((key) => ({
          title: t(`blocks.${key}.title`),
          imageLabel: t(`blocks.${key}.imageLabel`),
          paragraphs: [t(`blocks.${key}.p1`), t(`blocks.${key}.p2`)],
        }))}
      />
      <CTABanner title={t("ctaTitle")} description={t("ctaDescription")} />
    </>
  );
}
