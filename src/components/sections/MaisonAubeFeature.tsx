import { getTranslations } from "next-intl/server";
import { RealisationImage } from "@/components/realisations/RealisationImage";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { getProjectBySlug } from "@/lib/realisations";

export async function MaisonAubeFeature() {
  const project = getProjectBySlug("yh2-maison-aube");
  if (!project) return null;
  const t = await getTranslations("maisonAube");
  const href = { pathname: "/realisations/[slug]" as const, params: { slug: project.slug } };
  return (
    <article id="maison-aube" className="mt-12 border-y border-border py-8 lg:py-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <Link href={href} className="group relative block aspect-[4/3] overflow-hidden bg-surface">
          <RealisationImage src={project.cover} alt={t("imageAlts.photo-722")} sizes="(max-width: 1024px) 100vw, 60vw" className="transition-transform duration-700 motion-safe:group-hover:scale-[1.02]" />
        </Link>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-wood">{t("shortAwards")}</p>
          <h3 className="mt-4 font-display text-4xl tracking-tight lg:text-5xl">{t("title")}</h3>
          <p className="mt-3 text-sm text-muted">{t("location")}</p>
          <p className="mt-6 font-display text-2xl leading-snug">{t("featureTitle")}</p>
          <p className="mt-4 leading-relaxed text-muted">{t("featureText")}</p>
          <p className="mt-5 text-xs leading-relaxed text-muted">{t("attribution")}</p>
          <Button href={href} variant="outline" className="mt-7">{t("discover")}</Button>
        </div>
      </div>
    </article>
  );
}
