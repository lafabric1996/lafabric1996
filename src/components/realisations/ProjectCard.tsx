import { Link } from "@/i18n/navigation";
import type { ProjectCategory, RealisationProject } from "@/lib/realisations";
import { cn } from "@/lib/utils";
import { RealisationImage } from "./RealisationImage";

type ProjectCardProps = {
  project: RealisationProject;
  categoryLabel?: string;
  priority?: boolean;
};

export function ProjectCard({
  project,
  categoryLabel,
  priority = false,
}: ProjectCardProps) {
  return (
    <Link
      href={{ pathname: "/realisations/[slug]", params: { slug: project.slug } }}
      className="group block"
    >
      <article>
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <RealisationImage
            src={project.cover}
            alt={project.title}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
        </div>
        <div className="mt-4">
          {categoryLabel && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-wood">
              {categoryLabel}
            </p>
          )}
          <h3
            className={cn(
              "font-display text-2xl tracking-tight transition-colors group-hover:text-wood",
              categoryLabel && "mt-2",
            )}
          >
            {project.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}

export type { ProjectCategory };
