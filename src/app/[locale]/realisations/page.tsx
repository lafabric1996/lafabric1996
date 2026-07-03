import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectCard } from "@/components/realisations/ProjectCard";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Section } from "@/components/ui/Section";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";
import { realisations } from "@/lib/realisations";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.realisations" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/realisations",
  });
}

export default async function RealisationsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("realisations");

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <Section className="pt-0">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {realisations.map((project, index) => (
            <AnimatedReveal key={project.slug} delay={index * 50}>
              <ProjectCard project={project} priority={index < 3} />
            </AnimatedReveal>
          ))}
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
