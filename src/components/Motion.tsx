"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Entrances: each [data-reveal] block's children rise in turn the first time it
 * scrolls into view. Without script nothing is hidden (the .js class gates it).
 */
export function Motion() {
  const path = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    // Lists that render after data arrives (the shop, the outfit) get picked up too.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [path]);
  return null;
}
