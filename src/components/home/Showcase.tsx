import Link from "next/link";
import { Picture } from "../Picture";
import { Price } from "../Price";

const SPECS = [
  ["36 mm", "foam under the heel"],
  ["8 mm", "heel-to-toe drop"],
  ["255 g", "in a US 9"],
];

/** The hero product, sports-brand style: the shoe large, a close-up beside it, the facts and one way to buy. */
export function Showcase() {
  return (
    <section aria-labelledby="runner-title" className="wrap pt-[var(--gap-section)]">
      <div className="grid gap-3 lg:grid-cols-[7fr_5fr]">
        <div className="grid grid-cols-[3fr_2fr] gap-3" data-reveal>
          <div className="overflow-hidden rounded-[var(--radius)] bg-tile">
            <Picture
              name="p-runner-white"
              alt="The Horizon Runner: an off-white knit running shoe with a grey foam sole and an orange heel tab"
              sizes="(min-width: 1024px) 35vw, 60vw"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-[var(--radius)] bg-tile">
            <Picture name="detail-knit" alt="Close-up of the knit upper and the orange heel tab" sizes="(min-width: 1024px) 23vw, 40vw" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[var(--radius)] bg-ink p-6 text-white sm:p-10" data-reveal>
          <div>
            <p className="text-small font-semibold text-[#b5b5b5]">Featured · Shoes</p>
            <h2 id="runner-title" className="display mt-3 text-[clamp(2.5rem,1.4rem+3.6vw,4.5rem)]">
              Built for the long way
            </h2>
            <p className="mt-5 max-w-[38ch] text-[#d4d4d4]">The Horizon Runner: a soft, high-rebound road shoe with a knit upper that moves with your foot. Made for daily miles.</p>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
            {SPECS.map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-[1.75rem] leading-none font-extrabold tracking-[-0.03em]">{n}</span>
                  <span className="mt-1 block text-small text-[#b5b5b5]">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/product/horizon-runner/" className="btn btn--light">
              Shop the Horizon Runner
            </Link>
            <Price usd={148} className="text-lead font-extrabold" />
          </div>
        </div>
      </div>
    </section>
  );
}
