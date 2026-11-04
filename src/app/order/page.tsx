import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderView } from "./OrderView";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default function OrderPage() {
  return (
    <Suspense>
      <OrderView />
    </Suspense>
  );
}
