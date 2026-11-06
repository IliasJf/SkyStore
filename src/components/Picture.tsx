"use client";

import { useEffect, useRef, useState } from "react";
import { imgSrc, srcSet } from "@/lib/asset";

/**
 * A responsive picture from public/img. Lazy unless it's the first thing on
 * screen, and it fades in once loaded instead of popping into an empty box.
 */
export function Picture({
  name,
  alt,
  sizes = "100vw",
  className,
  priority = false,
  width = 1024,
  height = 1280,
  style,
}: {
  name: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  // A cached image may finish before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete) requestAnimationFrame(() => setLoaded(true));
  }, [name]);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export: our own srcset, no image server
    <img
      ref={ref}
      src={imgSrc(name)}
      srcSet={srcSet(name)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`pic ${loaded ? "is-loaded" : ""} ${className ?? ""}`}
      style={style}
    />
  );
}
