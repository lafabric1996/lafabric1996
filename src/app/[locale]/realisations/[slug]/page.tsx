import studies from "@/data/project-studies.json";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { ProjectDetailGallery } from "@/components/realisations/ProjectDetailGallery";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BreadcrumbJsonLd, ProjectJsonLd } from "@/components/seo/PageJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";
import {
  getProjectBySlug,
  realisations,
  type ProjectCategory,
} from "@/lib/realisations";

type ProjectPageProps = LocalePageProps & {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return realisations.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return {};
  const study = studies[slug as keyof typeof studies]?.[asLocale(locale)];

  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.realisations" });

  return createPageMetadata({
    locale,
    title: project.title,
    description: study?.intro ?? t("projectDescription", { project: project.title }),
    pathname: { pathname: "/realisations/[slug]", params: { slug: project.slug } },
    image: project.cover,
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(asLocale(locale));
  const project = getProjectBySlug(slug);

  if (!project) notFound();
  const study = studies[slug as keyof typeof studies]?.[asLocale(locale)];

  const t = await getTranslations("realisations");
  const categoryLabel = t(
    `categories.${project.category}` as `categories.${ProjectCategory}`,
  );
  const tNav = await getTranslations("nav");

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        trail={[
          { name: tNav("realisations"), href: "/realisations" },
          { name: project.title },
        ]}
      />
      <ProjectJsonLd locale={locale} project={project} />
      <section className="pt-20">
        <Container className="py-16 lg:py-24">
          <Button
            href="/realisations"
            variant="ghost"
            size="sm"
            className="mb-8 -ml-2"
          >
            ← {t("backToGallery")}
          </Button>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-wood">
            {categoryLabel}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight tracking-tight md:text-6xl">
            {project.title}
          </h1>
          {(study?.intro || project.description) && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              {study?.intro ?? project.description}
            </p>
          )}
        </Container>

        <ProjectDetailGallery
          images={project.images}
          projectTitle={project.title}
          cover={project.cover}
          variant="cover"
        />
      </section>

      {study ? <Section variant="surface">
        <div className="grid gap-10 md:grid-cols-2">
          {study.sections.map((section) => <div key={section.title}>
            <h2 className="font-display text-3xl">{section.title}</h2>
            <p className="mt-4 leading-relaxed text-muted">{section.text}</p>
          </div>)}
        </div>
      </Section> : null}
      <Section>
        <ProjectDetailGallery images={project.images} projectTitle={project.title} cover={project.cover} />
      </Section>

      <Section variant="surface">
        <h2 className="font-display text-3xl">{t("relatedServices")}</h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button href="/cuisine" variant="outline">{tNav("cuisine")}</Button>
          <Button href="/mobilier-integre" variant="outline">{tNav("mobilierIntegre")}</Button>
        </div>
      </Section>
      <CTABanner primaryLabel={t("projectCta")} primaryHref={{ pathname: "/", query: { service: "ebenisterie", projet: project.slug }, hash: "contact" }} />
    </>
  );
}
