import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RealisationImage } from "@/components/realisations/RealisationImage";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getAllResurfacagePairs } from "@/lib/resurfacage";

const CUSTOM_IMAGE = "/realisations/mu-architecture-l-albatros/cover.jpg";

/**
 * La bifurcation principale du site : neuf sur mesure d'un côté, resurfaçage
 * de l'autre. C'est la décision que le visiteur doit prendre en premier, et le
 * resurfaçage — la ligne d'affaires la plus accessible — devient enfin visible
 * dès l'accueil.
 */
export async function TwoTrades() {
  const t = await getTranslations("home.trades");
  const tCommon = await getTranslations("common");
  const pair = getAllResurfacagePairs()[0];

  return (
    <Section>
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <AnimatedReveal>
          <Link
            href="/realisations"
            className="group flex h-full flex-col border border-border bg-background transition-colors duration-300 hover:border-foreground"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              <RealisationImage
                src={CUSTOM_IMAGE}
                alt={t("custom.imageAlt")}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col p-8 lg:p-10">
              <h3 className="font-display text-3xl tracking-tight lg:text-4xl">
                {t("custom.title")}
              </h3>
              <p className="mt-4 flex-1 text-base leading-relaxed text-muted">
                {t("custom.description")}
              </p>
              <span className="mt-8 text-xs font-medium uppercase tracking-[0.15em] text-foreground">
                {t("custom.cta")} →
              </span>
            </div>
          </Link>
        </AnimatedReveal>

        <AnimatedReveal delay={120}>
          <div className="flex h-full flex-col border border-border bg-background">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              {pair ? (
                <BeforeAfterSlider
                  beforeSrc={pair.before}
                  afterSrc={pair.after}
                  beforeLabel={tCommon("before")}
                  afterLabel={tCommon("after")}
                  ariaLabel={t("refacing.sliderHint")}
                  className="h-full"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col p-8 lg:p-10">
              <h3 className="font-display text-3xl tracking-tight lg:text-4xl">
                {t("refacing.title")}
              </h3>
              <p className="mt-4 flex-1 text-base leading-relaxed text-muted">
                {t("refacing.description")}
              </p>
              <Link
                href="/resurfacage"
                className="mt-8 text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-opacity hover:opacity-70"
              >
                {t("refacing.cta")} →
              </Link>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </Section>
  );
}
