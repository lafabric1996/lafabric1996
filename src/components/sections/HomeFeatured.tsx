import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RealisationImage } from "@/components/realisations/RealisationImage";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFeaturedProjects } from "@/lib/realisations";

/**
 * Le premier projet occupe toute la largeur, les deux suivants se partagent la
 * ligne : la page cesse d'aligner trois cartes identiques et donne enfin du
 * poids aux photos, qui sont l'argument principal.
 */
export async function HomeFeatured() {
  const t = await getTranslations("home.featured");
  const [lead, ...rest] = getFeaturedProjects();

  if (!lead) return null;

  return (
    <Section>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
      </div>

      <AnimatedReveal className="mt-12">
        <Link
          href={{ pathname: "/realisations/[slug]", params: { slug: lead.slug } }}
          className="group block"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-surface lg:aspect-[21/9]">
            <RealisationImage
              src={lead.cover}
              alt={lead.title}
              sizes="100vw"
              className="transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
          <h3 className="mt-5 font-display text-3xl tracking-tight transition-opacity group-hover:opacity-70 lg:text-4xl">
            {lead.title}
          </h3>
        </Link>
      </AnimatedReveal>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:gap-10">
        {rest.map((project, index) => (
          <AnimatedReveal key={project.slug} delay={index * 120}>
            <Link
              href={{
                pathname: "/realisations/[slug]",
                params: { slug: project.slug },
              }}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <RealisationImage
                  src={project.cover}
                  alt={project.title}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 font-display text-2xl tracking-tight transition-opacity group-hover:opacity-70 lg:text-3xl">
                {project.title}
              </h3>
            </Link>
          </AnimatedReveal>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/realisations"
          className="text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-opacity hover:opacity-70"
        >
          {t("viewAll")} →
        </Link>
      </div>
    </Section>
  );
}
