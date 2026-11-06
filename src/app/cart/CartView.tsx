"use client";

import Link from "next/link";
import { useState } from "react";
import { Picture } from "@/components/Picture";
import { bySlug, TERMS } from "@/lib/catalog";
import { money } from "@/lib/money";
import { applyPromo, clearPromo, PROMOS, removeLine, setQty, totals, useShop } from "@/lib/store";

export function CartView() {
  const shop = useShop();
  const t = totals(shop);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="wrap pt-12 pb-[var(--gap-section)] md:pt-16">
      <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Your bag</h1>
      {!shop.cart.length ? (
        <div className="mt-12 rounded-[var(--radius)] bg-surface p-10">
          <p className="text-lead font-semibold">Your bag is empty.</p>
          <p className="mt-2 text-muted">Saved items stay in your wishlist.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop/" className="btn btn--ink">
              Browse the shop
            </Link>
            <Link href="/wishlist/" className="btn btn--plain">
              Open saved items
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[7fr_4fr]">
          <ul>
            {shop.cart.map((l) => {
              const p = bySlug(l.slug);
              if (!p) return null;
              const image = p.colours.find((c) => c.name === l.colour)?.image ?? p.colours[0].image;
              return (
                <li key={`${l.slug}-${l.colour}-${l.size}`} className="grid grid-cols-[96px_1fr] gap-5 border-b border-line py-6 sm:grid-cols-[140px_1fr]">
                  <Link href={`/product/${p.slug}/`}>
                    <Picture name={image} alt={`${p.name} in ${l.colour}`} sizes="140px" className="aspect-[4/5] w-full rounded-[var(--radius)] bg-tile object-cover" width={140} height={175} />
                  </Link>
                  <div className="flex flex-col">
                    <div className="flex justify-between gap-4">
                      <Link href={`/product/${p.slug}/`} className="text-lead font-extrabold tracking-[-0.03em] hover:text-accent">
                        {p.name}
                      </Link>
                      <span className="text-lead font-semibold tabular-nums">{money(p.price * l.qty, shop.currency)}</span>
                    </div>
                    <p className="text-muted">
                      {l.colour} · {l.size} · {money(p.price, shop.currency)} each
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-4">
                      <label className="sr-only" htmlFor={`qty-${l.slug}-${l.size}`}>
                        Quantity
                      </label>
                      <select id={`qty-${l.slug}-${l.size}`} className="input !min-h-11 !w-24" value={l.qty} onChange={(e) => setQty(l, Number(e.target.value))}>
                        {Array.from({ length: Math.min(10, p.stock[l.size] ?? 1) }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="h-11 px-3 font-semibold text-muted hover:text-ink" onClick={() => removeLine(l)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside aria-labelledby="summary-title" className="self-start rounded-[var(--radius)] bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <h2 id="summary-title" className="text-lead font-extrabold tracking-[-0.03em]">
              Summary
            </h2>
            <dl className="mt-4 grid grid-cols-[1fr_auto] gap-y-2">
              <dt>Subtotal</dt>
              <dd className="text-right tabular-nums">{money(t.subtotal, shop.currency)}</dd>
              {t.discount > 0 && (
                <>
                  <dt>
                    {shop.promo}{" "}
                    <button type="button" className="link text-small" onClick={clearPromo}>
                      remove
                    </button>
                  </dt>
                  <dd className="text-right tabular-nums">−{money(t.discount, shop.currency)}</dd>
                </>
              )}
              <dt>Shipping</dt>
              <dd className="text-right tabular-nums">{t.shipping ? money(t.shipping, shop.currency) : "Free"}</dd>
              <dt className="pt-3 text-lead font-extrabold">Total</dt>
              <dd className="pt-3 text-right text-lead font-extrabold tabular-nums">{money(t.total, shop.currency)}</dd>
            </dl>
            {t.toFree > 0 && <p className="mt-3 text-small font-semibold">Add {money(t.toFree, shop.currency)} more for free shipping (from {money(TERMS.freeShippingFrom, shop.currency)}).</p>}

            {!shop.promo && (
              <form
                className="mt-6"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (applyPromo(code)) {
                    setError("");
                    setCode("");
                  } else setError(`“${code || " "}” isn't a valid code. Try SKY10 for 10% off.`);
                }}
              >
                <label htmlFor="promo" className="text-small font-semibold">
                  Promo code
                </label>
                <div className="mt-1 flex gap-2">
                  <input id="promo" className="input uppercase" value={code} onChange={(e) => setCode(e.target.value)} aria-invalid={!!error} aria-describedby={error ? "promo-error" : undefined} />
                  <button className="btn btn--ink shrink-0" type="submit">
                    Apply
                  </button>
                </div>
                {error && (
                  <p id="promo-error" className="error mt-2" role="alert">
                    {error}
                  </p>
                )}
                {!error && <p className="mt-2 text-small text-muted">Demo code: SKY10, {PROMOS.SKY10.label.toLowerCase()}.</p>}
              </form>
            )}
            <Link href="/checkout/" className="btn mt-6 w-full">
              Check out
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
