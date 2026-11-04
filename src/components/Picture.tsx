import { imgSrc, srcSet } from "@/lib/asset";

/** A responsive picture from public/img. Lazy unless it's the first thing on screen. */
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
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export: our own srcset, no image server
    <img
      src={imgSrc(name)}
      srcSet={srcSet(name)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={style}
    />
  );
}
