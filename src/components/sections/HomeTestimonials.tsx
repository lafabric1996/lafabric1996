import { getTranslations } from "next-intl/server";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

const testimonialKeys = ["isabelle", "rachel"] as const;

/**
 * Les deux vrais avis Google, jusqu'ici visibles uniquement sur la page
 * Resurfaçage. Le texte reste dans le namespace resurfacagePage pour ne pas
 * dupliquer une citation client à deux endroits.
 */
export async function HomeTestimonials() {
  const t = await getTranslations("home.testimonials");
  const tItems = await getTranslations("resurfacagePage.testimonials.items");

  return (
    <Section variant="surface">
      <SectionHeader
        align="center"
        eyebrow={t("eyebrow")}
        title={t("title")}
        className="mx-auto text-center"
      />

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2 lg:gap-14">
        {testimonialKeys.map((key, index) => (
          <AnimatedReveal key={key} delay={index * 120}>
            <figure className="flex h-full flex-col border-t border-foreground pt-6">
              <blockquote className="flex-1 font-display text-xl leading-relaxed tracking-tight lg:text-2xl">
                &laquo;&nbsp;{tItems(`${key}.quote`)}&nbsp;&raquo;
              </blockquote>
              <figcaption className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-muted">
                {tItems(`${key}.name`)}
                <span className="mx-2 text-muted/50" aria-hidden="true">
                  ·
                </span>
                {t("source")}
              </figcaption>
            </figure>
          </AnimatedReveal>
        ))}
      </div>
    </Section>
  );
}
