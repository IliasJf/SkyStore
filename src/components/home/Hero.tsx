import Link from "next/link";
import { Picture } from "../Picture";

/** Three skies, edge to edge, and the promise over them. */
const SHOTS = [
  { name: "sky-dawn", alt: "A runner on a rooftop at dawn in a sand tee", pos: "50% 30%" },
  { name: "sky-noon", alt: "A runner at midday in a white tee and navy shorts under a blue sky", pos: "50% 30%" },
  { name: "sky-dusk", alt: "A runner cooling down at sunset in a rust half-zip", pos: "50% 30%" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative h-[calc(100svh-var(--header-h)-2.25rem)] min-h-[34rem] overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 grid md:grid-cols-3">
        {SHOTS.map((s, i) => (
          <div key={s.name} className={`relative overflow-hidden ${i === 1 ? "" : "hidden md:block"}`}>
            <Picture
              name={s.name}
              alt={s.alt}
              priority
              sizes="(min-width: 768px) 34vw, 100vw"
              width={1024}
              height={1536}
              className="h-full w-full animate-[drift_26s_var(--ease-in-out)_infinite_alternate] object-cover"
              style={{ objectPosition: s.pos, animationDelay: `${i * -7}s` }}
            />
          </div>
        ))}
      </div>
      {/* A neutral scrim under the words. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgb(0_0_0/0.65),transparent)]" aria-hidden="true" />

      <div className="wrap relative flex h-full flex-col justify-end pb-[clamp(2rem,6vh,4rem)]" data-reveal>
        <h1 id="hero-title" className="display max-w-[12ch] text-display">
          Dressed for any sky
        </h1>
        <p className="mt-5 max-w-[38ch] text-lead font-semibold">Running and training kit, picked for the weather outside. From first light to after dark.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop/" className="btn btn--light">
            Shop now
          </Link>
          <Link href="/#today" className="btn btn--plain !border-white/70 !text-white hover:!border-white">
            Dress for today
          </Link>
        </div>
      </div>
    </section>
  );
}
