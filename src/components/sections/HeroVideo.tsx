"use client";

import { useEffect, useRef } from "react";

export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      if (motion.matches || !visible || document.hidden) video.pause();
      else { if (!video.src) video.src = src; void video.play().catch(() => undefined); }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(video);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); motion.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); video.pause(); };
  }, [src]);
  return <video ref={ref} poster={poster} muted loop playsInline preload="none" aria-hidden="true" className="h-full min-h-[92vh] w-full object-cover" />;
}
