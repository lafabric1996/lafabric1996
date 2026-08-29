import heroVideoData from "@/data/hero-video.json";

export type HeroVideoData = {
  available: boolean;
  src: string | null;
  posterSrc: string | null;
  sourceFile: string | null;
  posterSource: string | null;
  extension: string | null;
  posterMethod: string | null;
  syncedAt: string | null;
};

const data = heroVideoData as HeroVideoData;

export function getHeroVideo(): HeroVideoData {
  return data;
}
