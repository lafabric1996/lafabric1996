import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  variant?: "default" | "dark" | "surface" | "wood";
};

const variants = {
  default: "bg-background text-foreground",
  dark: "bg-foreground text-background",
  surface: "bg-surface text-foreground",
  wood: "wood-grain text-white",
};

export function Section({
  children,
  className,
  containerClassName,
  id,
  variant = "default",
}: SectionProps) {
  return (
    <section id={id} className={cn("py-20 lg:py-28", variants[variant], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
