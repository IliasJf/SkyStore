import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Your bag", robots: { index: false } };

export default function Page() {
  return <CartView />;
}
