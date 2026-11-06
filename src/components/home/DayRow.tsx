"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { bySlug } from "@/lib/catalog";
import { MOMENTS, momentAt, type Moment } from "@/lib/sky";
import { Picture } from "../Picture";
import { Price } from "../Price";

const noop = () => () => {};

/** One day, five skies: the campaign as tall cards, the visitor's own hour marked. */
export function DayRow() {
  const now = useSyncExternalStore<Moment["id"] | null>(noop, () => momentAt(new Date().getHours()), () => null);
  return (
    <section aria-labelledby="day-title" className="pt-[var(--gap-section)]">
      <div className="wrap" data-reveal>
        <h2 id="day-title" className="head">
          One day, five skies
        </h2>
        <p className="mt-4 max-w-[46ch] text-lead text-muted">Dawn to after dark, and the one piece each sky asks for.</p>
      </div>
      <ul className="no-scrollbar wrap mt-8 grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-3 overflow-x-auto scroll-px-[var(--margin)] sm:auto-cols-[44%] lg:auto-cols-[calc((100%-4*0.75rem)/5)]">
        {MOMENTS.map((m) => {
          const p = bySlug(m.product)!;
          return (
            <li key={m.id} className="snap-start">
              <Link href={`/product/${p.slug}/`} className="group relative block overflow-hidden rounded-[var(--radius)] bg-ink text-white">
                <Picture name={m.image} alt={m.alt} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 44vw, 78vw" width={1024} height={1536} className="aspect-[2/3] w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105" />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.7),transparent_55%)]" aria-hidden="true" />
                {m.id === now && <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-small font-bold text-ink">Your sky now</span>}
                <span className="absolute inset-x-4 bottom-4">
                  <span className="block text-small font-semibold tabular-nums opacity-90">
                    {m.time} · {m.label}
                  </span>
                  <span className="mt-1 block text-[1.375rem] leading-tight font-extrabold tracking-[-0.02em] uppercase">{p.name}</span>
                  <Price usd={p.price} className="mt-1 block font-semibold" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
