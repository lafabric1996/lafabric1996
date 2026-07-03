import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import type { Locale, StaticPathname } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lafabric1996.ca";

type PageMetadataOptions = {
  locale: Locale | string;
  title?: string;
  description?: string;
  pathname?: StaticPathname;
};

function getLocalizedUrl(locale: Locale | string, pathname: StaticPathname = "/"): string {
  const path = getPathname({ locale: locale as Locale, href: pathname });
  return `${BASE_URL}${path}`;
}

export function createPageMetadata({
  locale,
  title,
  description,
  pathname = "/",
}: PageMetadataOptions): Metadata {
  const resolvedLocale = locale as Locale;
  const pageTitle = title
    ? `${title} | La Fab'ric 1996`
    : resolvedLocale === "fr"
      ? "La Fab'ric 1996 | Ébénisterie et rénovation haut de gamme"
      : "La Fab'ric 1996 | Premium Woodworking & Renovation";

  const url = getLocalizedUrl(resolvedLocale, pathname);

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc === "fr" ? "fr-CA" : "en-CA"] = getLocalizedUrl(loc, pathname);
  }

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: "La Fab'ric 1996",
      locale: resolvedLocale === "fr" ? "fr_CA" : "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export { getLocalizedUrl };
