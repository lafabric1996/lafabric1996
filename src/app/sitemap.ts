import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type StaticPathname } from "@/i18n/routing";
import { realisations } from "@/lib/realisations";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lafabric1996.ca";

const staticPathnames = [
  "/",
  "/realisations",
  "/resurfacage",
  "/cuisine",
  "/salle-de-bain",
  "/mobilier-integre",
  "/services",
  "/a-propos",
  "/temoignages",
  "/contact",
] as const satisfies readonly StaticPathname[];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticPathnames.flatMap((pathname) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale === "fr" ? "fr-CA" : "en-CA",
        `${BASE_URL}${getPathname({ locale, href: pathname })}`,
      ]),
    );

    return routing.locales.map((locale) => ({
      url: `${BASE_URL}${getPathname({ locale, href: pathname })}`,
      lastModified: new Date(),
      changeFrequency: pathname === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: pathname === "/" ? 1 : 0.8,
      alternates: { languages },
    }));
  });

  const projectEntries = realisations.flatMap((project) => {
    const href = {
      pathname: "/realisations/[slug]" as const,
      params: { slug: project.slug },
    };

    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale === "fr" ? "fr-CA" : "en-CA",
        `${BASE_URL}${getPathname({ locale, href })}`,
      ]),
    );

    return routing.locales.map((locale) => ({
      url: `${BASE_URL}${getPathname({ locale, href })}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages },
    }));
  });

  return [...staticEntries, ...projectEntries];
}
