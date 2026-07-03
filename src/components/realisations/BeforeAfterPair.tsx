"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BeforeAfterPairProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  className?: string;
};

/**
 * Composant avant/après préparé pour une activation future.
 * Non utilisé tant que `enabled` n'est pas activé dans les données du projet.
 */
export function BeforeAfterPair({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  className,
}: BeforeAfterPairProps) {
  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden border border-border bg-surface",
        className,
      )}
      role="group"
      aria-label={`${beforeLabel} / ${afterLabel}`}
    >
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="relative">
          <Image
            src={beforeSrc}
            alt={beforeLabel}
            fill
            sizes="50vw"
            className="object-cover"
          />
          <span className="absolute bottom-3 left-3 bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em]">
            {beforeLabel}
          </span>
        </div>
        <div className="relative border-l border-border">
          <Image
            src={afterSrc}
            alt={afterLabel}
            fill
            sizes="50vw"
            className="object-cover"
          />
          <span className="absolute bottom-3 right-3 bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em]">
            {afterLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
