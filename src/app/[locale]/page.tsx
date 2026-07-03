import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PromoVideoCard } from "@/components/sections/PromoVideoCard";
import { ProjectCard } from "@/components/realisations/ProjectCard";
import { RealisationImage } from "@/components/realisations/RealisationImage";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";
import { getFeaturedProjects, type ProjectCategory } from "@/lib/realisations";
import { getPromoVideo } from "@/lib/promo-video";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.home" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/",
  });
}

const whyChooseKeys = ["experience", "expertise", "craftsmanship", "finishing"] as const;

const expertiseItems = [
  {
    key: "kitchen",
    href: "/cuisine",
    image: "/realisations/yh2-maison-aube/Cuisine-2.png",
  },
  {
    key: "builtIn",
    href: "/mobilier-integre",
    image: "/realisations/yh2-les-blocs-de-bois/cover.png",
  },
  {
    key: "architectural",
    href: "/realisations",
    image: "/realisations/mu-architecture-l-albatros/cover.jpg",
  },
] as const;

export default async function HomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tRealisations = await getTranslations("realisations");
  const featuredProjects = getFeaturedProjects();
  const promoVideo = getPromoVideo();

  return (
    <>
      {/* 1. Hero pleine largeur */}
      <section className="relative min-h-[92vh] overflow-hidden pt-20">
        <div className="absolute inset-0">
          <ImagePlaceholder
            aspectRatio="hero"
            label={t("hero.imageLabel")}
            className="h-full min-h-[92vh] w-full aspect-auto"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <Container className="relative z-10 flex min-h-[calc(92vh-5rem)] flex-col justify-end pb-16 lg:pb-24">
          <div className="max-w-3xl animate-fade-in-up">
            {t("hero.eyebrow") && (
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-wood-light">
                {t("hero.eyebrow")}
              </p>
            )}
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-white text-balance md:text-6xl lg:text-7xl xl:text-8xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/contact" size="lg" variant="secondary">
                {t("hero.primaryCta")}
              </Button>
              <Button
                href="/realisations"
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:border-wood-light hover:bg-white/10 hover:text-white"
              >
                {t("hero.secondaryCta")}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Réalisations vedettes */}
      <Section>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow={t("featured.eyebrow")}
            title={t("featured.title")}
            description={t("featured.description")}
          />
          <Button href="/realisations" variant="outline" className="shrink-0">
            {tCommon("viewAll")}
          </Button>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <AnimatedReveal key={project.slug} delay={index * 100}>
              <ProjectCard
                project={project}
                categoryLabel={tRealisations(
                  `categories.${project.category}` as `categories.${ProjectCategory}`,
                )}
                priority={index === 0}
              />
            </AnimatedReveal>
          ))}
        </div>
      </Section>

      {/* 3. Pourquoi choisir La Fab'ric 1996 */}
      <Section>
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <AnimatedReveal>
            <SectionHeader
              eyebrow={t("whyChoose.eyebrow")}
              title={t("whyChoose.title")}
              description={t("whyChoose.description")}
            />
          </AnimatedReveal>
          <div className="grid gap-8 sm:grid-cols-2">
            {whyChooseKeys.map((key, index) => (
              <AnimatedReveal key={key} delay={index * 80}>
                <div className="border-t border-wood pt-6">
                  <h3 className="font-display text-2xl tracking-tight">
                    {t(`whyChoose.reasons.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {t(`whyChoose.reasons.${key}.description`)}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. Nos expertises */}
      <Section variant="surface">
        <SectionHeader
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          description={t("services.description")}
        />
        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-12">
          {expertiseItems.map((item, index) => (
            <AnimatedReveal key={item.key} delay={index * 80}>
              <Link
                href={item.href}
                className="group flex h-full flex-col border border-border bg-background transition-all duration-300 hover:border-wood hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <RealisationImage
                    src={item.image}
                    alt={t(`services.items.${item.key}.imageAlt`)}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
                </div>
                <div className="flex flex-1 flex-col p-8 lg:p-10">
                  <span className="mb-4 inline-block h-px w-8 bg-wood transition-all duration-300 group-hover:w-12" />
                  <h3 className="font-display text-2xl tracking-tight transition-colors group-hover:text-wood lg:text-3xl">
                    {t(`services.items.${item.key}.title`)}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted lg:text-base">
                    {t(`services.items.${item.key}.description`)}
                  </p>
                  <span className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-colors group-hover:text-wood">
                    {tCommon("learnMore")}
                  </span>
                </div>
              </Link>
            </AnimatedReveal>
          ))}
        </div>
      </Section>

      {/* 5. Vidéo Marie-Mai */}
      <Section variant="surface" className="py-24 lg:py-32">
        <AnimatedReveal>
          {promoVideo.available && promoVideo.src && promoVideo.posterSrc ? (
            <PromoVideoCard
              videoSrc={promoVideo.src}
              posterSrc={promoVideo.posterSrc}
              title={t("video.caption")}
              playLabel={t("video.play")}
              closeLabel={t("video.close")}
              ariaLabel={t("video.ariaLabel")}
            />
          ) : (
            <div className="mx-auto w-full max-w-[700px]">
              <div
                className="relative overflow-hidden rounded-2xl bg-surface shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]"
                role="img"
                aria-label={t("video.placeholder")}
              >
                <div className="flex aspect-[4/5] flex-col items-center justify-center gap-5">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white pl-1 text-foreground shadow-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                      <path d="M8 5.14v13.72L19 12 8 5.14z" />
                    </svg>
                  </span>
                  <p className="px-6 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                    {t("video.placeholder")}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-center font-display text-xl tracking-tight text-foreground sm:text-2xl">
                {t("video.caption")}
              </p>
            </div>
          )}
        </AnimatedReveal>
      </Section>

      {/* 6. Appel à l'action final */}
      <Section variant="dark">
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedReveal>
            <h2 className="font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
              {t("finalCta.title")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl">
              {t("finalCta.description")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/contact" variant="secondary" size="lg">
                {t("finalCta.primaryButton")}
              </Button>
              <Button
                href="/realisations"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:border-wood-light hover:bg-white/10 hover:text-white"
              >
                {t("finalCta.secondaryButton")}
              </Button>
            </div>
          </AnimatedReveal>
        </div>
      </Section>
    </>
  );
}
