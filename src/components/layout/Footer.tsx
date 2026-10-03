import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { footerNavigation } from "@/lib/navigation";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const tMeta = useTranslations("metadata");
  const tContact = useTranslations("contactPage");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-80"
            >
              <span className="relative block">
                <Image
                  src="/images/logo-lafabric.png"
                  alt="La Fab'ric 1996 — Ébénisterie"
                  width={579}
                  height={181}
                  className="h-12 w-auto brightness-0 invert"
                />
                {/* Superpose les parties rouges du logo original sur sa
                    version blanche : LA à gauche et ÉBÉNISTERIE en bas. */}
                <Image
                  src="/images/logo-lafabric.png"
                  alt=""
                  aria-hidden="true"
                  width={579}
                  height={181}
                  className="absolute inset-0 h-12 w-auto"
                  style={{
                    clipPath:
                      "polygon(0 0, 27% 0, 27% 70%, 100% 70%, 100% 100%, 0 100%)",
                  }}
                />
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
              {tFooter("tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-wood-light">
              {tNav("footer")}
            </h3>
            <ul className="mt-6 space-y-3">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-wood-light">
              {tFooter("coordinates")}
            </h3>
            <div className="mt-6 space-y-2 text-sm leading-relaxed text-white/60">
              <p>{tContact("info.addressValue")}</p>
              <p>
                <a
                  href="tel:+18193221041"
                  className="transition-colors hover:text-white"
                >
                  {tContact("info.phoneValue")}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${tContact("info.emailValue")}`}
                  className="transition-colors hover:text-white"
                >
                  {tContact("info.emailValue")}
                </a>
              </p>
            </div>
            <Link
              href="/contact"
              className="mt-4 inline-block text-sm font-medium text-wood-light transition-colors hover:text-white"
            >
              {tNav("contactUs")}
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/40">
            © {currentYear} {tMeta("siteName")}. {tFooter("rights")}
          </p>
          <p className="text-xs tracking-[0.08em] text-white/55">
            {tFooter("rbq")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
