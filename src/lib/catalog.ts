/**
 * The catalogue. Prices are in US dollars; other currencies are converted for display.
 * Products, prices and stock are sample data for this demo.
 */

export type Category = "tops" | "jackets" | "bottoms" | "shoes" | "watches" | "accessories";
/** What the sky is doing: drives the "dress for today's sky" picks. */
export type Condition = "hot" | "mild" | "cold" | "rain" | "wind" | "dark";

export interface Colour {
  name: string;
  hex: string;
  /** Base name of the photo in /public/img, without size or extension. */
  image: string;
}

export interface Product {
  slug: string;
  name: string;
  category: Category;
  price: number;
  /** One line on the card and the page. */
  blurb: string;
  details: string[];
  colours: Colour[];
  sizes: string[];
  /** Units left per size. Zero is sold out. */
  stock: Record<string, number>;
  conditions: Condition[];
  /** Where it goes in an outfit. */
  slot: "base" | "outer" | "legs" | "feet" | "wrist" | "head";
}

export const CATEGORIES: { id: Category; name: string }[] = [
  { id: "tops", name: "Tops" },
  { id: "jackets", name: "Jackets" },
  { id: "bottoms", name: "Bottoms" },
  { id: "shoes", name: "Shoes" },
  { id: "watches", name: "Watches" },
  { id: "accessories", name: "Accessories" },
];

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOES = ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];
const ONE = ["One size"];
const stock = (sizes: string[], counts: number[]) => Object.fromEntries(sizes.map((s, i) => [s, counts[i % counts.length]]));

