import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactSection } from "@/components/sections/ContactSection";
import { HomeFeatured } from "@/components/sections/HomeFeatured";
import { HomeTestimonials } from "@/components/sections/HomeTestimonials";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ProofBar } from "@/components/sections/ProofBar";
import { PromoVideoCard } from "@/components/sections/PromoVideoCard";
import { ScrollToContact } from "@/components/sections/ScrollToContact";
import { TwoTrades } from "@/components/sections/TwoTrades";
import { WorkshopBlock } from "@/components/sections/WorkshopBlock";
import { RealisationImage } from "@/components/realisations/RealisationImage";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";
import { getPromoVideo } from "@/lib/promo-video";
import { getHeroVideo } from "@/lib/hero-video";

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

/** Seule photo du fonds en résolution suffisante pour un plein écran (6036×4024). */
const HERO_IMAGE =
  "/realisations/dany-courchesne-architecte-projet-eric-bergevin/BoisclairHR_CLavallee-4.jpg";

export default async function HomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("home");
  const promoVideo = getPromoVideo();
  const heroVideo = getHeroVideo();

  return (
    <>
      <ScrollToContact />

      {/* 1. Hero */}
      <section className="relative min-h-[92vh] overflow-hidden pt-20">
        <div className="absolute inset-0">
          {heroVideo.available && heroVideo.src ? (
            <video
              className="h-full min-h-[92vh] w-full object-cover"
              src={heroVideo.src}
              poster={heroVideo.posterSrc ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          ) : (
            <RealisationImage
              src={HERO_IMAGE}
              alt={t("hero.imageAlt")}
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <Container className="relative z-10 flex min-h-[calc(92vh-5rem)] flex-col justify-end pb-16 lg:pb-24">
          <div className="max-w-3xl animate-fade-in-up">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-white/70">
              {t("hero.eyebrow")}
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-white text-balance md:text-6xl lg:text-7xl xl:text-8xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center border border-transparent bg-white px-9 py-4 text-sm font-medium uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                {t("hero.primaryCta")}
              </a>
              <Button
                href="/realisations"
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:border-white hover:bg-white/10 hover:text-white"
              >
                {t("hero.secondaryCta")}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Bande de preuves */}
      <ProofBar />

      {/* 3. Les deux métiers */}
      <TwoTrades />

      {/* 4. Réalisations */}
      <HomeFeatured />

      {/* 5. Marie-Mai, pleine largeur */}
      {promoVideo.available && promoVideo.src && promoVideo.posterSrc ? (
        <Section variant="dark" className="py-20 lg:py-24">
          <AnimatedReveal>
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
              <PromoVideoCard
                videoSrc={promoVideo.src}
                posterSrc={promoVideo.posterSrc}
                title={t("video.caption")}
                playLabel={t("video.play")}
                closeLabel={t("video.close")}
                ariaLabel={t("video.ariaLabel")}
                className="max-w-[380px]"
                showCaption={false}
              />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">
                  {t("video.eyebrow")}
                </p>
                <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight md:text-5xl">
                  {t("video.caption")}
                </h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
                  {t("video.quote")}
                </p>
              </div>
            </div>
          </AnimatedReveal>
        </Section>
      ) : null}

      {/* 6. Processus */}
      <ProcessSteps />

      {/* 7. L'atelier */}
      <WorkshopBlock />

      {/* 8. Témoignages */}
      <HomeTestimonials />

      {/* 9. Formulaire (la bannière d'appel à l'action y est fusionnée) */}
      <ContactSection />
    </>
  );
}
