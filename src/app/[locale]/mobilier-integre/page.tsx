import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { ServicePageLayout } from "@/components/sections/ServicePageLayout";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/PageJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

const BLOCK_IMAGES = ["/realisations/mu-architecture-l-albatros/IMG_4835.webp", "/realisations/yh2-maison-aube/selection-20261023/photo-762.webp", "/realisations/yh2-les-blocs-de-bois/selection-20261023/photo-15.webp"];

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
  const tNav = await getTranslations("nav");
  const tSeo = await getTranslations("metadata.mobilierIntegre");

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        trail={[{ name: tNav("mobilierIntegre"), href: "/mobilier-integre" }]}
      />
      <ServiceJsonLd
        locale={locale}
        pathname="/mobilier-integre"
        serviceType={tSeo("title")}
        description={tSeo("description")}
      />
      <ServicePageLayout
        heroSrc="/realisations/mu-architecture-l-albatros/retouches-20261023/IMG_4852.webp"
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
