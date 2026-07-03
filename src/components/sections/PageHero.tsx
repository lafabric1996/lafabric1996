import { useTranslations } from "next-intl";
import type { StaticPathname } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: StaticPathname };
  secondaryCta?: { label: string; href: StaticPathname };
  showImage?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  showImage = true,
}: PageHeroProps) {
  const tCommon = useTranslations("common");

  return (
    <section className="relative overflow-hidden pt-20">
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="animate-fade-in-up">
          {eyebrow && (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-wood">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            {description}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              {primaryCta && (
                <Button href={primaryCta.href} size="lg">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="outline" size="lg">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </div>
        {showImage && (
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <ImagePlaceholder
              aspectRatio="hero"
              label={tCommon("mainPhotoComingSoon")}
            />
          </div>
        )}
      </Container>
    </section>
  );
}
