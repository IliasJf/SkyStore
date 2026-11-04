"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { bySlug } from "@/lib/catalog";
import { useShop } from "@/lib/store";

export function WishlistView() {
  const { wishlist } = useShop();
  const items = wishlist.map(bySlug).filter((p) => !!p);
  return (
    <div className="wrap pt-12 pb-[var(--gap-section)] md:pt-16">
      <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Saved</h1>
      {items.length ? (
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <li key={p.slug} className="animate-[rise_420ms_var(--ease-out)_both]">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 bg-surface p-10">
          <p className="text-lead font-semibold">Nothing saved yet.</p>
          <p className="mt-2 text-muted">Tap the heart on any product to keep it here for later.</p>
          <Link href="/shop/" className="btn btn--ink mt-6">
            Browse the shop
          </Link>
        </div>
      )}
    </div>
  );
}
