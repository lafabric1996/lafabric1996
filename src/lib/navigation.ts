import type { Pathname, StaticPathname } from "@/i18n/routing";

export type NavLabelKey =
  | "home"
  | "realisations"
  | "cuisine"
  | "salleDeBain"
  | "mobilierIntegre"
  | "services"
  | "aPropos"
  | "temoignages"
  | "contact";

export type NavItem = {
  labelKey: NavLabelKey;
  href: StaticPathname;
};

export const mainNavigation: NavItem[] = [
  { labelKey: "home", href: "/" },
  { labelKey: "realisations", href: "/realisations" },
  { labelKey: "cuisine", href: "/cuisine" },
  { labelKey: "salleDeBain", href: "/salle-de-bain" },
  { labelKey: "mobilierIntegre", href: "/mobilier-integre" },
  { labelKey: "services", href: "/services" },
  { labelKey: "aPropos", href: "/a-propos" },
  { labelKey: "temoignages", href: "/temoignages" },
  { labelKey: "contact", href: "/contact" },
];

export const footerNavigation: NavItem[] = [
  { labelKey: "realisations", href: "/realisations" },
  { labelKey: "services", href: "/services" },
  { labelKey: "aPropos", href: "/a-propos" },
  { labelKey: "contact", href: "/contact" },
];

export const serviceNavigation: NavItem[] = [
  { labelKey: "cuisine", href: "/cuisine" },
  { labelKey: "salleDeBain", href: "/salle-de-bain" },
  { labelKey: "mobilierIntegre", href: "/mobilier-integre" },
];

export const serviceGridItems = [
  { key: "resurfacing", href: "/cuisine" as const },
  { key: "kitchen", href: "/cuisine" as const },
  { key: "bathroom", href: "/salle-de-bain" as const },
  { key: "builtIn", href: "/mobilier-integre" as const },
  { key: "customWoodwork", href: "/services" as const },
  { key: "residential", href: "/realisations" as const },
] as const;

export const portfolioCategoryKeys = [
  "realisations.categories.cuisine",
  "realisations.categories.salle-de-bain",
  "realisations.categories.mobilier-integre",
  "realisations.categories.residential",
] as const;

export const featuredCategoryKeys = [
  "realisations.categories.cuisine",
  "realisations.categories.salle-de-bain",
  "realisations.categories.mobilier-integre",
] as const;

export const filterCategoryKeys = [
  "realisations.categories.all",
  "realisations.categories.cuisine",
  "realisations.categories.salle-de-bain",
  "realisations.categories.mobilier-integre",
  "realisations.categories.resurfacage",
  "realisations.categories.residential",
] as const;
