import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    const legacy = [
      { source: "/salle-de-bain", destination: "/mobilier-integre", permanent: true },
      { source: "/fr/salle-de-bain", destination: "/mobilier-integre", permanent: true },
      { source: "/en/bathroom", destination: "/en/built-in-furniture", permanent: true },
      { source: "/en/salle-de-bain", destination: "/en/built-in-furniture", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/fr/contact", destination: "/#contact", permanent: true },
      { source: "/en/contact", destination: "/en#contact", permanent: true },
      { source: "/accueil", destination: "/", permanent: true },
      { source: "/r%C3%A9alisations", destination: "/realisations", permanent: true },
      { source: "/resurfa%C3%A7age", destination: "/resurfacage", permanent: true },
      { source: "/réalisations", destination: "/realisations", permanent: true },
      { source: "/resurfaçage", destination: "/resurfacage", permanent: true },
      { source: "/historique-1", destination: "/a-propos", permanent: true },
      { source: "/sitemap.website.xml", destination: "/sitemap.xml", permanent: true },
    ];
    return [
      ...legacy.map((rule) => ({ ...rule, has: [{ type: "host" as const, value: "lafabric.ca" }], destination: `https://www.lafabric.ca${rule.destination}` })),
      ...legacy,
      { source: "/:path*", has: [{ type: "host" as const, value: "lafabric.ca" }], destination: "https://www.lafabric.ca/:path*", permanent: true },
    ];
  },
  async headers() {
    return [{
      source: "/:path*",
      missing: [{ type: "host" as const, value: "www.lafabric.ca" }],
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    }];
  },
  images: {
    qualities: [75, 90],
  },
};

export default withNextIntl(nextConfig);
