"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function getLocaleHref(
  pathname: string,
  params: Record<string, string | string[] | undefined>,
): ComponentProps<typeof Link>["href"] {
  if (pathname === "/realisations/[slug]" && typeof params.slug === "string") {
    return { pathname: "/realisations/[slug]", params: { slug: params.slug } };
  }

  return pathname as StaticPathname;
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const href = getLocaleHref(pathname, params);

  return (
    <div
      className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em]"
      role="navigation"
      aria-label="Language"
    >
      <Link
        href={href}
        locale="fr"
        className={cn(
          "transition-colors hover:text-wood",
          locale === "fr" ? "text-wood" : "text-muted",
        )}
      >
        FR
      </Link>
      <span className="text-border" aria-hidden="true">
        |
      </span>
      <Link
        href={href}
        locale="en"
        className={cn(
          "transition-colors hover:text-wood",
          locale === "en" ? "text-wood" : "text-muted",
        )}
      >
        EN
      </Link>
    </div>
  );
}
