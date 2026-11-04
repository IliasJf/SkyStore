import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BASE, imgSrc } from "@/lib/asset";
import { PRODUCTS, bySlug, inStock } from "@/lib/catalog";
import { ProductView } from "./ProductView";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const p = bySlug((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.blurb} $${p.price}. Free shipping over $100, 30-day returns.`,
    openGraph: { title: `${p.name} · SkyStore`, description: p.blurb, images: [{ url: imgSrc(p.colours[0].image, 1024), width: 1024, height: 1280 }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  // Product data for search engines.
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.blurb,
    image: p.colours.map((c) => `https://iliasjf.github.io${imgSrc(c.image, 1024)}`),
    brand: { "@type": "Brand", name: "SkyStore" },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      availability: inStock(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://iliasjf.github.io${BASE}/product/${p.slug}/`,
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ProductView slug={p.slug} />
    </>
  );
}
