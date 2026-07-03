import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type LinkHref = ComponentProps<typeof Link>["href"];

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = ButtonBaseProps & {
  href: LinkHref;
  external?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background hover:bg-wood-dark border border-transparent",
  secondary:
    "bg-wood text-white hover:bg-wood-dark border border-transparent",
  outline:
    "border border-foreground/20 text-foreground hover:border-wood hover:text-wood-dark bg-transparent",
  ghost: "text-foreground hover:text-wood-dark bg-transparent border-transparent",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-xs tracking-[0.15em]",
  md: "px-7 py-3.5 text-xs tracking-[0.18em]",
  lg: "px-9 py-4 text-sm tracking-[0.2em]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-sans font-medium uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood focus-visible:ring-offset-2",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (external) {
      return (
        <a
          href={href as string}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
