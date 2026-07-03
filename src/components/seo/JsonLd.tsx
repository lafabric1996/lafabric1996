import { getTranslations } from "next-intl/server";

export async function JsonLd() {
  const t = await getTranslations("metadata");
  const tJson = await getTranslations("jsonLd");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: t("siteName"),
    description: t("defaultDescription"),
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lafabric1996.ca",
    areaServed: {
      "@type": "AdministrativeArea",
      name: tJson("areaServed"),
    },
    knowsAbout: tJson.raw("knowsAbout") as string[],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
