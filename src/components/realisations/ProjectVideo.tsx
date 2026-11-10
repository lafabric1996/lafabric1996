import { getLocale } from "next-intl/server";
import { asLocale } from "@/lib/i18n-server";
import { projectVideos } from "@/lib/project-videos";
import { Section } from "@/components/ui/Section";

export async function ProjectVideo({ slug, home = false }: { slug: string; home?: boolean }) {
  const video = projectVideos[slug];
  if (!video?.src || !video.poster || (home && !video.showOnHome)) return null;
  const locale = asLocale(await getLocale());
  return <Section>
    <h2 className="font-display text-3xl md:text-4xl">{video.title[locale]}</h2>
    <video controls playsInline preload="none" poster={video.poster} src={video.src}
      aria-label={video.title[locale]} className="mt-8 aspect-video w-full bg-black object-contain">
      {video.captions?.map(track => <track key={track.language} kind="captions" src={track.src} srcLang={track.language} label={track.label} default={track.language === locale} />)}
    </video>
    <p className="mt-3 text-sm text-muted">{video.credits[locale]}</p>
  </Section>;
}
