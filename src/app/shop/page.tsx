import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "./ShopView";

export const metadata: Metadata = {
  title: "Shop",
  description: "Running and training kit: tees, shells, joggers, shoes and watches. Filter by kind, size, colour and price.",
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopView />
    </Suspense>
  );
}
