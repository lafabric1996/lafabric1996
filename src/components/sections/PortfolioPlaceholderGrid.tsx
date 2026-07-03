import { useTranslations } from "next-intl";
import type { featuredCategoryKeys } from "@/lib/navigation";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

type CategoryKey =
  | (typeof featuredCategoryKeys)[number]
  | "realisations.categories.cuisine"
  | "realisations.categories.salle-de-bain"
  | "realisations.categories.mobilier-integre"
  | "realisations.categories.resurfacage"
  | "realisations.categories.residential";

type PortfolioPlaceholderGridProps = {
  categoryKeys: readonly CategoryKey[];
  count?: number;
};

export function PortfolioPlaceholderGrid({
  categoryKeys,
  count = 6,
}: PortfolioPlaceholderGridProps) {
  const t = useTranslations();
  const tCommon = useTranslations("common");

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => {
        const categoryKey = categoryKeys[index % categoryKeys.length]!;
        const category = t(categoryKey);

        return (
          <AnimatedReveal key={index} delay={index * 60}>
            <article className="group">
              <div className="overflow-hidden">
                <ImagePlaceholder
                  aspectRatio="portrait"
                  label={`${category} ${tCommon("photoSuffix")}`}
                  className="transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-wood">
                  {category}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {tCommon("contentComingSoon")}
                </p>
              </div>
            </article>
          </AnimatedReveal>
        );
      })}
    </div>
  );
}
