import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  label?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide" | "hero";
  className?: string;
  /** "top" évite de chevaucher un texte ancré en bas du conteneur (ex. hero). */
  labelPosition?: "center" | "top";
};

const aspectRatios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
  hero: "aspect-[4/5] md:aspect-[16/9]",
};

export function ImagePlaceholder({
  label = "Photo à venir",
  aspectRatio = "video",
  className,
  labelPosition = "center",
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface",
        aspectRatios[aspectRatio],
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f5f0ea_0%,#e8dfd4_50%,#d9c4a8_100%)]" />
      <div
        className={cn(
          "absolute inset-0 flex justify-center",
          labelPosition === "top"
            ? "items-start pt-8 sm:pt-10"
            : "items-center",
        )}
      >
        <div className="border border-foreground/10 bg-white/60 px-6 py-3 backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
