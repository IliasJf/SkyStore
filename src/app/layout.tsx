import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { BASE } from "@/lib/asset";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
});

const SITE = "https://iliasjf.github.io/SkyStore";

export const metadata: Metadata = {
  metadataBase: new URL("https://iliasjf.github.io"),
  title: { default: "SkyStore: running and training kit for every sky", template: "%s · SkyStore" },
  description: "Running tees, shells, joggers, shoes and watches, picked for the weather outside. Free shipping over $100 and 30-day returns.",
  icons: { icon: `${BASE}/favicon.svg` },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "SkyStore",
    title: "SkyStore: running and training kit for every sky",
    description: "Kit picked for the weather outside, from dawn to night.",
    images: [{ url: `${BASE}/og.jpg`, width: 1200, height: 630, alt: "SkyStore: a runner on a rooftop at dawn" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#dfe6ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={schibsted.variable}>
      <body className="flex min-h-svh flex-col">
        <Header />
        <main id="main" className="grow">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <Motion />
      </body>
    </html>
  );
}
