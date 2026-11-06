"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, inStock, type Product } from "@/lib/catalog";
import { MOMENTS } from "@/lib/sky";
import { addToCart, toggleWish, useShop } from "@/lib/store";
import { Picture } from "./Picture";
import { Price } from "./Price";

const BEST_SELLERS = ["horizon-runner", "crosswind-shell", "daybreak-tee"];

/**
 * A product in a grid: the packshot on its haze, the piece being worn on hover
 * where there's a campaign photo, a heart to save it and a quick add by size.
 */
export function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" }: { product: Product; sizes?: string }) {
  const { wishlist } = useShop();
  const [colour, setColour] = useState(0);
  const [picking, setPicking] = useState(false);
  const saved = wishlist.includes(product.slug);
  const worn = MOMENTS.find((m) => m.product === product.slug);
  // "Almost gone" means the whole product, not one size.
  const total = Object.values(product.stock).reduce((a, n) => a + n, 0);
  const oneSize = product.sizes.length === 1;

  const quickAdd = (size: string) => {
    addToCart({ slug: product.slug, colour: product.colours[colour].name, size });
    setPicking(false);
  };

  return (
    <article className="group relative" onMouseLeave={() => setPicking(false)}>
      <div className="relative overflow-hidden rounded-[var(--radius)] bg-tile">
        <Link href={`/product/${product.slug}/`} tabIndex={-1} aria-hidden="true">
          <Picture
            name={product.colours[colour].image}
            alt=""
            sizes={sizes}
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
          {worn && (
            <Picture
              name={worn.image}
              alt=""
              sizes={sizes}
              width={1024}
              height={1536}
              className="absolute inset-0 h-full w-full object-cover object-[50%_25%] !opacity-0 transition-opacity duration-500 group-hover:!opacity-100"
            />
          )}
        </Link>

        {!inStock(product) ? (
          <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-small font-bold">Sold out</span>
        ) : total <= 6 ? (
          <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-small font-bold text-[#c2300f]">Almost gone</span>
        ) : BEST_SELLERS.includes(product.slug) ? (
          <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-small font-bold">Best seller</span>
        ) : null}

        <button
          type="button"
          onClick={() => toggleWish(product.slug)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white transition-transform duration-150 active:scale-90"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className={`transition-colors ${saved ? "fill-ink stroke-ink" : "fill-none stroke-ink"}`} strokeWidth="2">
            <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.9 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.4 0 5.7 3.3 4.5 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z" />
          </svg>
        </button>

        {/* Quick add: sizes slide up from the bottom of the photo. */}
        {inStock(product) && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-[opacity,transform] duration-200 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
            {picking ? (
              <div className="rounded-[var(--radius)] bg-white p-2" role="group" aria-label={`Sizes for ${product.name}`}>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={!product.stock[s]}
                      onClick={() => quickAdd(s)}
                      className="min-h-9 min-w-11 rounded-full border border-line px-2 text-small font-semibold transition-colors hover:border-ink disabled:cursor-not-allowed disabled:text-[#bbb] disabled:line-through"
                    >
                      {s.replace("US ", "")}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => (oneSize ? quickAdd(product.sizes[0]) : setPicking(true))}
                className="w-full rounded-full bg-white py-2.5 text-small font-bold transition-colors hover:bg-ink hover:text-white"
              >
                Quick add{oneSize ? "" : " +"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">
            <Link href={`/product/${product.slug}/`} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <p className="text-small text-muted">
            {CATEGORIES.find((c) => c.id === product.category)?.name} · {product.colours.length > 1 ? `${product.colours.length} colours` : product.colours[0].name}
          </p>
        </div>
        <Price usd={product.price} className="font-bold" />
      </div>
      {product.colours.length > 1 && (
        <div className="mt-2 flex gap-1.5">
          {product.colours.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColour(i)}
              onPointerEnter={() => setColour(i)}
              aria-label={`Show ${c.name}`}
              aria-pressed={colour === i}
              className="grid h-7 w-7 place-items-center rounded-full"
              style={{ outline: colour === i ? "1.5px solid var(--ink)" : "none", outlineOffset: 1 }}
            >
              <span className="h-5 w-5 rounded-full border border-black/10" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
