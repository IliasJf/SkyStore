"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { bySlug } from "@/lib/catalog";
import { MOMENTS, momentAt, type Moment } from "@/lib/sky";
import { Picture } from "../Picture";
import { Price } from "../Price";

const noop = () => () => {};

/**
 * The name holds still while the day passes under it: dawn, noon, wind, dusk,
 * night, each sky with the piece made for it. The title takes the ink chosen
 * for the sky beneath it, and the visitor's own hour is marked.
 */
export function PinnedSky() {
  // The visitor's hour is only known in the browser; the static HTML marks no panel.
  const now = useSyncExternalStore<Moment["id"] | null>(
    noop,
    () => momentAt(new Date().getHours()),
    () => null,
  );
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-20% 0px -75% 0px" },
    );
    panels.current.forEach((p) => p && io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="hero-title" className="relative grid">
      {/* The pinned layer shares the panels' grid cell, so it lets go exactly where the last sky ends. */}
      <div className="pointer-events-none sticky top-[var(--header-h)] z-10 h-[calc(100svh-var(--header-h))] self-start [grid-area:1/1]">
        <h1
          id="hero-title"
          className="display pointer-events-auto pt-[3vh] text-center text-[17vw] uppercase transition-colors duration-500 ease-[var(--ease-out)] md:pt-[6vh] md:text-[13.5vw]"
          style={{ color: MOMENTS[active].title }}
        >
          SkyStore
        </h1>
      </div>

      <div className="[grid-area:1/1]">
        {MOMENTS.map((m, i) => {
          const product = bySlug(m.product)!;
          const isNow = m.id === now;
          return (
            <div
              key={m.id}
              ref={(el) => void (panels.current[i] = el)}
              data-i={i}
              className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-end px-[var(--margin)] pb-6 md:block md:pb-0"
              style={{ background: m.ground, color: m.ink }}
            >
              <div className="mx-auto w-full pt-[22vw] md:absolute md:inset-x-0 md:top-[9vh] md:bottom-0 md:w-[37vw] md:pt-0">
                <div className="h-full overflow-hidden">
                <Picture
                  name={m.image}
                  alt={m.alt}
                  priority={i === 0}
                  sizes="(min-width: 768px) 37vw, 100vw"
                  width={1024}
                  height={1536}
                  className="aspect-[2/3] max-h-[46svh] w-full animate-[drift_26s_var(--ease-in-out)_infinite_alternate] object-cover object-[50%_30%] md:h-full md:max-h-none md:object-[50%_35%]"
                  style={{ animationDelay: `${i * -5}s` }}
                />
                </div>
              </div>

              <div data-reveal className="mt-5 grid gap-5 md:absolute md:inset-x-[var(--margin)] md:bottom-8 md:mt-0 md:grid-cols-[1fr_auto] md:items-end">
                <div className="max-w-[26ch] md:max-w-[30vw] lg:max-w-[26ch]">
                  <p className="text-small font-semibold tabular-nums">
                    {m.time} · {m.label}
                    {isNow && <span className="ms-2 inline-block bg-accent px-1.5 text-white">Your sky now</span>}
                  </p>
                  <p className="mt-3 text-lead leading-tight font-semibold">{i === 0 ? "Running and training kit, picked for whatever the sky does today." : product.blurb}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-end md:text-right">
                  <Link href={`/product/${product.slug}/`} className="group font-semibold">
                    <span className="underline decoration-[1.5px] underline-offset-4 transition-colors group-hover:decoration-transparent">
                      {product.name}, {m.colour.toLowerCase()}
                    </span>{" "}
                    <Price usd={product.price} />
                  </Link>
                  {i === 0 && (
                    <Link href="/shop/" className="btn">
                      Shop the collection
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
