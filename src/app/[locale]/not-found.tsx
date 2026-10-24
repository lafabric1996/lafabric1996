import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return <section className="mx-auto max-w-3xl px-6 py-40">
    <p className="text-sm">404</p>
    <h1 className="mt-4 font-display text-5xl">{t("title")}</h1>
    <p className="mt-6 text-muted">{t("description")}</p>
    <div className="mt-8 flex flex-wrap gap-6"><Link href="/" className="underline">{t("home")}</Link><Link href="/realisations" className="underline">{t("projects")}</Link></div>
  </section>;
}
