import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
  },
  images: {
    qualities: [75, 90],
  },
};

export default withNextIntl(nextConfig);
