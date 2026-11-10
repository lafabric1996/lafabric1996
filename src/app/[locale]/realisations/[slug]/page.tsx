import frMessages from "@/messages/fr.json";
import enMessages from "@/messages/en.json";
import { ProjectAwards } from "@/components/realisations/ProjectAwards";
import { ProjectVideo } from "@/components/realisations/ProjectVideo";
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

  const tAube = await getTranslations({ locale: asLocale(locale), namespace: "maisonAube" });
  return createPageMetadata({
    locale,
    title: slug === "yh2-maison-aube" ? tAube("seoTitle") : project.title,
    description: slug === "yh2-maison-aube" ? tAube("seoDescription") : study?.intro ?? t("projectDescription", { project: project.title }),
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
  const tAube = await getTranslations("maisonAube");
  const isAube = slug === "yh2-maison-aube";
  const imageAlts: Record<string, string> = (locale === "en" ? enMessages : frMessages).maisonAube.imageAlts;
  const images = isAube ? project.images.map(image => ({
    ...image,
    alt: imageAlts[image.src.split("/").pop()!.replace(".webp", "")] ?? image.alt,
  })) : project.images;
  const galleryTitle = isAube ? tAube("imageAlts.photo-722") : project.title;
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
      <ProjectJsonLd locale={locale} project={isAube ? { ...project, description: study?.intro } : project} architecturalProject={isAube} />
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
          images={images}
          projectTitle={project.title}
          coverAlt={galleryTitle}
          cover={project.cover}
          variant="cover"
        />
      </section>

      {isAube ? <Container className="py-6">
        <p className="text-sm text-muted">{tAube("architect")}</p>
        <p className="mt-2 text-xs text-muted">{tAube("photoCredit")}</p>
        <a href="https://www.yh2architecture.com/fr/projets/maison-aube" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm underline underline-offset-4">{tAube("architectLink")} ↗</a>
      </Container> : null}

      {study ? <Section variant="surface">
        <div className="grid gap-10 md:grid-cols-2">
          {study.sections.map((section) => <div key={section.title}>
            <h2 className="font-display text-3xl">{section.title}</h2>
            <p className="mt-4 leading-relaxed text-muted">{section.text}</p>
          </div>)}
        </div>
      </Section> : null}
      {isAube ? <ProjectAwards slug={slug} /> : null}
      <Section>
        {isAube ? <div className="mb-10"><h2 className="font-display text-3xl md:text-4xl">{tAube("galleryTitle")}</h2><p className="mt-4 text-muted">{tAube("galleryText")}</p></div> : null}
        <ProjectDetailGallery images={images} projectTitle={project.title} cover={project.cover} />
      </Section>

      {isAube ? <Section variant="surface">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-wood">{tAube("interviewEyebrow")}</p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">{tAube("interviewTitle")}</h2>
          <p className="mt-5 leading-relaxed text-muted">{tAube("interviewText")}</p>
          <a href="https://www.youtube.com/watch?v=egzuchDIRKs" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block border-b border-foreground pb-2 text-sm hover:text-wood">{tAube("interviewLink")} ↗<span className="sr-only"> — {tAube("newTab")}</span></a>
        </div>
      </Section> : null}
      <ProjectVideo slug={slug} />

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
