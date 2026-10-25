import { permanentRedirect } from "next/navigation";
import type { LocalePageProps } from "@/lib/page-props";

// Keep old bookmarks working without promoting a standalone bathroom service.
export default async function SalleDeBainPage({ params }: LocalePageProps) {
  const { locale } = await params;
  permanentRedirect(locale === "en" ? "/en/built-in-furniture" : "/mobilier-integre");
}
