import { redirect } from "next/navigation";
import { getPathname } from "@/i18n/navigation";
import { asLocale } from "@/lib/i18n-server";
import type { LocalePageProps } from "@/lib/page-props";

export default async function ContactPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const homePath = getPathname({ locale: asLocale(locale), href: "/" });
  redirect(`${homePath}#contact`);
}
