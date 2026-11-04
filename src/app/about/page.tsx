import type { Metadata } from "next";
import Link from "next/link";
import { Picture } from "@/components/Picture";
import { FAQ } from "@/components/home/Questions";

export const metadata: Metadata = {
  title: "Delivery & returns",
  description: "Free shipping over $100, delivery in 2 to 4 days, 30-day returns and free size swaps.",
};

const FACTS = [
  { title: "Shipping", text: "Free over $100. Otherwise a flat $8, wherever we deliver. Orders leave within 2 working days." },
  { title: "Delivery times", text: "2 to 4 days in Europe and North America, 5 to 8 days elsewhere, with tracking by email." },
  { title: "Returns", text: "30 days, any reason, unworn with tags. Start it from your account; the label is prepaid." },
  { title: "Size swaps", text: "Free, once per order item. We send the new size as soon as the old one is scanned." },
  { title: "Care", text: "Wash at 30°C, inside out, no softener: it blocks the fabric's wicking. Hang to dry." },
];

export default function AboutPage() {
  return (
    <div className="pb-[var(--gap-section)]">
      <div className="wrap grid gap-10 pt-12 md:pt-16 lg:grid-cols-[7fr_5fr] lg:items-end">
        <div data-reveal>
          <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Delivery & returns</h1>
          <p className="mt-6 max-w-[44ch] text-lead leading-snug">Everything about getting your kit, and sending it back if it isn&rsquo;t right.</p>
        </div>
        <Picture name="sky-wind" alt="A runner in an olive shell jacket under a grey, windy sky" sizes="(min-width: 1024px) 40vw, 100vw" width={1024} height={1536} className="aspect-[4/3] w-full object-cover object-[50%_30%]" priority />
      </div>

      <dl className="wrap mt-20 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
        {FACTS.map((f) => (
          <div key={f.title}>
            <dt className="text-lead font-extrabold tracking-[-0.03em]">{f.title}</dt>
            <dd className="mt-2 max-w-[38ch]">{f.text}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="questions-title" className="wrap mt-[var(--gap-section)]">
        <h2 id="questions-title" className="head">
          Common questions
        </h2>
        <div className="mt-10 grid gap-8">
          {FAQ.map((f) => (
            <div key={f.q} className="grid gap-3 md:grid-cols-12 md:gap-8" data-reveal>
              <h3 className="text-[1.375rem] font-extrabold tracking-[-0.03em] md:col-span-5">{f.q}</h3>
              <p className="max-w-[60ch] md:col-span-6 md:col-start-7">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-14">
          Still stuck? Email{" "}
          <a href="mailto:hello@skystore.example?subject=Question%20about%20my%20order" className="link font-semibold">
            hello@skystore.example
          </a>{" "}
          or{" "}
          <Link href="/account/" className="link font-semibold">
            check your orders
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
