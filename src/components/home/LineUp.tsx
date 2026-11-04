"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { BASE } from "@/lib/asset";
import { CATEGORIES, PRODUCTS, inStock } from "@/lib/catalog";
import { Picture } from "../Picture";
import { Price } from "../Price";

/**
 * The whole range as one table at one type size, grouped by kind. On a desktop
 * the product's photo follows the pointer over its row.
 */
export function LineUp() {
  const [hover, setHover] = useState<string | null>(null);
  const float = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = float.current;
    if (!el || e.pointerType !== "mouse") return;
    el.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 120}px, 0)`;
  };
  const shown = PRODUCTS.find((p) => p.slug === hover);

  return (
    <section aria-labelledby="range-title" className="bg-dawn py-[var(--gap-section)]" onPointerMove={move}>
      <div className="wrap grid gap-10 md:grid-cols-[7fr_5fr] md:items-end" data-reveal>
        <div>
          <h2 id="range-title" className="head max-w-[16ch]">
            Eleven pieces, one for every sky
          </h2>
          <p className="mt-6 max-w-[40ch] text-lead leading-snug">Everything we make, in one list. Prices include tax; shipping is free over $100.</p>
        </div>
        <figure>
          <video
            className="aspect-[5/4] w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={`${BASE}/media/cumulus-poster.jpg`}
            width={600}
            height={480}
            aria-hidden="true"
          >
            <source src={`${BASE}/media/cumulus.webm`} type="video/webm" />
          </video>
          <figcaption className="mt-2 text-small text-muted">Cumulus building over rooftops, in time-lapse.</figcaption>
        </figure>
      </div>

      <div className="wrap mt-16" onPointerLeave={() => setHover(null)}>
        {CATEGORIES.map((c) => {
          const items = PRODUCTS.filter((p) => p.category === c.id);
          if (!items.length) return null;
          return (
            <div key={c.id} data-reveal>
              <h3 className="sticky top-[var(--header-h)] z-[1] bg-dawn pt-12 pb-3 text-lead font-semibold text-accent">{c.name}</h3>
              <ul>
                {items.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/product/${p.slug}/`}
                      onPointerEnter={() => setHover(p.slug)}
                      onFocus={() => setHover(null)}
                      className="grid grid-cols-[1fr_auto] gap-x-4 py-1.5 text-lead leading-[1.5] transition-[color,padding] duration-200 hover:text-accent md:grid-cols-[33%_33%_1fr_auto] md:hover:ps-3"
                    >
                      <span className="font-semibold md:font-normal">{p.name}</span>
                      <span className="col-start-1 row-start-2 text-small text-muted md:col-start-auto md:row-start-auto md:text-[length:inherit] md:text-ink">
                        {p.colours.map((x) => x.name).join(", ")}
                      </span>
                      <span className="hidden md:block">{inStock(p) ? `${p.sizes.length === 1 ? "One size" : `${p.sizes[0]}–${p.sizes.at(-1)!.replace("US ", "")}`}` : "Sold out"}</span>
                      <Price usd={p.price} className="col-start-2 row-span-2 row-start-1 text-right md:col-start-auto md:row-span-1 md:row-start-auto" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <p className="mt-16">
          <Link href="/shop/" className="btn btn--ink">
            Shop with filters
          </Link>
        </p>
      </div>

      {/* The pointer's companion: decorative, the row already names the product. */}
      <div
        ref={float}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-30 hidden w-[200px] transition-opacity duration-200 md:block"
        style={{ opacity: shown ? 1 : 0 }}
      >
        {shown && <Picture name={shown.colours[0].image} alt="" sizes="200px" className="aspect-[4/5] w-full object-cover" width={200} height={250} />}
      </div>
    </section>
  );
}
