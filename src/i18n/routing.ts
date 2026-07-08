import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/realisations": {
      fr: "/realisations",
      en: "/projects",
    },
    "/realisations/[slug]": {
      fr: "/realisations/[slug]",
      en: "/projects/[slug]",
    },
    "/resurfacage": {
      fr: "/resurfacage",
      en: "/refacing",
    },
    "/cuisine": {
      fr: "/cuisine",
      en: "/kitchen",
    },
    "/salle-de-bain": {
      fr: "/salle-de-bain",
      en: "/bathroom",
    },
    "/mobilier-integre": {
      fr: "/mobilier-integre",
      en: "/built-in-furniture",
    },
    "/services": "/services",
    "/a-propos": {
      fr: "/a-propos",
      en: "/about",
    },
    "/temoignages": {
      fr: "/temoignages",
      en: "/testimonials",
    },
    "/contact": "/contact",
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathname = keyof typeof routing.pathnames;
export type StaticPathname = Exclude<Pathname, "/realisations/[slug]">;
