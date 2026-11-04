export type Currency = "USD" | "EUR";

/** Fixed demo rate. A live shop would price each currency on purpose. */
const RATE: Record<Currency, number> = { USD: 1, EUR: 0.92 };

export function money(usd: number, currency: Currency) {
  const value = usd * RATE[currency];
  return new Intl.NumberFormat(currency === "EUR" ? "en-IE" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(Math.round(value * 100) / 100) ? 0 : 2,
  }).format(Math.round(value * 100) / 100);
}
