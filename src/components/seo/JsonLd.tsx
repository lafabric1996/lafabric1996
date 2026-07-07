import { getTranslations } from "next-intl/server";

export async function JsonLd() {
  const t = await getTranslations("metadata");
  const tJson = await getTranslations("jsonLd");
  const tContact = await getTranslations("contactPage");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: t("siteName"),
    description: t("defaultDescription"),
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lafabric1996.ca",
    telephone: "+1-819-322-1041",
    email: tContact("info.emailValue"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "5804 Boulevard Labelle",
      addressLocality: "Val-Morin",
      addressRegion: "QC",
      postalCode: "J0T 2R0",
      addressCountry: "CA",
    },
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
