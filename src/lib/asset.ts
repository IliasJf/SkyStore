/** The site is served under /SkyStore/ on GitHub Pages; plain image paths need the prefix. */
export const BASE = "/SkyStore";

/** Widths each picture was exported at (see public/img). */
const WIDTHS = {
  product: [480, 800, 1024],
  sky: [640, 1024],
  scene: [960, 1536],
} as const;

const kind = (name: string): keyof typeof WIDTHS =>
  name.startsWith("sky-") ? "sky" : name.startsWith("scene-") ? "scene" : "product";

export function imgSrc(name: string, width?: number) {
  const widths = WIDTHS[kind(name)];
  const w = width && (widths as readonly number[]).includes(width) ? width : widths[widths.length - 1];
  return `${BASE}/img/${name}-${w}.webp`;
}

export function srcSet(name: string) {
  return WIDTHS[kind(name)].map((w) => `${BASE}/img/${name}-${w}.webp ${w}w`).join(", ");
}
