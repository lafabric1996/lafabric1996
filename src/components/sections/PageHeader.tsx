import { Container } from "@/components/ui/Container";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="pt-20">
      <Container className="py-16 lg:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-wood">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight tracking-tight md:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          {description}
        </p>
      </Container>
    </section>
  );
}
