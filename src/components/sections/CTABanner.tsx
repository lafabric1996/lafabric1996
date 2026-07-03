import { useTranslations } from "next-intl";
import type { StaticPathname } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

type CTABannerProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: StaticPathname;
};

export function CTABanner({
  title,
  description,
  primaryLabel,
  primaryHref = "/contact",
}: CTABannerProps) {
  const t = useTranslations("cta");

  return (
    <Section variant="dark">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
          {title ?? t("defaultTitle")}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl">
          {description ?? t("defaultDescription")}
        </p>
        <div className="mt-10">
          <Button href={primaryHref} variant="secondary" size="lg">
            {primaryLabel ?? t("defaultButton")}
          </Button>
        </div>
      </div>
    </Section>
  );
}
