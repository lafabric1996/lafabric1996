import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { ProjectDetailGallery } from "@/components/realisations/ProjectDetailGallery";
import { RealisationImage } from "@/components/realisations/RealisationImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
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

  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.realisations" });

  return createPageMetadata({
    locale,
    title: project.title,
    description: t("description"),
    pathname: "/realisations",
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(asLocale(locale));
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const t = await getTranslations("realisations");
  const categoryLabel = t(
    `categories.${project.category}` as `categories.${ProjectCategory}`,
  );

  return (
    <>
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
        </Container>

        <div className="relative aspect-[21/9] w-full bg-surface">
          <RealisationImage
            src={project.cover}
            alt={project.title}
            priority
            sizes="100vw"
          />
        </div>
      </section>

      <Section>
        <ProjectDetailGallery images={project.images} projectTitle={project.title} />
      </Section>

      <CTABanner />
    </>
  );
}
