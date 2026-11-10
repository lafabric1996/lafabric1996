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
export const projectVideos: Record<string, ProjectVideo | undefined> = {};
