import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { ServicePageLayout } from "@/components/sections/ServicePageLayout";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/PageJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

const BLOCK_IMAGES = ["/realisations/entre-4-murs-projet-takacsy/selection-20261020/photo-06.webp", "/realisations/yh2-les-blocs-de-bois/selection-20261023/photo-11.webp", "/realisations/yh2-maison-aube/selection-20261023/photo-715.webp"];

const BLOCK_KEYS = ["design", "vanity", "materials"] as const;

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.salleDeBain" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/salle-de-bain",
  });
}

export default async function SalleDeBainPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("salleDeBainPage");
  const tNav = await getTranslations("nav");
  const tSeo = await getTranslations("metadata.salleDeBain");

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        trail={[{ name: tNav("salleDeBain"), href: "/salle-de-bain" }]}
      />
      <ServiceJsonLd
        locale={locale}
        pathname="/salle-de-bain"
        serviceType={tSeo("title")}
        description={tSeo("description")}
      />
      <ServicePageLayout
        heroSrc="/realisations/yh2-les-blocs-de-bois/selection-20261023/photo-11.webp"
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
