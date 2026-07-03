import promoVideoData from "@/data/promo-video.json";

export type PromoVideoData = {
  available: boolean;
  src: string | null;
  posterSrc: string | null;
  sourceFile: string | null;
  posterSource: string | null;
  extension: string | null;
  posterMethod: string | null;
  syncedAt: string;
};

const data = promoVideoData as PromoVideoData;

export function getPromoVideo(): PromoVideoData {
  return data;
}
