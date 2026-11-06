import Link from "next/link";

export const FAQ = [
  {
    q: "How long does delivery take?",
    a: "Orders leave our warehouse within 2 working days and arrive in 2 to 4 days in Europe and North America, 5 to 8 days elsewhere. You get a tracking link by email as soon as it ships.",
  },
  {
    q: "What does shipping cost?",
    a: "Nothing on orders over $100 (or €92). Below that it's a flat $8 to anywhere we deliver.",
  },
  {
    q: "Can I return something?",
    a: "Yes, within 30 days, for any reason, as long as it's unworn with the tags on. Start a return from your account and we'll email a prepaid label. Refunds reach your card within 5 working days of the parcel arriving.",
  },
  {
    q: "What if the size is wrong?",
    a: "Swap it for free. Every product page has a size guide in centimetres and inches, and shoes list US, UK and EU sizes side by side.",
  },
  {
    q: "Which payments do you take?",
    a: "Visa, Mastercard and American Express. Card details go straight to the payment provider; we never see or store them. (This site is a demo: it only accepts the test card 4242 4242 4242 4242.)",
  },
];

/** Questions as an accordion: the heading beside, answers open on demand. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title" className="wrap grid gap-8 pt-[var(--gap-section)] pb-[var(--gap-section)] lg:grid-cols-[4fr_8fr] lg:gap-16">
      <h2 id="faq-title" className="head" data-reveal>
        Before you order
      </h2>
      <div>
        <div className="border-t border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lead font-extrabold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-[1.5rem] leading-none font-normal transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-[62ch] pb-6 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="pt-8">
          More on delivery, returns and care on the{" "}
          <Link href="/about/" className="link font-semibold">
            delivery and returns page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
