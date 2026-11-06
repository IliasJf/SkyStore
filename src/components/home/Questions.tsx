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

/** One band per question, all answers open. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <div data-reveal className="flex min-h-[30svh] items-end bg-accent px-[var(--margin)] pb-8 md:min-h-[40svh] md:pb-12">
        <h2 id="faq-title" className="display text-[13vw] text-white md:text-[7vw]">
          Before you order
        </h2>
      </div>
      {FAQ.map((f, i) => (
        <div key={f.q} className={i % 2 ? "bg-surface" : "bg-bg"}>
          <div className="wrap grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-14" data-reveal>
            <h3 className="text-lead leading-tight font-extrabold tracking-[-0.03em] md:col-span-5">{f.q}</h3>
            <p className="max-w-[60ch] leading-relaxed md:col-span-6 md:col-start-7">{f.a}</p>
          </div>
        </div>
      ))}
      <div className="bg-bg">
        <p className="wrap py-10 md:py-14">
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
