"use client";

import { useEffect, useRef, useState } from "react";
import { Picture } from "../Picture";

/**
 * One scene, stepping statements: the rooftop track holds still while the
 * terms of every order step down the list, each with its own two pictures.
 */
const STEPS = [
  { text: "What comes with every order", pics: ["p-runner-white", "p-watch-steel"] },
  { text: "Free shipping over $100", pics: ["p-tee-sand", "p-cap-sand"] },
  { text: "At your door in 2 to 4 days", pics: ["p-shell-olive", "detail-rain"] },
  { text: "30 days to return, any reason", pics: ["p-joggers-charcoal", "p-shorts-navy"] },
  { text: "Size swaps cost nothing", pics: ["p-trainer-black", "p-tee-black"] },
  { text: "Card details never stored", pics: ["p-watch-gps", "p-jacket-night"] },
];

export function Promises() {
  const [active, setActive] = useState(0);
  const markers = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.step))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    markers.current.forEach((m) => m && io.observe(m));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="promise-title" className="relative h-[420vh]">
      {STEPS.map((_, i) => (
        /* taste-skill-ignore: invisible scroll marker */ <div key={i} ref={(el) => void (markers.current[i] = el)} data-step={i} aria-hidden="true" className="absolute h-px w-full" style={{ top: `${i * 70 + 35}vh` }} />
      ))}
      <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-hidden bg-night">
        <Picture
          name="scene-track"
          alt="An empty rooftop running track at first light, a city far off under a pale sky"
          sizes="100vw"
          width={1536}
          height={864}
          className="absolute inset-0 h-full w-full animate-[drift_24s_var(--ease-in-out)_infinite_alternate] object-cover"
        />
        {/* A neutral scrim under the text, over the upper third only. */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-night/70 md:h-[42%]" aria-hidden="true" />

        <ol className="absolute inset-x-[var(--margin)] top-8 mx-auto grid max-w-[34rem] gap-2.5 md:top-12 md:text-center" role="list">
          {STEPS.map((s, i) => {
            const Tag = i === 0 ? "h2" : "p";
            return (
              <li key={s.text}>
                <Tag
                  id={i === 0 ? "promise-title" : undefined}
                  className={`text-body leading-snug font-semibold transition-colors duration-300 ${i === active ? "text-night-ink" : "text-[#9fb0c4]"}`}
                >
                  {i === active && <span className="sr-only">Now showing: </span>}
                  {s.text}
                </Tag>
              </li>
            );
          })}
        </ol>

        {STEPS.map((s, i) => (
          <div key={s.text} aria-hidden="true" className={`transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${i === active ? "opacity-100" : "translate-y-6 opacity-0"}`}>
            <Picture name={s.pics[0]} alt="" sizes="240px" className="absolute bottom-[14%] left-[8%] hidden aspect-[4/5] w-[min(16vw,240px)] object-cover md:block" width={240} height={300} />
            <Picture name={s.pics[1]} alt="" sizes="(min-width: 768px) 200px, 44vw" className="absolute top-auto right-[var(--margin)] bottom-[8%] aspect-square w-[44vw] object-cover md:right-[9%] md:bottom-[30%] md:w-[min(13vw,200px)]" width={200} height={200} />
          </div>
        ))}
      </div>
    </section>
  );
}
