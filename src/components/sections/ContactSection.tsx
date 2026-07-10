import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/sections/ContactForm";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export async function ContactSection() {
  const t = await getTranslations("contactPage");

  return (
    <Section id="contact" containerClassName="scroll-mt-24">
      <SectionHeader
        align="center"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="mx-auto mt-16 grid max-w-6xl gap-16 lg:grid-cols-5">
        <AnimatedReveal className="lg:col-span-3">
          <ContactForm />
        </AnimatedReveal>

        <AnimatedReveal delay={150} className="lg:col-span-2">
          <div className="border border-border bg-surface p-8 lg:p-10">
            <h2 className="font-display text-3xl tracking-tight">
              {t("info.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {t("info.description")}
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-wood">
                  {t("info.address")}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {t("info.addressValue")}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-wood">
                  {t("info.phone")}
                </p>
                <p className="mt-2 text-sm text-muted">
                  <a
                    href="tel:+18193221041"
                    className="transition-colors hover:text-foreground"
                  >
                    {t("info.phoneValue")}
                  </a>
                </p>
                <p className="mt-1 text-sm text-muted">
                  <a
                    href="tel:+18195071041"
                    className="transition-colors hover:text-foreground"
                  >
                    {t("info.phoneResurfacingValue")}
                  </a>
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-wood">
                  {t("info.email")}
                </p>
                <p className="mt-2 text-sm text-muted">
                  <a
                    href={`mailto:${t("info.emailValue")}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {t("info.emailValue")}
                  </a>
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-wood">
                  {t("info.hours")}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {t("info.hoursValue")}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {t("info.hoursNote")}
                </p>
              </div>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </Section>
  );
}
