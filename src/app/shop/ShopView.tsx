"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, inStock, type Category } from "@/lib/catalog";

const SORTS = {
  featured: "Featured",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  name: "Name, A to Z",
} as const;
type Sort = keyof typeof SORTS;

/** Filters live in the URL, so a filtered view can be shared or bookmarked: /shop/?cat=shoes&max=150 */
export function ShopView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const cat = params.get("cat") as Category | null;
  const q = params.get("q") ?? "";
  const max = Number(params.get("max")) || 0;
  const sort = (params.get("sort") as Sort) in SORTS ? (params.get("sort") as Sort) : "featured";
  const available = params.get("available") === "1";

  const set = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    router.replace(`${path}${p.size ? `?${p}` : ""}`, { scroll: false });
  };

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = PRODUCTS.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!max || p.price <= max) &&
        (!available || inStock(p)) &&
        words.every((w) => `${p.name} ${p.blurb} ${p.colours.map((c) => c.name).join(" ")}`.toLowerCase().includes(w)),
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [cat, q, max, sort, available]);

  const heading = cat ? CATEGORIES.find((c) => c.id === cat)?.name : "Everything";

  return (
    <div className="wrap pt-12 pb-[var(--gap-section)] md:pt-16">
      <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">{heading}</h1>
        <p className="text-lead font-semibold" aria-live="polite">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Kind">
        {[{ id: null, name: "Everything" }, ...CATEGORIES].map((c) => (
          <button
            key={c.name}
            type="button"
            aria-pressed={cat === c.id}
            onClick={() => set({ cat: c.id })}
            className="min-h-11 bg-surface px-4 font-semibold transition-[background-color,transform] duration-150 hover:bg-[#c4cdd2] active:scale-95 aria-pressed:bg-ink aria-pressed:text-bg"
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
        <div className="field">
          <label htmlFor="shop-q">Search</label>
          <input id="shop-q" className="input" type="search" defaultValue={q} placeholder="Name or colour" onChange={(e) => set({ q: e.target.value || null })} />
        </div>
        <div className="field">
          <label htmlFor="shop-max">Price up to</label>
          <select id="shop-max" className="input" value={max || ""} onChange={(e) => set({ max: e.target.value || null })}>
            <option value="">Any price</option>
            <option value="50">$50</option>
            <option value="100">$100</option>
            <option value="150">$150</option>
            <option value="200">$200</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="shop-sort">Sort</label>
          <select id="shop-sort" className="input" value={sort} onChange={(e) => set({ sort: e.target.value === "featured" ? null : e.target.value })}>
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <label className="flex min-h-[3.25rem] cursor-pointer items-center gap-3 font-semibold">
          <input type="checkbox" className="h-5 w-5 accent-[var(--ink)]" checked={available} onChange={(e) => set({ available: e.target.checked ? "1" : null })} />
          In stock only
        </label>
      </div>

      {results.length ? (
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4" key={`${cat}-${sort}-${max}-${available}`}>
          {results.map((p, i) => (
            <li key={p.slug} className="animate-[rise_480ms_var(--ease-out)_both]" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-16 bg-surface p-10">
          <p className="text-lead font-semibold">Nothing matches those filters.</p>
          <button type="button" className="btn btn--ink mt-6" onClick={() => router.replace(path, { scroll: false })}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
