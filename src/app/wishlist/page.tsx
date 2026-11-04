import type { Metadata } from "next";
import { WishlistView } from "./WishlistView";

export const metadata: Metadata = { title: "Saved items", robots: { index: false } };

export default function Page() {
  return <WishlistView />;
}
