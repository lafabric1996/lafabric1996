import { useTranslations } from "next-intl";
import { featuredCategoryKeys } from "@/lib/navigation";
import { Button } from "@/components/ui/Button";
import { PortfolioPlaceholderGrid } from "@/components/sections/PortfolioPlaceholderGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

type FeaturedProjectsProps = {
  limit?: number;
  showViewAll?: boolean;
};

export function FeaturedProjects({
  limit = 3,
  showViewAll = true,
}: FeaturedProjectsProps) {
  const t = useTranslations("featuredProjects");
  const tCommon = useTranslations("common");

  return (
    <Section>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        {showViewAll && (
          <Button href="/realisations" variant="outline" className="shrink-0">
            {tCommon("viewAll")}
          </Button>
        )}
      </div>
      <div className="mt-12">
        <PortfolioPlaceholderGrid
          categoryKeys={featuredCategoryKeys}
          count={limit}
        />
      </div>
    </Section>
  );
}
