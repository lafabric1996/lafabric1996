"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/lib/navigation";

const headerNavigation: NavItem[] = [
  { labelKey: "realisations", href: "/realisations" },
  { labelKey: "cuisine", href: "/cuisine" },
  { labelKey: "mobilierIntegre", href: "/mobilier-integre" },
  { labelKey: "resurfacage", href: "/resurfacage" },
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
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === "Escape") { setIsOpen(false); menuButtonRef.current?.focus(); }
      if (event.key === "Tab") {
        const items = Array.from(headerRef.current?.querySelectorAll<HTMLElement>("a[href],button") ?? []).filter(el => el.getClientRects().length > 0 && !el.closest("[inert]"));
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
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
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      mainEl?.removeAttribute("inert");
      footerEl?.removeAttribute("inert");
    };
  }, [isOpen]);

  const isOverHero = pathname === "/" && !isScrolled && !isOpen;

  return (
    <header
      ref={headerRef}
      onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setIsOpen(false); }}
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
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label={tHeader("homeAriaLabel")}
        >
          <Image
            src="/images/logo-lafabric.png"
            /* Le lien porte déjà son libellé accessible : alt vide pour ne pas
               annoncer deux fois la même chose. */
            alt=""
            width={579}
            height={181}
            priority
            className="h-9 w-auto md:h-11"
          />
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
                "text-xs font-medium uppercase tracking-[0.15em] transition-colors",
                isOverHero
                  ? "text-white hover:text-white/80"
                  : pathname === item.href
                    ? "text-wood hover:text-wood"
                    : "text-foreground/80 hover:text-wood",
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 xl:flex">
          <LanguageSwitcher light={isOverHero} />
          <Button
            href="/contact"
            size="sm"
            variant={isOverHero ? "ghost" : "primary"}
            className={isOverHero ? "text-white! hover:text-white/80!" : undefined}
          >
            {t("contact")}
          </Button>
        </div>

        <div className="flex items-center gap-4 xl:hidden">
          <LanguageSwitcher light={isOverHero} />
          <button
            ref={menuButtonRef}
            type="button"
            className="relative z-[10000] flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? tHeader("closeMenu") : tHeader("openMenu")}
          >
            <span
              className={cn(
                "h-px w-6 transition-all duration-300",
                isOverHero ? "bg-white" : "bg-foreground",
                isOpen && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-6 transition-all duration-300",
                isOverHero ? "bg-white" : "bg-foreground",
                isOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-px w-6 transition-all duration-300",
                isOverHero ? "bg-white" : "bg-foreground",
                isOpen && "-translate-y-[5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        inert={!isOpen}
        onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setIsOpen(false); }}
        className={cn(
          "fixed inset-0 z-[9999] overflow-y-auto bg-[#FAF8F5] transition-opacity duration-500 xl:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        <Container className="flex min-h-full flex-col justify-center pb-12 pt-28">
          <nav className="flex flex-col gap-4" aria-label={t("mobile")}>
            {headerNavigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-display text-3xl tracking-tight transition-colors hover:text-wood",
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
