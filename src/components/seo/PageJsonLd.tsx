import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { asLocale } from "@/lib/i18n-server";
import type { Locale, StaticPathname } from "@/i18n/routing";
import type { RealisationProject } from "@/lib/realisations";

const SITE_URL = "https://www.lafabric.ca";
/** Même identifiant que le bloc HomeAndConstructionBusiness de <JsonLd />. */
const BUSINESS_ID = `${SITE_URL}/#business`;

type ProjectHref = {
  pathname: "/realisations/[slug]";
  params: { slug: string };
};

type Href = StaticPathname | ProjectHref;

function absoluteUrl(locale: Locale, href: Href): string {
  return `${SITE_URL}${getPathname({ locale, href })}`;
}

function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type Crumb = { name: string; href?: Href };

/**
 * Fil d'Ariane. Le dernier maillon est la page courante et ne porte pas
 * d'URL, conformément aux recommandations de Google.
 */
export async function BreadcrumbJsonLd({
  locale,
  trail,
}: {
  locale: string;
  trail: Crumb[];
}) {
  const resolved = asLocale(locale);
  const tNav = await getTranslations({ locale: resolved, namespace: "nav" });

  const items = [{ name: tNav("home"), href: "/" as StaticPathname }, ...trail];

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          ...(crumb.href && index < items.length - 1
            ? { item: absoluteUrl(resolved, crumb.href) }
            : {}),
        })),
      }}
    />
  );
}

/** Bloc Service rattaché à l'entreprise, pour une page de service. */
export async function ServiceJsonLd({
  locale,
  pathname,
  serviceType,
  description,
}: {
  locale: string;
  pathname: StaticPathname;
  serviceType: string;
  description: string;
}) {
  const resolved = asLocale(locale);
  const tJson = await getTranslations({ locale: resolved, namespace: "jsonLd" });

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType,
        description,
        url: absoluteUrl(resolved, pathname),
        provider: { "@id": BUSINESS_ID },
        areaServed: {
          "@type": "AdministrativeArea",
          name: tJson("areaServed"),
        },
      }}
    />
  );
}

/** Bloc CreativeWork pour une page de réalisation. */
export function ProjectJsonLd({
  locale,
  project,
}: {
  locale: string;
  project: RealisationProject;
}) {
  const resolved = asLocale(locale);
  const href: ProjectHref = {
    pathname: "/realisations/[slug]",
    params: { slug: project.slug },
  };

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        url: absoluteUrl(resolved, href),
        creator: { "@id": BUSINESS_ID },
        ...(project.description ? { description: project.description } : {}),
        image: [project.cover, ...project.images.slice(0, 9).map((i) => i.src)]
          .filter((src, index, all) => all.indexOf(src) === index)
          .map((src) => `${SITE_URL}${src}`),
      }}
    />
  );
}
