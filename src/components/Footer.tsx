import Link from "next/link";
import { Picture } from "./Picture";

const MENU = [
  { href: "/shop/", label: "Shop everything" },
  { href: "/#today", label: "Dress for today's sky" },
  { href: "/about/", label: "Delivery & returns" },
  { href: "/wishlist/", label: "Saved items" },
  { href: "/account/", label: "Your account" },
  { href: "/cart/", label: "Cart" },
];

/** The close: the Horizon Runner, closer than anywhere above, beside the menu set large. */
export function Footer() {
  return (
    <footer className="grid bg-night text-night-ink md:min-h-svh md:grid-cols-2">
      <div className="relative h-[50svh] overflow-hidden md:h-auto">
        <Picture
          name="detail-knit"
          alt="Close-up of the Horizon Runner's knit upper, foam midsole and orange heel tab"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover object-[30%_60%]"
        />
      </div>
      <div className="flex flex-col px-5 pt-10 pb-8 md:px-[8%] md:pt-20">
        <p className="text-body font-extrabold tracking-[-0.04em]">SkyStore</p>
        <nav aria-label="Footer" className="mt-8" data-reveal>
          <ul className="group/menu grid gap-3 md:gap-5">
            {MENU.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className="inline-block text-head leading-none font-extrabold tracking-[-0.04em] transition-[transform,color] duration-300 ease-[var(--ease-out)] group-hover/menu:text-[#8b98a8] hover:!text-night-ink hover:translate-x-3"
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-16 grid gap-8 text-small sm:grid-cols-2">
          <div>
            <p className="font-semibold">Questions</p>
            <p className="mt-1 text-[#b9c3cf]">
              hello@skystore.example
              <br />
              Replies within a day, Monday to Saturday.
            </p>
          </div>
          <div>
            <p className="font-semibold">About this site</p>
            <p className="mt-1 text-[#b9c3cf]">
              A portfolio demo by{" "}
              <a className="link" href="https://github.com/IliasJf">
                Ilias Jafaoui
              </a>
              . No real orders or payments.
            </p>
          </div>
        </div>
        <p className="mt-auto pt-16 text-small text-[#b9c3cf]">
          © 2026 SkyStore. Products and photographs were made for this demo with Figma AI. Cloud time-lapse:{" "}
          <a className="link" href="https://commons.wikimedia.org/wiki/File:Cumulus.ogv">
            “Cumulus”
          </a>
          , CC BY 2.5, via Wikimedia Commons.
        </p>
      </div>
    </footer>
  );
}
