"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Picture } from "@/components/Picture";
import { Price } from "@/components/Price";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, TERMS, bySlug } from "@/lib/catalog";
import { MOMENTS } from "@/lib/sky";
import { addToCart, toggleWish, useShop } from "@/lib/store";

/** Extra pictures beyond the packshot: the sky it was made for, and a close-up where there is one. */
const EXTRAS: Record<string, { name: string; alt: string; w: number; h: number }[]> = {
  "horizon-runner": [{ name: "detail-knit", alt: "Close-up of the knit upper and orange heel tab", w: 1024, h: 1280 }],
  "crosswind-shell": [{ name: "detail-rain", alt: "Rain beading on the shell's ripstop fabric", w: 1024, h: 1024 }],
};

export function ProductView({ slug }: { slug: string }) {
  const p = bySlug(slug)!;
  const { wishlist } = useShop();
  const [colour, setColour] = useState(0);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [error, setError] = useState("");
  const guide = useRef<HTMLDialogElement>(null);

  const moment = MOMENTS.find((m) => m.product === p.slug);
  const pictures = [
    { name: p.colours[colour].image, alt: `${p.name} in ${p.colours[colour].name.toLowerCase()}`, w: 1024, h: 1280 },
    ...(moment ? [{ name: moment.image, alt: moment.alt, w: 1024, h: 1536 }] : []),
    ...(EXTRAS[p.slug] ?? []),
  ];
  const left = size ? p.stock[size] : undefined;
  const saved = wishlist.includes(p.slug);
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && x.slot !== p.slot && x.conditions.some((c) => p.conditions.includes(c))).slice(0, 4);
  const isShoe = p.category === "shoes";

  function add() {
    if (!size) {
      setError("Choose a size first.");
      document.getElementById("sizes")?.focus();
      return;
    }
    setError("");
    addToCart({ slug: p.slug, colour: p.colours[colour].name, size });
  }

  return (
    <div className="pb-[var(--gap-section)]">
      <div className="wrap grid gap-8 pt-6 lg:grid-cols-[7fr_4fr] lg:gap-12 lg:pt-10">
        {/* Every picture at once on a desktop, two across; on a phone, a row to swipe. */}
        <div className="no-scrollbar -mx-[var(--margin)] flex snap-x snap-mandatory gap-2 overflow-x-auto px-[var(--margin)] lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0" role="group" aria-label="Pictures">
          {pictures.map((x, i) => (
            <div key={`${x.name}-${i}`} className={`w-[86%] shrink-0 snap-start overflow-hidden rounded-[var(--radius)] bg-tile sm:w-[60%] lg:w-auto ${pictures.length % 2 && i === 0 ? "lg:col-span-2" : ""}`}>
              <Picture name={x.name} alt={x.alt} priority={i === 0} sizes="(min-width: 1024px) 30vw, 86vw" width={x.w} height={x.h} className="aspect-[4/5] w-full object-cover" />
            </div>
          ))}
        </div>

        <div data-reveal className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <p className="font-semibold text-muted">
            <Link href={`/shop/?cat=${p.category}`} className="hover:text-ink">
              {CATEGORIES.find((c) => c.id === p.category)?.name}
            </Link>
          </p>
          <h1 className="display mt-2 text-[clamp(2.25rem,4vw,3.5rem)]">{p.name}</h1>
          <p className="mt-4 text-lead">
            <Price usd={p.price} className="font-extrabold" />
          </p>
          <p className="mt-5 max-w-[42ch] leading-relaxed">{p.blurb}</p>

          {p.colours.length > 1 && (
            <fieldset className="mt-8">
              <legend className="font-semibold">
                Colour: <span className="font-normal">{p.colours[colour].name}</span>
              </legend>
              <div className="mt-3 flex gap-2">
                {p.colours.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColour(i)}
                    aria-pressed={colour === i}
                    aria-label={c.name}
                    className="grid h-12 w-12 place-items-center rounded-full transition-transform active:scale-90"
                    style={{ outline: colour === i ? "2px solid var(--ink)" : "none", outlineOffset: 2 }}
                  >
                    <span className="h-10 w-10 rounded-full border border-black/10" style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {p.sizes.length > 1 && (
            <fieldset className="mt-8">
              <div className="flex items-baseline justify-between">
                <legend className="font-semibold">
                  Size{size ? <span className="font-normal">: {size}</span> : null}
                </legend>
                <button type="button" className="link text-small font-semibold" onClick={() => guide.current?.showModal()}>
                  Size guide
                </button>
              </div>
              <div id="sizes" tabIndex={-1} className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {p.sizes.map((s) => {
                  const n = p.stock[s] ?? 0;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={n === 0}
                      aria-pressed={size === s}
                      onClick={() => {
                        setSize(s);
                        setError("");
                      }}
                      className="min-h-12 rounded-[var(--radius)] border border-line px-2 font-semibold transition-[border-color,background-color,transform] duration-150 hover:border-ink active:scale-95 disabled:cursor-not-allowed disabled:bg-surface disabled:text-[#bbb] disabled:line-through aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
                      aria-label={n === 0 ? `${s}, sold out` : s}
                    >
                      {s.replace("US ", isShoe ? "" : "US ")}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 min-h-6 text-small font-semibold" aria-live="polite">
                {left !== undefined && left <= 3 ? <span className="font-extrabold">Only {left} left in {size}.</span> : left ? `In stock, ships within ${TERMS.dispatchDays} days.` : ""}
              </p>
            </fieldset>
          )}

          {error && (
            <p className="error mt-2" role="alert">
              {error}
            </p>
          )}

          <div className="mt-4 grid gap-2">
            <button type="button" className="btn min-h-14 w-full" onClick={add}>
              Add to bag
            </button>
            <button type="button" className="btn btn--plain min-h-14 w-full" onClick={() => toggleWish(p.slug)} aria-pressed={saved}>
              {saved ? "Saved ♥" : "Save for later ♡"}
            </button>
          </div>

          <ul className="mt-10 grid gap-2">
            {p.details.map((d) => (
              <li key={d} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-[var(--radius)] bg-surface p-5 text-small leading-relaxed">
            Free shipping over $100, otherwise $8. Arrives in 2 to 4 days in Europe and North America. Return it within {TERMS.returnDays} days for any reason; size swaps are free.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="wrap mt-[var(--gap-section)]">
          <h2 id="related-title" className="head" data-reveal>
            Wear it with
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug}>
                <ProductCard product={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <dialog
        ref={guide}
        aria-labelledby="guide-title"
        onClick={(e) => e.target === guide.current && guide.current?.close()}
        /* taste-skill-ignore: dialog */ className="m-auto w-[min(36rem,calc(100vw-2rem))] max-w-none bg-bg p-0 text-ink shadow-[0_24px_80px_rgb(6_17_33/0.35)] backdrop:bg-night/50 open:animate-[rise_220ms_var(--ease-out)]"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 id="guide-title" className="text-lead font-extrabold tracking-[-0.03em]">
              Size guide
            </h2>
            <button type="button" onClick={() => guide.current?.close()} className="h-11 px-2 font-semibold hover:text-accent">
              Close
            </button>
          </div>
          <table className="mt-6 w-full border-collapse text-left tabular-nums">
            <thead>
              {isShoe ? (
                <tr className="border-b-2 border-ink">
                  <th className="py-2">US</th>
                  <th>UK</th>
                  <th>EU</th>
                  <th>Foot length</th>
                </tr>
              ) : (
                <tr className="border-b-2 border-ink">
                  <th className="py-2">Size</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Hips</th>
                </tr>
              )}
            </thead>
            <tbody>
              {isShoe
                ? [6, 7, 8, 9, 10, 11, 12].map((us) => (
                    /* taste-skill-ignore: real table */ <tr key={us} className="border-b border-[#b9c3cc]">
                      <td className="py-2">{us}</td>
                      <td>{us - 1}</td>
                      <td>{Math.round(us + 33)}</td>
                      <td>{(22.9 + (us - 6) * 0.85).toFixed(1)} cm</td>
                    </tr>
                  ))
                : [
                    ["XS", 84, 70, 86],
                    ["S", 90, 76, 92],
                    ["M", 96, 82, 98],
                    ["L", 102, 88, 104],
                    ["XL", 108, 94, 110],
                    ["XXL", 116, 102, 118],
                  ].map(([s, c, w, h]) => (
                    /* taste-skill-ignore: real table */ <tr key={s} className="border-b border-[#b9c3cc]">
                      <td className="py-2 font-semibold">{s}</td>
                      <td>{c} cm</td>
                      <td>{w} cm</td>
                      <td>{h} cm</td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <p className="mt-4 text-small text-muted">Between two sizes? Take the larger one for layering. Swaps are free.</p>
        </div>
      </dialog>
    </div>
  );
}