export const PRODUCTS: Product[] = [
  {
    slug: "daybreak-tee",
    name: "Daybreak Tee",
    category: "tops",
    price: 38,
    blurb: "A light, quick-drying tee for the first run of the day.",
    details: ["Recycled polyester mesh, 120 g/m²", "Dries in about 20 minutes", "Flat seams that don't rub", "Machine wash at 30°C"],
    colours: [
      { name: "Sand", hex: "#d8c9b0", image: "p-tee-sand" },
      { name: "Black", hex: "#1d1f22", image: "p-tee-black" },
    ],
    sizes: APPAREL,
    stock: stock(APPAREL, [6, 12, 3, 9, 2, 0]),
    conditions: ["hot", "mild"],
    slot: "base",
  },
  {
    slug: "dusk-half-zip",
    name: "Dusk Half-Zip",
    category: "tops",
    price: 74,
    blurb: "Brushed inside, open at the neck: for evenings that turn cool.",
    details: ["Brushed-back jersey, warm without weight", "Half zip to cool down mid-run", "Thumb loops on the cuffs", "Machine wash at 30°C"],
    colours: [{ name: "Rust", hex: "#b2532a", image: "p-halfzip-rust" }],
    sizes: APPAREL,
    stock: stock(APPAREL, [4, 8, 11, 5, 3, 1]),
    conditions: ["cold", "mild"],
    slot: "base",
  },
  {
    slug: "crosswind-shell",
    name: "Crosswind Shell",
    category: "jackets",
    price: 128,
    blurb: "Packs into its own pocket and keeps out wind and showers.",
    details: ["Ripstop nylon with a water-repellent finish", "Taped seams, adjustable hood", "Packs into its chest pocket", "Weighs 140 g in size M"],
    colours: [{ name: "Olive", hex: "#5f6b3a", image: "p-shell-olive" }],
    sizes: APPAREL,
    stock: stock(APPAREL, [3, 7, 2, 6, 4, 2]),
    conditions: ["rain", "wind", "cold"],
    slot: "outer",
  },
  {
    slug: "night-shift-jacket",
    name: "Night Shift Jacket",
    category: "jackets",
    price: 142,
    blurb: "A reflective band front and back, so cars see you first.",
    details: ["Reflective band visible at 150 m", "Wind-resistant front, vented back", "Zipped pocket for keys and phone", "Machine wash at 30°C"],
    colours: [{ name: "Black", hex: "#1a1c20", image: "p-jacket-night" }],
    sizes: APPAREL,
    stock: stock(APPAREL, [2, 5, 8, 6, 3, 2]),
    conditions: ["dark", "cold", "wind"],
    slot: "outer",
  },
  {
    slug: "cloudline-joggers",
    name: "Cloudline Joggers",
    category: "bottoms",
    price: 82,
    blurb: "Tapered joggers for warm-ups, cool-downs and cold mornings.",
    details: ["Four-way stretch, soft brushed inside", "Zipped back pocket", "Cuffed ankles stay out of the way", "Machine wash at 30°C"],
    colours: [{ name: "Charcoal", hex: "#3e4043", image: "p-joggers-charcoal" }],
    sizes: APPAREL,
    stock: stock(APPAREL, [5, 9, 12, 7, 4, 3]),
    conditions: ["cold", "mild", "wind", "dark", "rain"],
    slot: "legs",
  },
  {
    slug: "stratus-shorts",
    name: "Stratus Shorts",
    category: "bottoms",
    price: 48,
    blurb: "Five-inch split shorts with a liner and a pocket that fits a phone.",
    details: ["Five-inch inseam with a split hem", "Built-in mesh liner", "Back pocket fits a large phone", "Machine wash at 30°C"],
    colours: [{ name: "Navy", hex: "#283a63", image: "p-shorts-navy" }],
    sizes: APPAREL,
    stock: stock(APPAREL, [7, 10, 6, 0, 5, 2]),
    conditions: ["hot", "mild"],
    slot: "legs",
  },
  {
    slug: "horizon-runner",
    name: "Horizon Runner",
    category: "shoes",
    price: 148,
    blurb: "A soft, high-rebound road shoe for daily miles.",
    details: ["Knit upper that moves with your foot", "36 mm foam heel, 8 mm drop", "Rubber outsole where it wears", "Weighs 255 g in US 9"],
    colours: [{ name: "Cloud", hex: "#ece8e0", image: "p-runner-white" }],
    sizes: SHOES,
    stock: stock(SHOES, [2, 6, 9, 4, 7, 3, 1]),
    conditions: ["hot", "mild", "cold", "wind", "dark"],
    slot: "feet",
  },
  {
    slug: "groundwork-trainer",
    name: "Groundwork Trainer",
    category: "shoes",
    price: 118,
    blurb: "Flat and stable for lifting, circuits and the gym floor.",
    details: ["Firm, flat sole for lifts", "Breathable mesh upper", "Grippy rubber that won't mark floors", "Weighs 290 g in US 9"],
    colours: [{ name: "Black", hex: "#1b1c1e", image: "p-trainer-black" }],
    sizes: SHOES,
    stock: stock(SHOES, [3, 5, 8, 8, 6, 2, 0]),
    conditions: ["rain", "cold", "mild"],
    slot: "feet",
  },
  {
    slug: "meridian-watch",
    name: "Meridian Watch",
    category: "watches",
    price: 189,
    blurb: "A steel field watch with a sky-blue dial and a woven strap.",
    details: ["40 mm brushed steel case", "Water resistant to 100 m", "Quartz movement, three-year battery", "Woven strap, quick release"],
    colours: [{ name: "Steel", hex: "#a9b0b5", image: "p-watch-steel" }],
    sizes: ONE,
    stock: { "One size": 6 },
    conditions: ["mild", "hot"],
    slot: "wrist",
  },
  {
    slug: "altitude-gps",
    name: "Altitude GPS",
    category: "watches",
    price: 249,
    blurb: "GPS pace, heart rate and sunrise times, with a week of battery.",
    details: ["GPS pace, distance and route", "Wrist heart rate", "Sunrise and sunset times on the dial", "Seven days of battery, 12 hours of GPS"],
    colours: [{ name: "Black", hex: "#191a1c", image: "p-watch-gps" }],
    sizes: ONE,
    stock: { "One size": 4 },
    conditions: ["dark", "cold", "rain", "wind"],
    slot: "wrist",
  },
  {
    slug: "brim-cap",
    name: "Brim Cap",
    category: "accessories",
    price: 32,
    blurb: "A light cap with vented sides for bright, hot runs.",
    details: ["Perforated side panels", "Sweat-wicking band", "Adjustable strap at the back", "Hand wash"],
    colours: [{ name: "Sand", hex: "#cdbf9f", image: "p-cap-sand" }],
    sizes: ONE,
    stock: { "One size": 14 },
    conditions: ["hot"],
    slot: "head",
  },
];

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const inStock = (p: Product) => Object.values(p.stock).some((n) => n > 0);

/** Shipping and returns, used on the page and in the cart. */
export const TERMS = {
  freeShippingFrom: 100,
  shipping: 8,
  returnDays: 30,
  dispatchDays: 2,
};
