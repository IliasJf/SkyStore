import Link from "next/link";
import { Logo } from "./Header";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop/", label: "Shop all" },
      { href: "/shop/?cat=tops", label: "Tops" },
      { href: "/shop/?cat=jackets", label: "Jackets" },
      { href: "/shop/?cat=bottoms", label: "Bottoms" },
      { href: "/shop/?cat=shoes", label: "Shoes" },
      { href: "/shop/?cat=watches", label: "Watches" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/about/", label: "Delivery & returns" },
      { href: "/about/#questions-title", label: "Questions" },
      { href: "/account/", label: "Your orders" },
      { href: "mailto:hello@skystore.example?subject=Question%20about%20my%20order", label: "Email us" },
    ],
  },
  {
    title: "SkyStore",
    links: [
      { href: "/#today", label: "Dress for today's sky" },
      { href: "/wishlist/", label: "Saved items" },
      { href: "https://github.com/IliasJf/SkyStore", label: "Source code" },
    ],
  },
];

/** A sports-brand close: the mark, the menus in columns, the small print below. */
export function Footer() {
  return (
    <footer className="bg-night text-night-ink">
      <div className="wrap grid gap-12 pt-16 pb-10 lg:grid-cols-[5fr_7fr]">
        <div data-reveal>
          <Logo />
          <p className="mt-5 max-w-[34ch] text-[#b5b5b5]">Running and training kit for every sky. Free shipping over $100, 30-day returns and free size swaps.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3" data-reveal>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h2 className="font-extrabold uppercase">{c.title}</h2>
              <ul className="mt-4 grid gap-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[#b5b5b5] transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-white/15 py-6 text-small text-[#9a9a9a] lg:flex-row lg:justify-between">
        <p>
          © 2026 SkyStore. A portfolio demo by{" "}
          <a className="link" href="https://github.com/IliasJf">
            Ilias Jafaoui
          </a>
          . No real orders or payments.
        </p>
        <p>
          Photography made for this demo with Figma AI. Cloud time-lapse{" "}
          <a className="link" href="https://commons.wikimedia.org/wiki/File:Cumulus.ogv">
            “Cumulus”
          </a>
          , CC BY 2.5. Weather by{" "}
          <a className="link" href="https://open-meteo.com">
            Open-Meteo
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
