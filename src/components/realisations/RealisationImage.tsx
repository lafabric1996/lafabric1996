import Image from "next/image";
import { cn } from "@/lib/utils";

type RealisationImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fill?: boolean;
};

export function RealisationImage({
  src,
  alt,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = true,
}: RealisationImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
