"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/lib/navigation";

const headerNavigation: NavItem[] = [
  { labelKey: "realisations", href: "/realisations" },
  { labelKey: "aPropos", href: "/a-propos" },
];
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Header() {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mainEl = document.querySelector("main");
    const footerEl = document.querySelector("footer");

    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) {
      mainEl?.setAttribute("inert", "");
      footerEl?.setAttribute("inert", "");
    } else {
      mainEl?.removeAttribute("inert");
      footerEl?.removeAttribute("inert");
    }

    return () => {
      document.body.style.overflow = "";
      mainEl?.removeAttribute("inert");
      footerEl?.removeAttribute("inert");
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[9999] transition-all duration-300",
        isOpen
          ? "bg-[#FAF8F5]"
          : isScrolled
            ? "border-b border-border/60 bg-background/95 backdrop-blur-md"
            : "bg-transparent",
      )}
    >
      <Container as="div" className="flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex shrink-0 flex-col leading-none"
          aria-label={tHeader("homeAriaLabel")}
        >
          <span className="font-display text-2xl tracking-wide text-foreground transition-colors group-hover:text-wood md:text-3xl">
            La Fab&apos;ric
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.35em] text-muted">
            1996
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 xl:flex"
          aria-label={t("main")}
        >
          {headerNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:text-wood",
                pathname === item.href ? "text-wood" : "text-foreground/80",
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 xl:flex">
          <LanguageSwitcher />
          <Button href="/contact" size="sm">
            {t("contact")}
          </Button>
        </div>

        <div className="flex items-center gap-4 xl:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? tHeader("closeMenu") : tHeader("openMenu")}
          >
            <span
              className={cn(
                "h-px w-6 bg-foreground transition-all duration-300",
                isOpen && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-foreground transition-all duration-300",
                isOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-foreground transition-all duration-300",
                isOpen && "-translate-y-[5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-[9999] bg-[#FAF8F5] transition-opacity duration-500 xl:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        <Container className="flex h-full flex-col justify-center pb-24 pt-28">
          <nav className="flex flex-col gap-6" aria-label={t("mobile")}>
            {headerNavigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-display text-4xl tracking-tight transition-colors hover:text-wood",
                  pathname === item.href ? "text-wood" : "text-foreground",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <div className="mt-12">
            <Button href="/contact" size="lg" className="w-full">
              {tHeader("requestQuote")}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
