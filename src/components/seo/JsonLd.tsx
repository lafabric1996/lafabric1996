import { getTranslations } from "next-intl/server";

const SITE_URL = "https://www.lafabric.ca";

/* Villes réellement desservies. Noms propres identiques en français et en
   anglais, donc volontairement hors des fichiers de traduction. */
const SERVICE_AREAS = [
  "Val-Morin",
  "Val-David",
  "Sainte-Adèle",
  "Saint-Sauveur",
  "Morin-Heights",
  "Sainte-Agathe-des-Monts",
  "Mont-Tremblant",
  "La Conception",
  "Lac-Supérieur",
  "Estérel",
  "Prévost",
  "Saint-Jérôme",
  "Laval",
  "Montréal",
];

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export async function JsonLd() {
  const t = await getTranslations("metadata");
  const tJson = await getTranslations("jsonLd");
  const tContact = await getTranslations("contactPage");

  const knowsAbout = tJson.raw("knowsAbout") as string[];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: t("siteName"),
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
    areaServed: [
      { "@type": "AdministrativeArea", name: tJson("areaServed") },
      ...SERVICE_AREAS.map((name) => ({ "@type": "City", name })),
    ],
    knowsAbout,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("titleSuffix"),
      itemListElement: knowsAbout.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
