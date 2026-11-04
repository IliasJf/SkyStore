"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Picture } from "@/components/Picture";
import { money } from "@/lib/money";
import { useShop } from "@/lib/store";

/** The receipt: what was ordered, where it's going and when it should arrive. */
export function OrderView() {
  const id = useSearchParams().get("id");
  const shop = useShop();
  const order = shop.orders.find((o) => o.id === id);

  if (!order)
    return (
      <div className="wrap pt-12 pb-[var(--gap-section)] md:pt-16">
        <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Order not found</h1>
        <p className="mt-6 max-w-[48ch] text-lead">Orders are kept in the browser they were placed in. Open your account to see the ones placed here.</p>
        <Link href="/account/" className="btn btn--ink mt-8">
          Your orders
        </Link>
      </div>
    );

  const placed = new Date(order.placedAt);
  const from = new Date(placed.getTime() + 2 * 86400000);
  const to = new Date(placed.getTime() + 4 * 86400000);
  const day = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="pb-[var(--gap-section)]">
      <div className="bg-night text-night-ink">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[1fr_auto] md:items-end md:py-24" data-reveal>
          <div>
            <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Thank you, {order.name.split(" ")[0]}</h1>
            <p className="mt-6 max-w-[44ch] text-lead leading-snug">
              Order {order.id} is confirmed. It should reach you between {day(from)} and {day(to)}. A receipt is on its way to {order.email}.
            </p>
          </div>
          <p className="text-lead font-extrabold tabular-nums">{money(order.total, order.currency)}</p>
        </div>
      </div>

      <div className="wrap mt-16 grid gap-12 lg:grid-cols-[7fr_4fr]">
        <section aria-labelledby="items-title">
          <h2 id="items-title" className="head">
            In the parcel
          </h2>
          <ul className="mt-8">
            {order.lines.map((l) => (
              <li key={`${l.slug}-${l.colour}-${l.size}`} className="grid grid-cols-[80px_1fr_auto] items-center gap-5 border-b-2 border-surface py-4">
                <Picture name={l.image} alt="" sizes="80px" className="aspect-[4/5] w-full object-cover" width={80} height={100} />
                <span>
                  <span className="block font-semibold">{l.name}</span>
                  <span className="block text-small text-muted">
                    {l.colour} · {l.size} · ×{l.qty}
                  </span>
                </span>
                <span className="tabular-nums">{money(l.price * l.qty, order.currency)}</span>
              </li>
            ))}
          </ul>
        </section>
        <aside className="self-start bg-surface p-6">
          <h2 className="text-lead font-extrabold tracking-[-0.03em]">Delivery and payment</h2>
          <p className="mt-4">
            {order.name}
            <br />
            {order.address}
            <br />
            {order.city}, {order.country}
          </p>
          <p className="mt-4">Paid with the card ending {order.last4} (test card, nothing charged).</p>
          <dl className="mt-4 grid grid-cols-[1fr_auto] gap-y-1">
            <dt>Subtotal</dt>
            <dd className="text-right tabular-nums">{money(order.subtotal, order.currency)}</dd>
            {order.discount > 0 && (
              <>
                <dt>Discount</dt>
                <dd className="text-right tabular-nums">−{money(order.discount, order.currency)}</dd>
              </>
            )}
            <dt>Shipping</dt>
            <dd className="text-right tabular-nums">{order.shipping ? money(order.shipping, order.currency) : "Free"}</dd>
            <dt className="pt-2 font-extrabold">Total</dt>
            <dd className="pt-2 text-right font-extrabold tabular-nums">{money(order.total, order.currency)}</dd>
          </dl>
          <Link href="/shop/" className="btn btn--ink mt-6 w-full">
            Keep shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
