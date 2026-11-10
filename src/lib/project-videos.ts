import type { Locale } from "@/i18n/routing";

export type ProjectVideo = {
  src: string;
  poster: string;
  title: Record<Locale, string>;
  credits: Record<Locale, string>;
  captions?: { src: string; language: Locale; label: string }[];
  showOnHome: boolean;
};

// Add only approved media, poster, credits and captions once supplied.
// The YH2 interview is a separate external link, not this promotional video.
export const projectVideos: Record<string, ProjectVideo | undefined> = {
  "yh2-maison-aube": {
    src: "/videos/maison-aube/film.mp4",
    poster: "/videos/maison-aube/poster.jpg",
    title: { fr: "Maison Aubé, en images", en: "Maison Aubé, on film" },
    credits: {
      fr: "Architecture : YH2 · Ébénisterie : La Fab’ric 1996",
      en: "Architecture: YH2 · Cabinetry: La Fab’ric 1996",
    },
    showOnHome: true,
  },
};
