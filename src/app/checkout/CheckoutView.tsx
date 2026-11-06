"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Picture } from "@/components/Picture";
import { bySlug } from "@/lib/catalog";
import { money } from "@/lib/money";
import { placeOrder, totals, useShop } from "@/lib/store";

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Ireland", "France", "Germany", "Spain", "Portugal", "Netherlands", "Italy", "Morocco", "Australia"];
/** Stripe's public test card: the only number this demo accepts. */
const TEST_CARD = "4242424242424242";

type Field = "email" | "name" | "address" | "city" | "postcode" | "country" | "card" | "expiry" | "cvc";
const LABELS: Record<Field, string> = {
  email: "Email",
  name: "Full name",
  address: "Street address",
  city: "City",
  postcode: "Postcode",
  country: "Country",
  card: "Card number",
  expiry: "Expiry (MM/YY)",
  cvc: "Security code",
};

function check(v: Record<Field, string>): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter an email like name@example.com, for the receipt.";
  if (v.name.trim().length < 2) e.name = "Enter the name for the delivery.";
  if (v.address.trim().length < 4) e.address = "Enter the street and number.";
  if (v.city.trim().length < 2) e.city = "Enter the city.";
  if (v.postcode.trim().length < 3) e.postcode = "Enter the postcode.";
  if (!v.country) e.country = "Choose a country.";
  const digits = v.card.replace(/\D/g, "");
  if (digits !== TEST_CARD) e.card = "This demo takes only the test card 4242 4242 4242 4242. No real card is ever charged.";
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.expiry.trim());
  const now = new Date();
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.expiry = "Enter the expiry as MM/YY, like 08/29.";
  else if (new Date(2000 + Number(m[2]), Number(m[1])) <= now) e.expiry = "That card has expired. Use a future date.";
  if (!/^\d{3,4}$/.test(v.cvc.trim())) e.cvc = "Enter the 3 digits on the back.";
  return e;
}

