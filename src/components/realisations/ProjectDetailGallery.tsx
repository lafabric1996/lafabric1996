import type { RealisationImage as RealisationImageType } from "@/lib/realisations";
import { RealisationImage } from "./RealisationImage";

type ProjectDetailGalleryProps = {
  images: RealisationImageType[];
  projectTitle: string;
};

export function ProjectDetailGallery({
  images,
  projectTitle,
}: ProjectDetailGalleryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <div
          key={image.src}
          className="relative aspect-[4/5] overflow-hidden bg-surface"
        >
          <RealisationImage
            src={image.src}
            alt={`${projectTitle} — ${image.filename}`}
            priority={index < 2}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}
