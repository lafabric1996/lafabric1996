import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/sections/PageHeader";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

type ContentBlockProps = {
  title: string;
  paragraphs: string[];
  imageLabel: string;
  imageSrc: string;
  reversed?: boolean;
};

export function ContentBlock({
  title,
  paragraphs,
  imageLabel,
  imageSrc,
  reversed = false,
}: ContentBlockProps) {

  return (
    <div
      className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
        reversed ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <AnimatedReveal>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image src={imageSrc} alt={imageLabel} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
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
  heroSrc: string;
};

export function ServicePageLayout({
  eyebrow,
  title,
  description,
  blocks,
  heroSrc,
}: ServicePageContentProps) {
  const t = useTranslations("serviceLayout");

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="relative aspect-[16/9] overflow-hidden lg:aspect-[21/9]">
        <Image src={heroSrc} alt={title} fill sizes="100vw" priority className="object-cover" />
      </div>

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
