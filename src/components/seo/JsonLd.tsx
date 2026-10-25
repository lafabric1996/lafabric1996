import { serviceAreas } from "@/lib/service-areas";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const SITE_URL = "https://www.lafabric.ca";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export async function JsonLd() {
  const locale = await getLocale();
  const t = await getTranslations("metadata");
  const tJson = await getTranslations("jsonLd");
  const tContact = await getTranslations("contactPage");

  const knowsAbout = tJson.raw("knowsAbout") as string[];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "La Fab’ric 1996 inc.",
    description: t("defaultDescription"),
    url: SITE_URL,
    telephone: "+1-819-322-1041",
    email: tContact("info.emailValue"),
    foundingDate: "1996",
    logo: `${SITE_URL}/images/logo-lafabric.png`,
    image: `${SITE_URL}/images/hero-atelier-20261024.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "5804 Boulevard Labelle",
      addressLocality: "Val-Morin",
      addressRegion: "QC",
      postalCode: "J0T 2R0",
      addressCountry: "CA",
    },
    /* Lundi au vendredi, 8h à 17h, fermé de midi à 13h. */
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKDAYS,
        opens: "08:00",
        closes: "12:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKDAYS,
        opens: "13:00",
        closes: "17:00",
      },
    ],
    areaServed: serviceAreas(locale),
    knowsAbout: knowsAbout.filter((_, index) => index !== 0),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("titleSuffix"),
      itemListElement: knowsAbout.slice(1).map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [structuredData, {
        "@type": "HomeAndConstructionBusiness",
        "@id": `${SITE_URL}/#refacing-business`,
        name: "La Fab’ric Resurfaçage inc.",
        url: `${SITE_URL}${locale === "en" ? "/en/refacing" : "/resurfacage"}`,
        telephone: "+1-819-507-1041",
        email: tContact("info.emailValue"),
        address: structuredData.address,
        areaServed: serviceAreas(locale),
        knowsAbout: [knowsAbout[0]],
      }] }).replace(/</g, "\\u003c") }}
    />
  );
}
