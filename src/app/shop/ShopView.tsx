"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
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

  const heading = cat ? CATEGORIES.find((c) => c.id === cat)?.name : "Shop all";
  // Filters start open when one of them is already in use (a shared link, say).
  const [open, setOpen] = useState(Boolean(q || max || available));

  return (
    <div className="wrap pt-8 pb-[var(--gap-section)] md:pt-10">
      <div data-reveal className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="head">
          {heading} <span className="text-muted">({results.length})</span>
        </h1>
      </div>

      {/* The slim bar: kinds on the left, filters and sort on the right; it stays under the header. */}
      <div className="sticky top-[var(--header-h)] z-20 -mx-[var(--margin)] mt-6 flex items-center gap-4 border-b border-line bg-bg px-[var(--margin)]">
        <div className="no-scrollbar flex grow gap-6 overflow-x-auto" role="group" aria-label="Kind">
          {[{ id: null, name: "All" }, ...CATEGORIES].map((c) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={cat === c.id}
              onClick={() => set({ cat: c.id })}
              className="relative shrink-0 py-4 font-semibold text-muted transition-colors hover:text-ink aria-pressed:text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-ink after:transition-transform after:duration-200 after:scale-x-0 aria-pressed:after:scale-x-100"
            >
              {c.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="filters"
          onClick={() => setOpen(!open)}
          className="flex shrink-0 items-center gap-2 py-3 font-semibold"
        >
          {open ? "Hide filters" : "Filters"}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6" />
          </svg>
        </button>
        <label className="sr-only" htmlFor="shop-sort">
          Sort by
        </label>
        <select
          id="shop-sort"
          className="hidden shrink-0 cursor-pointer bg-transparent py-3 font-semibold sm:block"
          value={sort}
          onChange={(e) => set({ sort: e.target.value === "featured" ? null : e.target.value })}
        >
          {Object.entries(SORTS).map(([k, v]) => (
            <option key={k} value={k}>
              Sort: {v}
            </option>
          ))}
        </select>
      </div>

      {open && (
        <div id="filters" className="mt-6 grid animate-[rise_240ms_var(--ease-out)] gap-4 rounded-[var(--radius)] bg-surface p-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
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
          <div className="field sm:hidden">
            <label htmlFor="shop-sort-m">Sort by</label>
            <select id="shop-sort-m" className="input" value={sort} onChange={(e) => set({ sort: e.target.value === "featured" ? null : e.target.value })}>
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
      )}

      {results.length ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-3" key={`${cat}-${sort}-${max}-${available}`}>
          {results.map((p, i) => (
            <li key={p.slug} className="animate-[rise_480ms_var(--ease-out)_both]" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <ProductCard product={p} sizes="(min-width: 1024px) 33vw, 50vw" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 rounded-[var(--radius)] bg-surface p-10">
          <p className="text-lead font-semibold">Nothing matches those filters.</p>
          <button type="button" className="btn btn--ink mt-6" onClick={() => router.replace(path, { scroll: false })}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