export function CheckoutView() {
  const shop = useShop();
  const t = totals(shop);
  const router = useRouter();
  const summary = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<Field, string>>({
    email: shop.account?.email ?? "",
    name: shop.account?.name ?? "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    card: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [busy, setBusy] = useState(false);

  const field = (k: Field, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="field">
      <label htmlFor={k}>{LABELS[k]}</label>
      <input
        id={k}
        name={k}
        className="input"
        value={values[k]}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `${k}-error` : undefined}
        onChange={(e) => {
          let v = e.target.value;
          if (k === "card") v = v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
          if (k === "expiry") v = v.replace(/[^\d]/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
          setValues({ ...values, [k]: v });
          if (errors[k]) setErrors({ ...errors, [k]: undefined });
        }}
        {...props}
      />
      {errors[k] && (
        <p id={`${k}-error`} className="error">
          {errors[k]}
        </p>
      )}
    </div>
  );

  if (!shop.cart.length && !busy)
    return (
      <div className="wrap pt-12 pb-[var(--gap-section)] md:pt-16">
        <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Checkout</h1>
        <div className="mt-12 bg-surface p-10">
          <p className="text-lead font-semibold">There&rsquo;s nothing to check out yet.</p>
          <Link href="/shop/" className="btn btn--ink mt-6">
            Browse the shop
          </Link>
        </div>
      </div>
    );

  const errorList = Object.entries(errors).filter(([, v]) => v) as [Field, string][];

  return (
    <div className="wrap pt-12 pb-[var(--gap-section)] md:pt-16">
      <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Checkout</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-[7fr_4fr]">
        <form
          noValidate
          className="grid gap-10"
          onSubmit={async (e) => {
            e.preventDefault();
            const found = check(values);
            setErrors(found);
            if (Object.keys(found).length) {
              requestAnimationFrame(() => summary.current?.focus());
              return;
            }
            setBusy(true);
            // A pause like a real payment provider's, so the button's state is seen.
            await new Promise((r) => setTimeout(r, 1100));
            const order = placeOrder({ email: values.email, name: values.name, address: values.address, city: values.city, country: values.country, last4: values.card.slice(-4) });
            router.push(`/order/?id=${order.id}`);
            // The receipt starts at its heading, wherever the form was scrolled to.
            window.scrollTo({ top: 0 });
          }}
        >
          {errorList.length > 0 && (
            <div ref={summary} tabIndex={-1} role="alert" className="bg-[#f6d6d2] p-5">
              <p className="font-semibold">
                {errorList.length === 1 ? "One thing needs fixing" : `${errorList.length} things need fixing`} before you can pay:
              </p>
              <ul className="mt-2 grid gap-1">
                {errorList.map(([k, msg]) => (
                  <li key={k}>
                    <a href={`#${k}`} className="link">
                      {LABELS[k]}
                    </a>
                    : {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <fieldset className="grid gap-5">
            <legend className="mb-2 text-lead font-extrabold tracking-[-0.03em]">Contact</legend>
            {field("email", { type: "email", autoComplete: "email", inputMode: "email" })}
          </fieldset>

          <fieldset className="grid gap-5">
            <legend className="mb-2 text-lead font-extrabold tracking-[-0.03em]">Delivery</legend>
            {field("name", { autoComplete: "name" })}
            {field("address", { autoComplete: "street-address" })}
            <div className="grid gap-5 sm:grid-cols-2">
              {field("city", { autoComplete: "address-level2" })}
              {field("postcode", { autoComplete: "postal-code" })}
            </div>
            <div className="field">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                className="input"
                value={values.country}
                autoComplete="country-name"
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? "country-error" : undefined}
                onChange={(e) => {
                  setValues({ ...values, country: e.target.value });
                  setErrors({ ...errors, country: undefined });
                }}
              >
                <option value="">Choose…</option>
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {errors.country && (
                <p id="country-error" className="error">
                  {errors.country}
                </p>
              )}
            </div>
          </fieldset>

          <fieldset className="grid gap-5">
            <legend className="mb-2 text-lead font-extrabold tracking-[-0.03em]">Payment</legend>
            <p className="bg-dawn p-4 text-small">
              <strong>This is a demo shop.</strong> Pay with the test card <span className="font-semibold tabular-nums">4242 4242 4242 4242</span>, any future date and any 3 digits. Nothing is charged and no card details are stored.
            </p>
            {field("card", { inputMode: "numeric", autoComplete: "off", placeholder: "4242 4242 4242 4242" })}
            <div className="grid gap-5 sm:grid-cols-2">
              {field("expiry", { inputMode: "numeric", autoComplete: "off", placeholder: "MM/YY" })}
              {field("cvc", { inputMode: "numeric", autoComplete: "off", maxLength: 4 })}
            </div>
          </fieldset>

          <button type="submit" className="btn w-full text-lead" disabled={busy} aria-busy={busy}>
            {busy ? "Processing payment…" : `Pay ${money(t.total, shop.currency)}`}
          </button>
        </form>

        <aside aria-labelledby="order-summary" className="self-start bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <h2 id="order-summary" className="text-lead font-extrabold tracking-[-0.03em]">
            Your order
          </h2>
          <ul className="mt-4 grid gap-4">
            {shop.cart.map((l) => {
              const p = bySlug(l.slug)!;
              return (
                <li key={`${l.slug}-${l.colour}-${l.size}`} className="flex gap-3">
                  <Picture name={p.colours.find((c) => c.name === l.colour)?.image ?? p.colours[0].image} alt="" sizes="56px" className="h-[70px] w-14 object-cover" width={56} height={70} />
                  <span className="grow">
                    <span className="block font-semibold">{p.name}</span>
                    <span className="block text-small text-muted">
                      {l.colour} · {l.size} · ×{l.qty}
                    </span>
                  </span>
                  <span className="tabular-nums">{money(p.price * l.qty, shop.currency)}</span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-6 grid grid-cols-[1fr_auto] gap-y-2">
            <dt>Subtotal</dt>
            <dd className="text-right tabular-nums">{money(t.subtotal, shop.currency)}</dd>
            {t.discount > 0 && (
              <>
                <dt>Discount</dt>
                <dd className="text-right tabular-nums">−{money(t.discount, shop.currency)}</dd>
              </>
            )}
            <dt>Shipping</dt>
            <dd className="text-right tabular-nums">{t.shipping ? money(t.shipping, shop.currency) : "Free"}</dd>
            <dt className="pt-3 text-lead font-extrabold">Total</dt>
            <dd className="pt-3 text-right text-lead font-extrabold tabular-nums">{money(t.total, shop.currency)}</dd>
          </dl>
        </aside>
      </div>
    </div>
  );
}
