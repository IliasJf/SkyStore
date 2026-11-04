"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Currency } from "@/lib/money";
import { openCart, setCurrency, totals, useShop } from "@/lib/store";
import { Search } from "./Search";

const LINKS = [
  { href: "/shop/", label: "Shop" },
  { href: "/#today", label: "Today's sky" },
  { href: "/about/", label: "Delivery & returns" },
];

export function Header() {
  const shop = useShop();
  const { count } = totals(shop);
  const path = usePathname();
  const [searching, setSearching] = useState(false);
  const badge = useRef<HTMLSpanElement>(null);
  const last = useRef(count);

  // The cart count jumps when something lands in it.
  useEffect(() => {
    if (count > last.current && badge.current) {
      badge.current.style.animation = "none";
      void badge.current.offsetWidth;
      badge.current.style.animation = "bump 420ms var(--ease-out)";
    }
    last.current = count;
  }, [count]);

  // "/" or Ctrl/Cmd+K opens search, as in most product apps.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /input|textarea|select/i.test(e.target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearching(true);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-bg">
      <a href="#main" className="skip">
        Skip to content
      </a>
      <div className="wrap flex h-16 items-center gap-6">
        <Link href="/" className="text-body font-extrabold tracking-[-0.04em]" aria-label="SkyStore home">
          SkyStore
        </Link>
        <nav aria-label="Main" className="hidden gap-6 font-semibold md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={path === l.href ? "page" : undefined}
              className="transition-colors duration-150 hover:text-accent aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-1 sm:gap-3">
          <button type="button" onClick={() => setSearching(true)} className="h-11 px-2 font-semibold transition-colors hover:text-accent" aria-keyshortcuts="Control+K /">
            Search
          </button>
          <label className="sr-only" htmlFor="currency">
            Currency
          </label>
          <select
            id="currency"
            value={shop.currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="h-11 cursor-pointer bg-transparent px-1 font-semibold"
          >
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
          </select>
          <Link href="/wishlist/" className="hidden h-11 items-center px-2 font-semibold transition-colors hover:text-accent sm:flex">
            Saved{shop.wishlist.length ? ` (${shop.wishlist.length})` : ""}
          </Link>
          <button type="button" onClick={() => openCart()} className="flex h-11 items-center gap-2 bg-ink px-4 font-semibold text-bg transition-transform active:scale-95">
            Cart
            <span ref={badge} className="inline-grid min-w-6 place-items-center bg-accent px-1.5 text-white tabular-nums" aria-label={`${count} items`}>
              {count}
            </span>
          </button>
        </div>
      </div>
      <nav aria-label="Main, small screens" className="wrap flex gap-5 overflow-x-auto pb-3 font-semibold md:hidden">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="shrink-0">
            {l.label}
          </Link>
        ))}
        <Link href="/wishlist/" className="shrink-0 sm:hidden">
          Saved
        </Link>
      </nav>
      <Search open={searching} onClose={() => setSearching(false)} />
    </header>
  );
}
