import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { serviceGridItems } from "@/lib/navigation";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ServicesGrid() {
  const t = useTranslations("servicesGrid");
  const tCommon = useTranslations("common");

  return (
    <Section variant="surface">
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {serviceGridItems.map((service, index) => (
          <AnimatedReveal key={service.key} delay={index * 80}>
            <Link
              href={service.href}
              className="group flex h-full flex-col border border-border bg-background p-8 transition-all duration-300 hover:border-wood hover:shadow-lg"
            >
              <span className="mb-4 inline-block h-px w-8 bg-wood transition-all duration-300 group-hover:w-12" />
              <h3 className="font-display text-2xl tracking-tight transition-colors group-hover:text-wood">
                {t(`items.${service.key}.title`)}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                {t(`items.${service.key}.description`)}
              </p>
              <span className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-colors group-hover:text-wood">
                {tCommon("learnMore")}
              </span>
            </Link>
          </AnimatedReveal>
        ))}
      </div>
    </Section>
  );
}
