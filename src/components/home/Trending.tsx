"use client";

import { useRef } from "react";
import { bySlug } from "@/lib/catalog";
import { ProductCard } from "../ProductCard";

const PICKS = ["horizon-runner", "crosswind-shell", "daybreak-tee", "altitude-gps", "dusk-half-zip", "cloudline-joggers", "night-shift-jacket", "stratus-shorts"];

/** The best sellers in a row you can swipe, with arrows on a desktop. */
export function Trending() {
  const row = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" });
  const arrow = "grid h-11 w-11 place-items-center rounded-full bg-surface text-lead transition-colors hover:bg-[#e5e5e5] active:scale-95";

  return (
    <section aria-labelledby="trend-title" className="pt-[var(--gap-section)]">
      <div className="wrap flex items-end justify-between gap-4" data-reveal>
        <h2 id="trend-title" className="head">
          Trending now
        </h2>
        <div className="hidden gap-2 md:flex">
          <button type="button" className={arrow} onClick={() => scroll(-1)} aria-label="Scroll back">
            ←
          </button>
          <button type="button" className={arrow} onClick={() => scroll(1)} aria-label="Scroll forward">
            →
          </button>
        </div>
      </div>
      <ul ref={row} className="no-scrollbar wrap mt-8 grid snap-x snap-mandatory auto-cols-[72%] grid-flow-col gap-3 overflow-x-auto scroll-px-[var(--margin)] sm:auto-cols-[42%] lg:auto-cols-[calc((100%-3*0.75rem)/4)]">
        {PICKS.map((slug) => (
          <li key={slug} className="snap-start">
            <ProductCard product={bySlug(slug)!} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 42vw, 72vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
