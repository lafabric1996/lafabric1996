import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactSection } from "@/components/sections/ContactSection";
import { ResurfacageGallery } from "@/components/sections/ResurfacageGallery";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/PageJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";
import { getAllResurfacagePairs } from "@/lib/resurfacage";
import { PHONE_REFACING_HREF } from "@/lib/phone";

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
  const tNav = await getTranslations("nav");
  const tSeo = await getTranslations("metadata.resurfacage");
  const tCommon = await getTranslations("common");

  const pairs = getAllResurfacagePairs();
  const transformationPairs = [
    {
      before: "/resurfacage/transformation-20261016/avant.webp",
      after: "/resurfacage/transformation-20261016/apres.webp",
    },
    {
      before: "/resurfacage/transformation-03-20261016/avant.webp",
      after: "/resurfacage/transformation-03-20261016/apres.webp",
    },
    {
      before: "/resurfacage/transformation-04-20261016/avant.webp",
      after: "/resurfacage/transformation-04-20261016/apres.webp",
    },
    {
      before: "/resurfacage/accueil/avant.webp",
      after: "/resurfacage/accueil/apres.webp",
    },
    ...pairs.slice(4).map((pair) =>
      pair.before === "/resurfacage/christian-simon/avant-5.webp"
        ? { ...pair, after: "/resurfacage/transformation-finale-20261016/apres.webp" }
        : pair,
    ),
  ];
  const heroPair = {
    before: "/resurfacage/hero-20261016/avant.webp",
    after: "/resurfacage/hero-20261016/apres.webp",
  };
  const captions = t.raw("transformations.captions") as string[];
  const beforeLabel = t("hero.beforeLabel");
  const afterLabel = t("hero.afterLabel");
  const sliderAriaLabel = t("hero.sliderAriaLabel");

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        trail={[{ name: tNav("resurfacage"), href: "/resurfacage" }]}
      />
      <ServiceJsonLd
        locale={locale}
        pathname="/resurfacage"
        serviceType={tSeo("title")}
        description={tSeo("description")}
      />
      {/* 1. Hero — comparateur avant/après */}
      <section className="relative pt-24 pb-20 md:pt-28 md:pb-28">
        <Container>
          {heroPair ? (
            <AnimatedReveal>
              <BeforeAfterSlider
                beforeSrc={heroPair.before}
                afterSrc={heroPair.after}
                beforeAlt={`${beforeLabel} — ${t("hero.title")}`}
                afterAlt={`${afterLabel} — ${t("hero.title")}`}
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
              <a
                href="#contact"
                className="inline-flex items-center justify-center border border-transparent bg-foreground px-9 py-4 text-sm font-medium uppercase tracking-[0.2em] text-background transition-all duration-300 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood focus-visible:ring-offset-2"
              >
                {t("hero.secondaryCta")}
              </a>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      {/* 2. Pourquoi le resurfaçage — remonté pour la réassurance */}
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

      {/* 3. Transformations */}
      <Section id="transformations" containerClassName="scroll-mt-24">
        <SectionHeader
          align="center"
          eyebrow={t("transformations.eyebrow")}
          title={t("transformations.title")}
        />
        <div className="mx-auto mt-16 max-w-4xl space-y-16">
          {transformationPairs.map((pair, index) => (
            <AnimatedReveal key={pair.before} delay={(index % 3) * 80}>
              <BeforeAfterSlider
                beforeSrc={pair.before}
                afterSrc={pair.after}
                beforeAlt={`${beforeLabel} — ${t("hero.title")}`}
                afterAlt={`${afterLabel} — ${t("hero.title")}`}
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

      {/* 5. Le resurfaçage convient-il ? — garde les mauvais prospects hors du formulaire */}
      <Section variant="surface">
        <SectionHeader title={t("guide.title")} description={t("guide.intro")} />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {(t.raw("guide.items") as { title: string; text: string }[]).map((item) => (
            <div key={item.title} className="border-t border-border pt-6">
              <h3 className="font-display text-2xl">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button href="/cuisine" variant="outline">{t("guide.kitchenLink")}</Button>
          <a className="underline underline-offset-4" href={PHONE_REFACING_HREF} data-service="resurfacage">{t("guide.phone")} : {t("guide.phoneNumber")}</a>
        </div>
      </Section>
      {/* 5. Galerie */}
      <Section variant="surface">
        <SectionHeader align="center" eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} />
        <ResurfacageGallery
          images={[
            "/resurfacage/galerie-20261016/cuisine.webp",
            "/resurfacage/galerie-20261016/coin-repas.webp",
            ...pairs.map((pair) => pair.after),
          ]}
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

      {/* Formulaire de soumission, sur la page même */}
      <ContactSection
        defaultService="resurfacage"
        eyebrow={t("finalCta.eyebrow")}
        title={t("finalCta.title")}
        description={t("finalCta.formDescription")}
      />
    </>
  );
}
