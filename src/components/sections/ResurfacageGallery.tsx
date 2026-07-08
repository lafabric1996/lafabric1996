"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type ResurfacageGalleryProps = {
  images: string[];
  altPrefix: string;
  loadMoreLabel: string;
};

const PAGE_SIZE = 6;

export function ResurfacageGallery({
  images,
  altPrefix,
  loadMoreLabel,
}: ResurfacageGalleryProps) {
  const [visibleCount, setVisibleCount] = useState(Math.min(PAGE_SIZE, images.length));
  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  return (
    <div className="mt-16">
      <div className="columns-2 gap-3 sm:gap-4 md:columns-3 [&>*]:mb-3 sm:[&>*]:mb-4">
        {visibleImages.map((src, index) => (
          <div key={src} className="relative overflow-hidden break-inside-avoid bg-surface">
            <Image
              src={src}
              alt={`${altPrefix} ${index + 1}`}
              width={800}
              height={600}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="h-auto w-full object-cover"
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, images.length))}
          >
            {loadMoreLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
