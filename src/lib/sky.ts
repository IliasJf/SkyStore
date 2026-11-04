import { PRODUCTS, type Condition, type Product } from "./catalog";

/** The day, as the hero tells it: one sky per hour, each with the kit made for it. */
export interface Moment {
  id: "dawn" | "noon" | "wind" | "dusk" | "night";
  time: string;
  label: string;
  /** Ground sampled from the photo's sky, and the text colour that reads on it. */
  ground: string;
  ink: string;
  /** The pinned title's colour over this sky. */
  title: string;
  image: string;
  alt: string;
  product: string;
  colour: string;
  /** Hours (local) this sky covers, start inclusive. */
  from: number;
}

export const MOMENTS: Moment[] = [
  { id: "dawn", time: "06:10", label: "Dawn, 11°C", ground: "#f6d1b8", ink: "#0f1b2d", title: "#0f1b2d", image: "sky-dawn", alt: "A runner on a rooftop at dawn in a sand tee and black joggers, under a peach sky", product: "daybreak-tee", colour: "Sand", from: 5 },
  { id: "noon", time: "12:40", label: "Noon, 26°C", ground: "#3069b1", ink: "#f4f6f8", title: "#f4f6f8", image: "sky-noon", alt: "A runner at midday in a white tee and navy shorts under a cloudless blue sky", product: "stratus-shorts", colour: "Navy", from: 10 },
  { id: "wind", time: "16:30", label: "Afternoon, wind 32 km/h", ground: "#c8ccd1", ink: "#0f1b2d", title: "#0f1b2d", image: "sky-wind", alt: "A runner in an olive shell jacket with the hood blowing, under a grey overcast sky", product: "crosswind-shell", colour: "Olive", from: 15 },
  { id: "dusk", time: "19:05", label: "Dusk, 17°C", ground: "#1e2b4a", ink: "#f4f6f8", title: "#f6d1b8", image: "sky-dusk", alt: "A runner cooling down at sunset in a rust half-zip and charcoal joggers", product: "dusk-half-zip", colour: "Rust", from: 18 },
  { id: "night", time: "22:20", label: "Night, 9°C", ground: "#061121", ink: "#f4f6f8", title: "#f4f6f8", image: "sky-night", alt: "A runner at night in a black jacket with a reflective band, city lights behind", product: "night-shift-jacket", colour: "Black", from: 21 },
];

export function momentAt(hour: number): Moment["id"] {
  if (hour >= 21 || hour < 5) return "night";
  if (hour >= 18) return "dusk";
  if (hour >= 15) return "wind";
  if (hour >= 10) return "noon";
  return "dawn";
}

// ---------- dress for today's sky ----------

export interface Weather {
  temperature: number;
  wind: number;
  rain: boolean;
  isDay: boolean;
  code: number;
}

/** WMO weather codes from Open-Meteo, in words. */
export function describe(code: number) {
  if (code === 0) return "clear";
  if (code <= 3) return "partly cloudy";
  if (code <= 48) return "foggy";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rainy";
  if (code <= 77 || code === 85 || code === 86) return "snowy";
  return "stormy";
}

export function conditionsOf(w: Weather): Condition[] {
  const c: Condition[] = [];
  if (w.temperature >= 22) c.push("hot");
  else if (w.temperature >= 12) c.push("mild");
  else c.push("cold");
  if (w.rain) c.push("rain");
  if (w.wind >= 25) c.push("wind");
  if (!w.isDay) c.push("dark");
  return c;
}

export interface Pick {
  product: Product;
  why: string;
}

const REASONS: Record<Condition, string> = {
  hot: "keeps you cool",
  mild: "right for the temperature",
  cold: "adds warmth",
  rain: "sheds the rain",
  wind: "blocks the wind",
  dark: "keeps you seen",
};

/** One piece per slot that suits the most of today's conditions. */
export function outfitFor(w: Weather): Pick[] {
  const want = conditionsOf(w);
  const score = (p: Product) => p.conditions.filter((c) => want.includes(c)).length;
  const slots: Product["slot"][] = ["base", "legs", "feet"];
  if (want.some((c) => c === "cold" || c === "rain" || c === "wind" || c === "dark")) slots.splice(1, 0, "outer");
  if (want.includes("hot") && w.isDay) slots.push("head");
  return slots
    .map((slot) => {
      const best = PRODUCTS.filter((p) => p.slot === slot).sort((a, b) => score(b) - score(a))[0];
      if (!best || score(best) === 0) return null;
      const reason = want.find((c) => best.conditions.includes(c))!;
      return { product: best, why: REASONS[reason] };
    })
    .filter((x): x is Pick => !!x);
}
