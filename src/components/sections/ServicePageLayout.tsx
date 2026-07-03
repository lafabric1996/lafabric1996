import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/sections/PageHeader";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

type ContentBlockProps = {
  title: string;
  paragraphs: string[];
  imageLabel?: string;
  reversed?: boolean;
};

export function ContentBlock({
  title,
  paragraphs,
  imageLabel,
  reversed = false,
}: ContentBlockProps) {
  const tCommon = useTranslations("common");

  return (
    <div
      className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
        reversed ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <AnimatedReveal>
        <ImagePlaceholder
          aspectRatio="portrait"
          label={imageLabel ?? tCommon("photoComingSoon")}
        />
      </AnimatedReveal>
      <AnimatedReveal delay={150}>
        <h3 className="font-display text-3xl tracking-tight md:text-4xl">
          {title}
        </h3>
        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </AnimatedReveal>
    </div>
  );
}

type ServicePageContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  blocks: ContentBlockProps[];
};

export function ServicePageLayout({
  eyebrow,
  title,
  description,
  blocks,
}: ServicePageContentProps) {
  const t = useTranslations("serviceLayout");
  const tCommon = useTranslations("common");

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <ImagePlaceholder
        aspectRatio="wide"
        label={`${title} ${tCommon("photoSuffix")}`}
      />

      <Section>
        <SectionHeader
          eyebrow={t("approachEyebrow")}
          title={t("approachTitle")}
          description={t("approachDescription")}
        />
        <div className="mt-16 space-y-24">
          {blocks.map((block, index) => (
            <ContentBlock key={block.title} {...block} reversed={index % 2 === 1} />
          ))}
        </div>
      </Section>
    </>
  );
}
