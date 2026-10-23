import Image from "next/image";
import { cn } from "@/lib/utils";

// Landscape photos need extra pixels when cropped into portrait cards.
export const portraitImageSizes = "(max-width: 768px) 200vw, (max-width: 1200px) 100vw, 67vw";

type RealisationImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: "cover" | "contain";
};

export function RealisationImage({
  src,
  alt,
  priority = false,
  className,
  sizes = portraitImageSizes,
  fill = true,
  objectFit = "cover",
}: RealisationImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      quality={90}
      className={cn(objectFit === "contain" ? "object-contain" : "object-cover", className)}
    />
  );
}
