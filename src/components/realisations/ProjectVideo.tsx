import { getLocale } from "next-intl/server";
import { asLocale } from "@/lib/i18n-server";
import { projectVideos } from "@/lib/project-videos";
import { Section } from "@/components/ui/Section";
import { PromoVideoCard } from "@/components/sections/PromoVideoCard";
import { Button } from "@/components/ui/Button";

export async function ProjectVideo({ slug, home = false }: { slug: string; home?: boolean }) {
  const video = projectVideos[slug];
  if (!video?.src || !video.poster || (home && !video.showOnHome)) return null;
  const locale = asLocale(await getLocale());
  const fr = locale === "fr";
  return <Section id="film-maison-aube" variant="surface" className="scroll-mt-24">
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-wood">{fr ? "Un projet à découvrir" : "A project to discover"}</p>
        <h2 className="font-display text-3xl md:text-4xl">{video.title[locale]}</h2>
        <p className="mt-5 leading-relaxed text-muted">{fr ? "Entrez dans la Maison Aubé et découvrez ses aménagements sur mesure, réalisés dans notre atelier." : "Step inside Maison Aubé and discover its custom cabinetry, crafted in our workshop."}</p>
        <p className="mt-5 text-sm text-muted">{video.credits[locale]}</p>
        {home ? <Button href={{ pathname: "/realisations/[slug]", params: { slug } }} variant="outline" className="mt-6">{fr ? "Découvrir le projet" : "Explore the project"}</Button> : null}
      </div>
      <PromoVideoCard videoSrc={video.src} posterSrc={video.poster} title={video.title[locale]}
        ariaLabel={video.title[locale]} playLabel={fr ? "Voir le film — 36 secondes" : "Watch the film — 36 seconds"}
        closeLabel={fr ? "Fermer la vidéo" : "Close video"} showCaption={false} landscape />
    </div>
  </Section>;
}
