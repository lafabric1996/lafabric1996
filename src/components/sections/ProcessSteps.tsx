import { getTranslations } from "next-intl/server";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

const stepKeys = ["meeting", "design", "build", "install"] as const;

/** Les étapes sont une vraie séquence : la numérotation porte de l'information. */
export async function ProcessSteps() {
  const t = await getTranslations("home.process");

  return (
    <Section variant="surface">
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {stepKeys.map((key, index) => (
          <AnimatedReveal key={key} delay={index * 80}>
            <li className="border-t border-foreground pt-5">
              <span className="font-display text-2xl tabular-nums text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-2xl tracking-tight">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t(`steps.${key}.description`)}
              </p>
            </li>
          </AnimatedReveal>
        ))}
      </ol>
    </Section>
  );
}
