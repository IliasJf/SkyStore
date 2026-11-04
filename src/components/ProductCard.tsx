"use client";

import Link from "next/link";
import { useState } from "react";
import { inStock, type Product } from "@/lib/catalog";
import { toggleWish, useShop } from "@/lib/store";
import { Picture } from "./Picture";
import { Price } from "./Price";

/** A product in a grid: its photo on the page's own haze, a second colour on hover, save to wishlist. */
export function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" }: { product: Product; sizes?: string }) {
  const { wishlist } = useShop();
  const [colour, setColour] = useState(0);
  const saved = wishlist.includes(product.slug);
  const lowest = Math.min(...Object.values(product.stock).filter((n) => n > 0));

  return (
    <article className="group relative">
      <Link href={`/product/${product.slug}/`} className="block overflow-hidden bg-surface">
        <Picture
          name={product.colours[colour].image}
          alt={`${product.name} in ${product.colours[colour].name.toLowerCase()}`}
          sizes={sizes}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
      </Link>
      <button
        type="button"
        onClick={() => toggleWish(product.slug)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
        className="absolute top-2 right-2 grid h-11 w-11 place-items-center bg-bg/90 transition-transform duration-150 active:scale-90"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className={`transition-colors ${saved ? "fill-accent stroke-accent" : "fill-none stroke-ink"}`} strokeWidth="2">
          <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.9 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.4 0 5.7 3.3 4.5 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z" />
        </svg>
      </button>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">
            <Link href={`/product/${product.slug}/`} className="after:absolute after:inset-0 after:content-[''] hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <p className="text-small text-muted">
            {!inStock(product) ? "Sold out" : lowest <= 2 ? `Only ${lowest} left in some sizes` : product.colours.length > 1 ? `${product.colours.length} colours` : product.colours[0].name}
          </p>
        </div>
        <Price usd={product.price} className="font-semibold" />
      </div>
      {product.colours.length > 1 && (
        <div className="relative z-[1] mt-2 flex gap-1.5">
          {product.colours.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColour(i)}
              onPointerEnter={() => setColour(i)}
              aria-label={`Show ${c.name}`}
              aria-pressed={colour === i}
              className="grid h-7 w-7 place-items-center"
            >
              <span className="h-4 w-4 outline-offset-2 transition-[outline-color] aria-pressed:outline" style={{ background: c.hex, outline: colour === i ? "2px solid var(--ink)" : "none" }} />
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
