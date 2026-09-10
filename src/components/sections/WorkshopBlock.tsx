import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Section } from "@/components/ui/Section";

/**
 * Remplace l'ancien bloc « Notre différence » et ses quatre arguments
 * interchangeables. L'atelier et la famille sont ce que les gros
 * concurrents ne peuvent pas copier.
 */
export async function WorkshopBlock() {
  const t = await getTranslations("home.workshop");

  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <AnimatedReveal>
          <div className="relative aspect-[4/3] overflow-hidden bg-surface">
            <Image
              src="/images/atelier.png"
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={120}>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-wood">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {t("paragraph1")}
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {t("paragraph2")}
          </p>
          <Link
            href="/a-propos"
            className="mt-8 inline-block text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-opacity hover:opacity-70"
          >
            {t("cta")} →
          </Link>
        </AnimatedReveal>
      </div>
    </Section>
  );
}
