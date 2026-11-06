"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Currency } from "@/lib/money";
import { openCart, setCurrency, totals, useShop } from "@/lib/store";
import { Search } from "./Search";

const LINKS = [
  { href: "/shop/", label: "Shop all" },
  { href: "/shop/?cat=tops", label: "Tops" },
  { href: "/shop/?cat=jackets", label: "Jackets" },
  { href: "/shop/?cat=shoes", label: "Shoes" },
  { href: "/shop/?cat=watches", label: "Watches" },
  { href: "/#today", label: "Today's sky" },
];

/** The mark: a sun on the horizon, the store's whole idea in one shape. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <path d="M6 20a10 10 0 0 1 20 0Z" fill="currentColor" />
        <rect x="2" y="22" width="28" height="3" rx="1.5" fill="currentColor" />
      </svg>
      <span className="text-[1.25rem] font-extrabold tracking-[-0.04em] uppercase italic">SkyStore</span>
    </span>
  );
}

const Icon = {
  search: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.8-4.8" strokeLinecap="round" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.9 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.4 0 5.7 3.3 4.5 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z" />
    </svg>
  ),
  bag: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 8h14l-1 12.5H6L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  ),
};

export function Header() {
  const shop = useShop();
  const { count } = totals(shop);
  const path = usePathname();
  const [searching, setSearching] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const badge = useRef<HTMLSpanElement>(null);
  const last = useRef(count);

  // The bag count jumps when something lands in it.
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

  const iconBtn = "relative grid h-11 w-11 place-items-center rounded-full transition-colors duration-150 hover:bg-surface";

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <p className="bg-ink px-4 py-2 text-center text-small font-semibold text-white">
        Free shipping over $100 · 30-day returns ·{" "}
        <Link href="/about/" className="underline underline-offset-2">
          Details
        </Link>
      </p>
      <header className="sticky top-0 z-40 border-b border-line bg-bg">
        <div className="wrap grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-1">
            <button type="button" className={`${iconBtn} lg:hidden`} aria-label="Menu" onClick={() => menu.current?.showModal()}>
              {Icon.menu}
            </button>
            <Link href="/" aria-label="SkyStore home" className="hidden lg:inline-flex">
              <Logo />
            </Link>
          </div>

          <nav aria-label="Main" className="hidden items-center gap-7 font-semibold lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={path === l.href ? "page" : undefined}
                className="relative py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-200 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/" aria-label="SkyStore home" className="lg:hidden">
            <Logo />
          </Link>

          <div className="flex items-center justify-end gap-0.5">
            <button type="button" onClick={() => setSearching(true)} className={iconBtn} aria-label="Search" aria-keyshortcuts="Control+K /">
              {Icon.search}
            </button>
            <label className="sr-only" htmlFor="currency">
              Currency
            </label>
            <select
              id="currency"
              value={shop.currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="hidden h-11 cursor-pointer rounded-full bg-transparent px-2 font-semibold hover:bg-surface sm:block"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
            <Link href="/wishlist/" className={`${iconBtn} hidden sm:grid`} aria-label={`Saved items, ${shop.wishlist.length}`}>
              {Icon.heart}
              {shop.wishlist.length > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />}
            </Link>
            <button type="button" onClick={() => openCart()} className={iconBtn} aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}>
              {Icon.bag}
              <span ref={badge} aria-hidden="true" className="absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.6875rem] leading-none font-extrabold tabular-nums">
                {count || ""}
              </span>
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={menu}
        aria-label="Menu"
        onClick={(e) => e.target === menu.current && menu.current?.close()}
        /* taste-skill-ignore: dialog */ className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-bg p-0 text-ink shadow-[0_0_60px_rgb(0_0_0/0.25)] backdrop:bg-black/40 open:animate-[slidein_280ms_var(--ease-out)]"
      >
        <div className="flex items-center justify-between px-6 pt-5">
          <Logo />
          <button type="button" className={iconBtn} onClick={() => menu.current?.close()} aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav aria-label="Main, small screens" className="mt-8 grid px-6">
          {[...LINKS, { href: "/wishlist/", label: "Saved" }, { href: "/account/", label: "Account" }, { href: "/about/", label: "Delivery & returns" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => menu.current?.close()} className="py-3 text-[1.5rem] font-extrabold tracking-[-0.02em] uppercase">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 px-6">
          <label htmlFor="currency-m" className="text-small font-semibold">
            Currency
          </label>
          <select id="currency-m" className="input mt-1" value={shop.currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>
      </dialog>

      <Search open={searching} onClose={() => setSearching(false)} />
    </>
  );
}
