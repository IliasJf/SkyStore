"use client";

import Link from "next/link";
import { useState } from "react";
import { money } from "@/lib/money";
import { signIn, signOut, useShop } from "@/lib/store";

/** A demo account: a name and an email kept in this browser, and the orders placed here. */
export function AccountView() {
  const shop = useShop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  if (!shop.account)
    return (
      <div className="wrap grid gap-12 pt-12 pb-[var(--gap-section)] md:pt-16 lg:grid-cols-2">
        <div>
          <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Your account</h1>
          <p className="mt-6 max-w-[40ch] text-lead leading-snug">Sign in to fill in checkout for you and see your orders. In this demo the account lives only in this browser; no password is needed.</p>
        </div>
        <form
          noValidate
          className="grid content-start gap-5 bg-surface p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const next = {
              name: name.trim().length < 2 ? "Enter your name." : undefined,
              email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : "Enter an email like name@example.com.",
            };
            setErrors(next);
            if (!next.name && !next.email) signIn({ name: name.trim(), email: email.trim() });
          }}
        >
          <h2 className="text-lead font-extrabold tracking-[-0.03em]">Sign in</h2>
          <div className="field">
            <label htmlFor="acc-name">Name</label>
            <input id="acc-name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "acc-name-error" : undefined} />
            {errors.name && (
              <p id="acc-name-error" className="error">
                {errors.name}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="acc-email">Email</label>
            <input id="acc-email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "acc-email-error" : undefined} />
            {errors.email && (
              <p id="acc-email-error" className="error">
                {errors.email}
              </p>
            )}
          </div>
          <button className="btn btn--ink" type="submit">
            Sign in
          </button>
        </form>
      </div>
    );

  return (
    <div className="wrap pt-12 pb-[var(--gap-section)] md:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Hi, {shop.account.name.split(" ")[0]}</h1>
        <button type="button" className="btn btn--plain" onClick={signOut}>
          Sign out
        </button>
      </div>
      <section aria-labelledby="orders-title" className="mt-16">
        <h2 id="orders-title" className="head">
          Your orders
        </h2>
        {shop.orders.length ? (
          <ul className="mt-8">
            {shop.orders.map((o) => (
              <li key={o.id}>
                <Link href={`/order/?id=${o.id}`} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b-2 border-surface py-5 transition-colors hover:text-accent sm:grid-cols-[12rem_1fr_auto]">
                  <span className="font-semibold tabular-nums">{o.id}</span>
                  <span className="col-start-1 text-muted sm:col-start-auto">
                    {new Date(o.placedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {o.lines.reduce((n, l) => n + l.qty, 0)} items
                  </span>
                  <span className="col-start-2 row-span-2 row-start-1 self-center text-right font-semibold tabular-nums sm:col-start-auto sm:row-span-1">{money(o.total, o.currency)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-lead">
            No orders yet.{" "}
            <Link href="/shop/" className="link font-semibold">
              Find something for your next run
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}
