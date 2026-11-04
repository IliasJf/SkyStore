"use client";

import { useSyncExternalStore } from "react";
import { PRODUCTS, TERMS, bySlug } from "./catalog";
import type { Currency } from "./money";

/** Everything the shopper builds up, kept in this browser. */
export interface CartLine {
  slug: string;
  colour: string;
  size: string;
  qty: number;
}
export interface Order {
  id: string;
  placedAt: string;
  lines: (CartLine & { name: string; price: number; image: string })[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: Currency;
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  last4: string;
}
interface State {
  cart: CartLine[];
  wishlist: string[];
  currency: Currency;
  promo: string | null;
  orders: Order[];
  account: { name: string; email: string } | null;
  cartOpen: boolean;
}

const KEY = "skystore:v2";
const EMPTY: State = { cart: [], wishlist: [], currency: "USD", promo: null, orders: [], account: null, cartOpen: false };
let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") state = { ...EMPTY, ...saved, cartOpen: false };
  } catch {}
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  try {
    // The drawer's open state is for this page view only.
    localStorage.setItem(KEY, JSON.stringify({ ...state, cartOpen: undefined }));
  } catch {}
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined")
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    listeners.forEach((l) => l());
  });

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => {
  load();
  return state;
};
const serverSnapshot = () => EMPTY;

export function useShop() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

// ---------- cart ----------

const same = (a: CartLine, b: Omit<CartLine, "qty">) => a.slug === b.slug && a.colour === b.colour && a.size === b.size;

export function addToCart(line: Omit<CartLine, "qty">, qty = 1, open = true) {
  const p = bySlug(line.slug);
  const max = p?.stock[line.size] ?? 0;
  const existing = state.cart.find((l) => same(l, line));
  const cart = existing
    ? state.cart.map((l) => (same(l, line) ? { ...l, qty: Math.min(max, l.qty + qty) } : l))
    : [...state.cart, { ...line, qty: Math.min(max, qty) }];
  set({ cart, cartOpen: open });
}
export function setQty(line: Omit<CartLine, "qty">, qty: number) {
  const max = bySlug(line.slug)?.stock[line.size] ?? 0;
  set({ cart: qty <= 0 ? state.cart.filter((l) => !same(l, line)) : state.cart.map((l) => (same(l, line) ? { ...l, qty: Math.min(max, qty) } : l)) });
}
export const removeLine = (line: Omit<CartLine, "qty">) => setQty(line, 0);
export const openCart = (open = true) => set({ cartOpen: open });

// ---------- totals ----------

/** Demo promo codes. */
export const PROMOS: Record<string, { label: string; percent: number }> = {
  SKY10: { label: "10% off your order", percent: 10 },
};

export function totals(s: Pick<State, "cart" | "promo">) {
  const subtotal = s.cart.reduce((sum, l) => sum + (bySlug(l.slug)?.price ?? 0) * l.qty, 0);
  const promo = s.promo ? PROMOS[s.promo] : undefined;
  const discount = promo ? Math.round(subtotal * promo.percent) / 100 : 0;
  const shipping = subtotal === 0 || subtotal - discount >= TERMS.freeShippingFrom ? 0 : TERMS.shipping;
  const count = s.cart.reduce((n, l) => n + l.qty, 0);
  return { subtotal, discount, shipping, total: subtotal - discount + shipping, count, toFree: Math.max(0, TERMS.freeShippingFrom - (subtotal - discount)) };
}

export function applyPromo(code: string): boolean {
  const key = code.trim().toUpperCase();
  if (!PROMOS[key]) return false;
  set({ promo: key });
  return true;
}
export const clearPromo = () => set({ promo: null });

// ---------- the rest ----------

export const setCurrency = (currency: Currency) => set({ currency });
export function toggleWish(slug: string) {
  set({ wishlist: state.wishlist.includes(slug) ? state.wishlist.filter((s) => s !== slug) : [...state.wishlist, slug] });
}
export const signIn = (account: { name: string; email: string }) => set({ account });
export const signOut = () => set({ account: null });

export function placeOrder(details: Omit<Order, "id" | "placedAt" | "lines" | "subtotal" | "shipping" | "discount" | "total" | "currency">): Order {
  const t = totals(state);
  const id = `SKY-${Date.now().toString(36).slice(-5).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
  const order: Order = {
    ...details,
    id,
    placedAt: new Date().toISOString(),
    lines: state.cart.map((l) => {
      const p = bySlug(l.slug)!;
      return { ...l, name: p.name, price: p.price, image: p.colours.find((c) => c.name === l.colour)?.image ?? p.colours[0].image };
    }),
    subtotal: t.subtotal,
    shipping: t.shipping,
    discount: t.discount,
    total: t.total,
    currency: state.currency,
  };
  set({ orders: [order, ...state.orders], cart: [], promo: null });
  return order;
}

export const productCount = PRODUCTS.length;
