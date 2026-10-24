import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { ServicePageLayout } from "@/components/sections/ServicePageLayout";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

const BLOCK_IMAGES = ["/resurfacage/christian-simon/apres-1.jpg", "/realisations/construction-mad-projet-circle/apres/cuisine-vue-ensemble.jpg", "/realisations/ann-prud-homme-designer-projet-la-lumineuse/selection-20261020/photo-principale-revisee.webp"];

const BLOCK_KEYS = ["resurfacing", "renovation", "finishes"] as const;

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.cuisine" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/cuisine",
  });
}

export default async function CuisinePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("cuisinePage");

  return (
    <>
      <ServicePageLayout
        heroSrc="/realisations/projet-lantier/selection-20261004/photo-01.webp"
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
