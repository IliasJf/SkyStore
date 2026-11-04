import Link from "next/link";
import { Picture } from "@/components/Picture";

export default function NotFound() {
  return (
    <div className="grid min-h-[calc(100svh-var(--header-h))] bg-night text-night-ink md:grid-cols-2">
      <div className="wrap flex flex-col justify-center py-16">
        <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">Off the map</h1>
        <p className="mt-6 max-w-[36ch] text-lead leading-snug">This page doesn&rsquo;t exist, or it moved. The shop is still where you left it.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop/" className="btn">
            Go to the shop
          </Link>
          <Link href="/" className="btn btn--plain">
            Home
          </Link>
        </div>
      </div>
      <Picture name="sky-night" alt="A runner at night under a dark sky, city lights far behind" sizes="(min-width: 768px) 50vw, 100vw" width={1024} height={1536} className="h-[50svh] w-full object-cover md:h-full" />
    </div>
  );
}
