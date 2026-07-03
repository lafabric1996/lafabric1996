import type { Locale } from "@/i18n/routing";

export function asLocale(locale: string): Locale {
  return locale as Locale;
}
