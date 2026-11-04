"use client";

import { money } from "@/lib/money";
import { useShop } from "@/lib/store";

/** A price in the shopper's chosen currency. */
export function Price({ usd, className }: { usd: number; className?: string }) {
  const { currency } = useShop();
  return <span className={`tabular-nums ${className ?? ""}`}>{money(usd, currency)}</span>;
}
