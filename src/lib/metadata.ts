import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import type { Locale, StaticPathname } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/* Image de partage utilisée quand la page n'en fournit pas la sienne. */
const DEFAULT_OG_IMAGE = "/images/hero-atelier-20261024.jpg";

type ProjectPathnameWithParams = {
  pathname: "/realisations/[slug]";
  params: { slug: string };
};

type PathnameOption = StaticPathname | ProjectPathnameWithParams;

type PageMetadataOptions = {
  locale: Locale | string;
  title?: string;
  description?: string;
  pathname?: PathnameOption;
  /** Root-relative path (e.g. project.cover) resolved against metadataBase for og:image. */
  image?: string;
};

function getLocalizedUrl(locale: Locale | string, pathname: PathnameOption = "/"): string {
  const path = getPathname({ locale: locale as Locale, href: pathname });
  return `${SITE_URL}${path}`;
}

export function createPageMetadata({
  locale,
  title,
  description,
  pathname = "/",
  image,
}: PageMetadataOptions): Metadata {
  const resolvedLocale = locale as Locale;
  const subject = title || (resolvedLocale === "fr"
    ? "Ébénisterie sur mesure dans les Laurentides"
    : "Custom Cabinetmaking in the Laurentians");
  const pageTitle = pathname === "/" || !title
    ? `${SITE_NAME} | ${subject}`
    : `${subject} | ${SITE_NAME}`;

  const url = getLocalizedUrl(resolvedLocale, pathname);

  const ogImage = image ?? DEFAULT_OG_IMAGE;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc === "fr" ? "fr-CA" : "en-CA"] = getLocalizedUrl(loc, pathname);
  }

  languages["x-default"] = getLocalizedUrl("fr", pathname);

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: resolvedLocale === "fr" ? "fr_CA" : "en_CA",
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export { getLocalizedUrl };
