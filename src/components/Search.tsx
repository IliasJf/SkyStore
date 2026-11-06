"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { Picture } from "./Picture";
import { Price } from "./Price";

/** Search as you type, across names, categories and colours. Opens with / or Ctrl+K. */
export function Search({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setQ("");
      setActive(0);
    }
    if (!open && d.open) d.close();
  }, [open]);

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter((p) => {
      const hay = [p.name, p.blurb, CATEGORIES.find((c) => c.id === p.category)?.name, ...p.colours.map((c) => c.name)].join(" ").toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [q]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label="Search products"
      /* taste-skill-ignore: dialog */ className="m-0 mx-auto mt-[10vh] w-[min(40rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-[0.75rem] bg-bg p-0 text-ink shadow-[0_24px_80px_rgb(6_17_33/0.35)] backdrop:bg-black/40 open:animate-[rise_220ms_var(--ease-out)]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const hit = results[active];
          if (hit) (document.getElementById(`search-hit-${hit.slug}`) as HTMLAnchorElement | null)?.click();
        }}
      >
        <label htmlFor="search-q" className="sr-only">
          Search products
        </label>
        <input
          id="search-q"
          autoFocus
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(results.length - 1, a + 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            }
          }}
          placeholder="Search tees, shells, watches…"
          role="combobox"
          aria-expanded="true"
          aria-controls="search-list"
          aria-activedescendant={results[active] ? `search-hit-${results[active].slug}` : undefined}
          className="h-16 w-full bg-surface px-5 text-lead font-semibold outline-none placeholder:text-muted"
        />
      </form>
      <ul id="search-list" role="listbox" className="max-h-[60vh] overflow-y-auto py-2">
        {results.map((p, i) => (
          <li key={p.slug} role="option" aria-selected={i === active}>
            <Link
              id={`search-hit-${p.slug}`}
              href={`/product/${p.slug}/`}
              onClick={onClose}
              onMouseEnter={() => setActive(i)}
              className={`flex items-center gap-4 px-5 py-2.5 transition-colors ${i === active ? "bg-surface" : ""} rounded-lg mx-2`}
            >
              <Picture name={p.colours[0].image} alt="" sizes="56px" className="h-[70px] w-14 rounded-md bg-tile object-cover" width={56} height={70} />
              <span className="grow">
                <span className="block font-semibold">{p.name}</span>
                <span className="block text-small text-muted">{CATEGORIES.find((c) => c.id === p.category)?.name}</span>
              </span>
              <Price usd={p.price} className="font-semibold" />
            </Link>
          </li>
        ))}
        {!results.length && <li className="px-5 py-6 text-muted">Nothing matches “{q}”. Try a colour or a category, like “olive” or “shoes”.</li>}
      </ul>
    </dialog>
  );
}
