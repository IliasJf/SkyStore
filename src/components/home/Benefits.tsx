const ITEMS = [
  {
    title: "Free shipping over $100",
    text: "Otherwise $8. Leaves within 2 working days.",
    icon: <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01" />,
  },
  {
    title: "30-day returns",
    text: "Any reason, unworn with tags. Prepaid label.",
    icon: <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4" />,
  },
  {
    title: "Free size swaps",
    text: "We send the new size as soon as yours is scanned.",
    icon: <path d="M7 7h12l-3-3M17 17H5l3 3" />,
  },
  {
    title: "Secure checkout",
    text: "Card details go straight to the payment provider.",
    icon: <path d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z" />,
  },
];

/** The terms, in one strip: what every order comes with. */
export function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="wrap pt-[var(--gap-section)]">
      <h2 id="benefits-title" className="sr-only">
        What every order comes with
      </h2>
      <ul className="grid gap-px overflow-hidden rounded-[var(--radius)] bg-line sm:grid-cols-2 lg:grid-cols-4" data-reveal>
        {ITEMS.map((b) => (
          <li key={b.title} className="flex gap-4 bg-surface p-6">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
              {b.icon}
            </svg>
            <span>
              <span className="block font-extrabold">{b.title}</span>
              <span className="mt-1 block text-small text-muted">{b.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
