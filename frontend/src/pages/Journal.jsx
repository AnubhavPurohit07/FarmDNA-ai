export default function Journal() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">
        YOUR RECORDS
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-medium text-(--color-ink) tracking-tight">
        Decision Journal
      </h1>
      <p className="mt-4 text-(--color-muted) max-w-xl leading-relaxed">
        This is where you'll record crop choices, irrigation methods,
        fertilizer use, and the reasoning behind each decision — then log
        what actually happened at harvest. The form and entry list will be
        built in a later week; for now, this page is a placeholder.
      </p>
    </section>
  );
}
