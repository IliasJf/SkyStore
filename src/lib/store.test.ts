import { describe, expect, it } from "vitest";
import { PRODUCTS, TERMS } from "./catalog";
import { money } from "./money";
import { totals } from "./store";

// A product and its price, so the tests don't depend on catalogue order.
const [first] = PRODUCTS;
const line = (qty: number, slug = first.slug) => ({ slug, colour: first.colours[0].name, size: first.sizes[0], qty });

describe("bag totals", () => {
  it("is all zeros for an empty bag, with no shipping charged", () => {
    expect(totals({ cart: [], promo: null })).toEqual({ subtotal: 0, discount: 0, shipping: 0, total: 0, count: 0, toFree: TERMS.freeShippingFrom });
  });

  it("charges shipping under the free-shipping threshold and says how much is left", () => {
    const cheapest = [...PRODUCTS].sort((a, b) => a.price - b.price)[0];
    expect(cheapest.price).toBeLessThan(TERMS.freeShippingFrom);
    const t = totals({ cart: [{ ...line(1), slug: cheapest.slug }], promo: null });
    expect(t.shipping).toBe(TERMS.shipping);
    expect(t.total).toBe(cheapest.price + TERMS.shipping);
    expect(t.toFree).toBe(TERMS.freeShippingFrom - cheapest.price);
  });

  it("ships free once the bag (after discount) reaches the threshold", () => {
    const qty = Math.ceil(TERMS.freeShippingFrom / first.price) + 1;
    const t = totals({ cart: [line(qty)], promo: null });
    expect(t.subtotal).toBe(first.price * qty);
    expect(t.shipping).toBe(0);
    expect(t.toFree).toBe(0);
    expect(t.count).toBe(qty);
  });

  it("applies SKY10 as 10% off, rounded to the cent", () => {
    const t = totals({ cart: [line(3)], promo: "SKY10" });
    expect(t.discount).toBe(Math.round(first.price * 3 * 10) / 100);
    expect(t.total).toBeCloseTo(t.subtotal - t.discount + t.shipping, 2);
  });

  it("ignores items that are no longer in the catalogue", () => {
    expect(totals({ cart: [line(2, "retired-product")], promo: null }).subtotal).toBe(0);
  });
});

describe("money", () => {
  it("shows whole amounts without cents and keeps cents when there are some", () => {
    expect(money(48, "USD")).toBe("$48");
    expect(money(48.5, "USD")).toBe("$48.50");
  });

  it("converts to euros at the demo rate", () => {
    expect(money(100, "EUR")).toBe("€92");
  });
});

describe("catalogue", () => {
  it("has unique product slugs", () => {
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length);
  });

  it("keeps stock for exactly the sizes each product is sold in", () => {
    for (const p of PRODUCTS) expect(Object.keys(p.stock).sort(), p.slug).toEqual([...p.sizes].sort());
  });

  it("has at least one colour, with a photo, for every product", () => {
    for (const p of PRODUCTS) {
      expect(p.colours.length, p.slug).toBeGreaterThan(0);
      for (const c of p.colours) expect(c.image, p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
