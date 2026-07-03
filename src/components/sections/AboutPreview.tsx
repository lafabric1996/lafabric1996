import { useTranslations } from "next-intl";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";

export function AboutPreview() {
  const t = useTranslations("aboutPreview");

  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <AnimatedReveal>
          <ImagePlaceholder aspectRatio="portrait" label={t("workshopPhoto")} />
        </AnimatedReveal>
        <AnimatedReveal delay={150}>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-wood">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
            {t("title")}
          </h2>
          <div className="mt-6 space-y-4 text-muted leading-relaxed">
            <p>{t("paragraph1")}</p>
            <p>{t("paragraph2")}</p>
          </div>
          <div className="mt-8">
            <Button href="/a-propos" variant="outline">
              {t("cta")}
            </Button>
          </div>
        </AnimatedReveal>
      </div>
    </Section>
  );
}
