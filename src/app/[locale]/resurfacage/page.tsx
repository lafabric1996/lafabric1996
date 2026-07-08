import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABanner } from "@/components/sections/CTABanner";
import { ResurfacageGallery } from "@/components/sections/ResurfacageGallery";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";
import { getAllResurfacagePairs } from "@/lib/resurfacage";

const WHY_KEYS = ["economical", "durable", "fast", "responsible"] as const;
const PROCESS_KEYS = ["consultation", "selection", "fabrication", "installation"] as const;
const TESTIMONIAL_KEYS = ["isabelle", "rachel"] as const;

const WHY_ICONS: Record<(typeof WHY_KEYS)[number], React.ReactNode> = {
  economical: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2-1.1 1.5-2.5 2-2.5.9-2.5 2 1.1 2 2.5 2 2.5-.9 2.5-2" />
    </svg>
  ),
  durable: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
    </svg>
  ),
  fast: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />
    </svg>
  ),
  responsible: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 21s-7-4.5-9.5-9C1 8 3 4.5 6.5 4.5c2 0 3.3 1 4 2 0 0-4 1-4 5.5S12 21 12 21Z" />
      <path d="M12 21s7-4.5 9.5-9c1.5-4-.5-7.5-4-7.5-2 0-3.3 1-4 2" />
    </svg>
  ),
};

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "metadata.resurfacage" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/resurfacage",
  });
}

export default async function ResurfacagePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(asLocale(locale));
  const t = await getTranslations("resurfacagePage");
  const tCommon = await getTranslations("common");

  const pairs = getAllResurfacagePairs();
  const heroPair = pairs[0];
  const captions = t.raw("transformations.captions") as string[];
  const beforeLabel = t("hero.beforeLabel");
  const afterLabel = t("hero.afterLabel");
  const sliderAriaLabel = t("hero.sliderAriaLabel");

  return (
    <>
      {/* 1. Hero — comparateur avant/après */}
      <section className="relative pt-24 pb-20 md:pt-28 md:pb-28">
        <Container>
          {heroPair ? (
            <AnimatedReveal>
              <BeforeAfterSlider
                beforeSrc={heroPair.before}
                afterSrc={heroPair.after}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
                ariaLabel={sliderAriaLabel}
                className="aspect-[4/5] md:aspect-[16/9]"
                priority
                autoDemo
              />
              <p className="mt-4 text-center text-sm text-muted">
                {t("hero.sliderHint")}
              </p>
            </AnimatedReveal>
          ) : (
            <ImagePlaceholder aspectRatio="hero" label={tCommon("photoComingSoon")} />
          )}

          <AnimatedReveal delay={150} className="mx-auto mt-16 max-w-2xl text-center">
            <h1 className="font-display text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
              {t("hero.description")}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="#transformations"
                className="inline-flex items-center justify-center border border-foreground/20 px-9 py-4 text-sm font-medium uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:border-wood hover:text-wood-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood focus-visible:ring-offset-2"
              >
                {t("hero.primaryCta")}
              </a>
              <Button href="/contact" size="lg">
                {t("hero.secondaryCta")}
              </Button>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      {/* 2. Transformations */}
      <Section id="transformations" containerClassName="scroll-mt-24">
        <SectionHeader
          align="center"
          eyebrow={t("transformations.eyebrow")}
          title={t("transformations.title")}
        />
        <div className="mx-auto mt-16 max-w-4xl space-y-16">
          {pairs.map((pair, index) => (
            <AnimatedReveal key={pair.before} delay={(index % 3) * 80}>
              <BeforeAfterSlider
                beforeSrc={pair.before}
                afterSrc={pair.after}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
                ariaLabel={sliderAriaLabel}
                className="aspect-video"
              />
              <p className="mt-4 text-center text-sm text-muted">
                {captions[index % captions.length]}
              </p>
            </AnimatedReveal>
          ))}
        </div>
      </Section>

      {/* 3. Pourquoi le resurfaçage */}
      <Section variant="surface">
        <SectionHeader align="center" eyebrow={t("why.eyebrow")} title={t("why.title")} />
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_KEYS.map((key, index) => (
            <AnimatedReveal key={key} delay={index * 80}>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wood/10 text-wood">
                  {WHY_ICONS[key]}
                </div>
                <h3 className="mt-5 font-display text-xl tracking-tight">
                  {t(`why.cards.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`why.cards.${key}.description`)}
                </p>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </Section>

      {/* 4. Comment ça fonctionne */}
      <Section>
        <SectionHeader align="center" eyebrow={t("process.eyebrow")} title={t("process.title")} />
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_KEYS.map((key, index) => (
            <AnimatedReveal key={key} delay={index * 80}>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-wood font-display text-lg text-wood">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-display text-xl tracking-tight">
                  {t(`process.steps.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`process.steps.${key}.description`)}
                </p>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </Section>

      {/* 5. Galerie */}
      <Section variant="surface">
        <SectionHeader align="center" eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} />
        <ResurfacageGallery
          images={pairs.map((pair) => pair.after)}
          altPrefix={t("hero.afterLabel")}
          loadMoreLabel={t("gallery.loadMore")}
        />
      </Section>

      {/* 6. Témoignages */}
      <Section>
        <SectionHeader
          align="center"
          eyebrow={t("testimonials.eyebrow")}
          title={t("testimonials.title")}
        />
        <div className="mx-auto mt-16 grid max-w-4xl gap-12 sm:grid-cols-2">
          {TESTIMONIAL_KEYS.map((key, index) => (
            <AnimatedReveal key={key} delay={index * 80}>
              <blockquote className="text-center">
                <p className="font-display text-xl leading-relaxed tracking-tight">
                  &ldquo;{t(`testimonials.items.${key}.quote`)}&rdquo;
                </p>
                <footer className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-wood">
                  — {t(`testimonials.items.${key}.name`)}
                </footer>
              </blockquote>
            </AnimatedReveal>
          ))}
        </div>
      </Section>

      {/* 7. Appel à l'action final */}
      <CTABanner
        title={t("finalCta.title")}
        description={t("finalCta.description")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="/contact"
      />
    </>
  );
}
