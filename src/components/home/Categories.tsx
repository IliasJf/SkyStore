import Link from "next/link";
import { Picture } from "../Picture";

const TILES = [
  { cat: "tops", label: "Tops", image: "p-tee-sand", alt: "The Daybreak Tee in sand" },
  { cat: "jackets", label: "Jackets", image: "p-shell-olive", alt: "The Crosswind Shell in olive" },
  { cat: "shoes", label: "Shoes", image: "p-runner-white", alt: "The Horizon Runner shoe" },
  { cat: "watches", label: "Watches", image: "p-watch-gps", alt: "The Altitude GPS watch" },
];

export function Categories() {
  return (
    <section aria-labelledby="cat-title" className="wrap pt-[var(--gap-section)]">
      <div className="flex items-end justify-between gap-4" data-reveal>
        <h2 id="cat-title" className="head">
          Shop by kind
        </h2>
        <Link href="/shop/" className="link font-semibold">
          Shop all
        </Link>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4" data-reveal>
        {TILES.map((t) => (
          <li key={t.cat}>
            <Link href={`/shop/?cat=${t.cat}`} className="group relative block overflow-hidden rounded-[var(--radius)] bg-tile">
              <Picture name={t.image} alt={t.alt} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105" />
              <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 sm:inset-x-5 sm:bottom-5">
                <span className="text-[1.375rem] font-extrabold tracking-[-0.02em] uppercase sm:text-[1.75rem]">{t.label}</span>
                <span className="hidden rounded-full bg-ink px-4 py-2 text-small font-semibold text-white transition-transform duration-200 group-hover:translate-x-1 sm:inline-block">Shop</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
