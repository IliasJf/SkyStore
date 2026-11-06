"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { bySlug, TERMS } from "@/lib/catalog";
import { money } from "@/lib/money";
import { openCart, removeLine, setQty, totals, useShop } from "@/lib/store";
import { Picture } from "./Picture";

/** The cart slides in from the right whenever something is added, or from the Cart button. */
export function CartDrawer() {
  const shop = useShop();
  const t = totals(shop);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (shop.cartOpen && !d.open) d.showModal();
    if (!shop.cartOpen && d.open) d.close();
  }, [shop.cartOpen]);

  const progress = Math.min(1, (t.subtotal - t.discount) / TERMS.freeShippingFrom);

  return (
    <dialog
      ref={ref}
      onClose={() => openCart(false)}
      onClick={(e) => e.target === ref.current && openCart(false)}
      aria-labelledby="cart-title"
      /* taste-skill-ignore: dialog */ className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(28rem,100vw)] max-w-none bg-bg p-0 text-ink shadow-[0_0_80px_rgb(6_17_33/0.3)] backdrop:bg-black/40 open:animate-[slide_320ms_var(--ease-out)]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 id="cart-title" className="text-lead font-extrabold tracking-[-0.03em]">
            Your bag{t.count ? `, ${t.count} ${t.count === 1 ? "item" : "items"}` : ""}
          </h2>
          <button type="button" onClick={() => openCart(false)} className="h-11 px-3 font-semibold hover:text-accent" aria-label="Close bag">
            Close
          </button>
        </div>

        {t.count > 0 && (
          <div className="px-6 pb-4">
            <p className="text-small font-semibold">
              {t.toFree > 0 ? `${money(t.toFree, shop.currency)} more for free shipping` : "Free shipping on this order"}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <div className="h-full origin-left bg-ink transition-transform duration-500 ease-[var(--ease-out)]" style={{ transform: `scaleX(${progress})` }} />
            </div>
          </div>
        )}

        <ul className="grow overflow-y-auto px-6">
          {shop.cart.map((l) => {
            const p = bySlug(l.slug);
            if (!p) return null;
            const image = p.colours.find((c) => c.name === l.colour)?.image ?? p.colours[0].image;
            return (
              <li key={`${l.slug}-${l.colour}-${l.size}`} className="flex gap-4 py-4 animate-[rise_320ms_var(--ease-out)]">
                <Link href={`/product/${p.slug}/`} onClick={() => openCart(false)} className="shrink-0">
                  <Picture name={image} alt={`${p.name} in ${l.colour}`} sizes="88px" className="h-[110px] w-[88px] rounded-[var(--radius)] bg-tile object-cover" width={88} height={110} />
                </Link>
                <div className="grow">
                  <div className="flex justify-between gap-3 font-semibold">
                    <span>{p.name}</span>
                    <span className="tabular-nums">{money(p.price * l.qty, shop.currency)}</span>
                  </div>
                  <p className="text-small text-muted">
                    {l.colour} · {l.size}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-surface font-semibold active:scale-95" onClick={() => setQty(l, l.qty - 1)} aria-label={`One fewer ${p.name}`}>
                      −
                    </button>
                    <span className="w-8 text-center tabular-nums" aria-live="polite">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-full bg-surface font-semibold active:scale-95 disabled:opacity-40"
                      onClick={() => setQty(l, l.qty + 1)}
                      disabled={l.qty >= (p.stock[l.size] ?? 0)}
                      aria-label={`One more ${p.name}`}
                    >
                      +
                    </button>
                    <button type="button" onClick={() => removeLine(l)} className="ms-auto h-9 px-2 text-small font-semibold text-muted hover:text-ink">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {!shop.cart.length && (
            <li className="py-10">
              <p className="text-lead font-semibold">Nothing here yet.</p>
              <p className="mt-2 text-muted">Pick something for tomorrow&rsquo;s run.</p>
              <Link href="/shop/" onClick={() => openCart(false)} className="btn btn--ink mt-6">
                Browse the shop
              </Link>
            </li>
          )}
        </ul>

        {t.count > 0 && (
          <div className="bg-surface px-6 pt-5 pb-6">
            <dl className="grid grid-cols-[1fr_auto] gap-y-1">
              <dt>Subtotal</dt>
              <dd className="text-right tabular-nums">{money(t.subtotal, shop.currency)}</dd>
              {t.discount > 0 && (
                <>
                  <dt>Discount</dt>
                  <dd className="text-right tabular-nums">−{money(t.discount, shop.currency)}</dd>
                </>
              )}
              <dt>Shipping</dt>
              <dd className="text-right tabular-nums">{t.shipping ? money(t.shipping, shop.currency) : "Free"}</dd>
              <dt className="pt-2 text-lead font-extrabold">Total</dt>
              <dd className="pt-2 text-right text-lead font-extrabold tabular-nums">{money(t.total, shop.currency)}</dd>
            </dl>
            <Link href="/checkout/" onClick={() => openCart(false)} className="btn mt-4 w-full">
              Check out
            </Link>
            <Link href="/cart/" onClick={() => openCart(false)} className="link mt-3 block text-center text-small font-semibold">
              View bag and add a promo code
            </Link>
          </div>
        )}
      </div>
    </dialog>
  );
}
