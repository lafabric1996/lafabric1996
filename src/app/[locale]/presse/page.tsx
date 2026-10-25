import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/sections/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/PageJsonLd";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";
import { awards, getPressProject, pressMentions } from "@/lib/press";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: "metadata.presse",
  });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/presse",
  });
}

export default async function PressePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("pressePage");
  const tNav = await getTranslations("nav");

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        trail={[{ name: tNav("presse"), href: "/presse" }]}
      />

      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <Section className="pt-0">
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {t("disclaimer")}
        </p>
      </Section>

      <Section variant="surface">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          {t("awardsTitle")}
        </h2>
        <ul className="mt-10 space-y-8">
          {awards.map((award) => {
            const project = getPressProject(award.projectSlug);
            if (!project) return null;

            return (
              <li
                key={`${award.year}-${award.projectSlug}`}
                className="border-t border-border pt-6"
              >
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-wood">
                  {award.year}
                </p>
                <h3 className="mt-3 font-display text-2xl tracking-tight">
                  {t("awardName")}
                </h3>
                <p className="mt-2 text-sm text-muted">{award.organisation}</p>
                <p className="mt-4 text-base">
                  {t("projectLabel")} :{" "}
                  <Link
                    href={{
                      pathname: "/realisations/[slug]",
                      params: { slug: project.slug },
                    }}
                    className="underline underline-offset-4 transition-colors hover:text-wood"
                  >
                    {project.name}
                  </Link>
                  {" — "}
                  {project.architect}
                </p>
                <a
                  href={award.organisationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-wood transition-colors hover:text-foreground"
                >
                  {t("readArticle")} →
                </a>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section>
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          {t("pressTitle")}
        </h2>
        <ul className="mt-10 divide-y divide-border border-t border-border">
          {pressMentions.map((mention) => {
            const project = getPressProject(mention.projectSlug);
            if (!project) return null;

            return (
              <li
                key={`${mention.publication}-${mention.projectSlug}`}
                className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
              >
                <div>
                  <p className="font-display text-xl tracking-tight">
                    {mention.publication}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    <Link
                      href={{
                        pathname: "/realisations/[slug]",
                        params: { slug: project.slug },
                      }}
                      className="underline underline-offset-4 transition-colors hover:text-wood"
                    >
                      {project.name}
                    </Link>
                    {" — "}
                    {project.architect}
                  </p>
                </div>
                <a
                  href={mention.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-medium text-wood transition-colors hover:text-foreground"
                >
                  {t("readArticle")} →
                </a>
              </li>
            );
          })}
        </ul>
      </Section>

      <CTABanner />
    </>
  );
}
