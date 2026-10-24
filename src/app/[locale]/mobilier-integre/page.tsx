import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { ServicePageLayout } from "@/components/sections/ServicePageLayout";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

const BLOCK_IMAGES = ["/realisations/entre-4-murs-projet-takacsy/selection-20261020/photo-03.webp", "/realisations/yh2-maison-aube/selection-20261023/photo-762.webp", "/realisations/yh2-les-blocs-de-bois/selection-20261023/photo-15.webp"];

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
        heroSrc="/realisations/yh2-les-blocs-de-bois/selection-20261023/photo-15.webp"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        blocks={BLOCK_KEYS.map((key, index) => ({
          title: t(`blocks.${key}.title`),
          imageSrc: BLOCK_IMAGES[index],
          imageLabel: t(`blocks.${key}.imageLabel`),
          paragraphs: [t(`blocks.${key}.p1`), t(`blocks.${key}.p2`)],
        }))}
      />
      <CTABanner title={t("ctaTitle")} description={t("ctaDescription")} />
    </>
  );
}
