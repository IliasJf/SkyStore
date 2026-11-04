"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Picture } from "../Picture";
import { Price } from "../Price";

/**
 * One frame, three distances: the Horizon Runner whole, then its knit upper,
 * then the foam and the heel tab, as the reader scrolls past three markers.
 */
const STAGES = [
  { scale: 1, origin: "50% 50%" },
  { scale: 1.8, origin: "38% 46%" },
  { scale: 3.2, origin: "86% 52%" },
];

export function Showcase() {
  const [stage, setStage] = useState(0);
  const markers = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStage(Number((e.target as HTMLElement).dataset.stage))),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    markers.current.forEach((m) => m && io.observe(m));
    return () => io.disconnect();
  }, []);

  const s = STAGES[stage];
  return (
    <section aria-labelledby="runner-title" className="relative h-[300vh] bg-bg">
      {[0, 1, 2].map((i) => (
        /* taste-skill-ignore: invisible scroll marker */ <div key={i} ref={(el) => void (markers.current[i] = el)} data-stage={i} className="absolute h-px w-full" style={{ top: `${i * 100 + 50}vh` }} aria-hidden="true" />
      ))}
      <div className="sticky top-[var(--header-h)] flex h-[calc(100svh-var(--header-h))] flex-col items-center justify-center overflow-hidden px-[var(--margin)]">
        {/* The sentence arrives in halves around the frame; read aloud, it is one heading. */}
        <h2 id="runner-title" aria-label="Built for the long way" className="display text-center text-[13vw] md:text-[7vw]">
          Built for
        </h2>

        <div className="relative mt-3 grid w-full max-w-[70vw] grid-cols-1 items-start gap-6 md:max-w-none md:grid-cols-[1fr_30vw_1fr]">
          <div className="hidden md:block" />
          <div className="relative aspect-[4/5] max-h-[52svh] w-full overflow-hidden bg-surface md:max-h-none">
            <Picture
              name="p-runner-white"
              alt="The Horizon Runner: an off-white knit running shoe with a grey foam sole and an orange heel tab"
              sizes="(min-width: 768px) 30vw, 70vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)]"
              style={{ transform: `scale(${s.scale})`, transformOrigin: s.origin }}
            />
          </div>
          <p
            aria-hidden="true"
            data-on={stage >= 1}
            className="display relative z-10 -mt-[0.3em] text-center text-[13vw] transition-[opacity,transform] duration-700 ease-[var(--ease-out)] data-[on=false]:translate-y-4 data-[on=false]:opacity-0 md:col-start-2 md:row-start-2 md:-mt-[0.45em] md:text-[7vw] md:whitespace-nowrap"
          >
            the long way
          </p>
          <div className="mx-auto max-w-[28ch] text-center transition-[opacity,transform] duration-700 ease-[var(--ease-out)] data-[on=false]:translate-y-4 data-[on=false]:opacity-0 md:col-start-3 md:row-start-1 md:mx-0 md:text-left" data-on={stage >= 2}>
            <p className="font-semibold">Horizon Runner</p>
            <p className="mt-2">36 mm of foam under the heel, an 8 mm drop and a knit upper that moves with your foot. 255 g in a US 9.</p>
            <p className="mt-4 flex items-center justify-center gap-4 md:justify-start">
              <Price usd={148} className="text-lead font-extrabold" />
              <Link href="/product/horizon-runner/" className="link font-semibold">
                See sizes
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
