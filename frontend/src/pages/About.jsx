import { Link } from "react-router-dom";

const FEATURES = [
  {
    tag: "RECORD",
    title: "Decision Journal",
    description:
      "Log every farming decision — what crop you chose, which irrigation method you used, what fertilizer you applied, and most importantly, why. Every entry becomes part of a permanent, searchable record.",
  },
  {
    tag: "TRACK",
    title: "Outcome Tracking",
    description:
      "After harvest, come back and record what actually happened. Yield data, pest problems, weather impact, success or failure — the full picture of what your decision led to.",
  },
  {
    tag: "DISCOVER",
    title: "AI Pattern Discovery",
    description:
      "FarmDNA's AI engine analyzes thousands of recorded decisions to surface hidden patterns — which practices work best in which regions, which combinations lead to failure, and what the data says you should try next.",
  },
  {
    tag: "LEARN",
    title: "Community Knowledge",
    description:
      "Search decisions made by farmers across different regions, seasons, and crops. Learn from someone else's mistake before you make it yourself. Share your own experience for others to learn from.",
  },
];

const TECH = [
  { name: "React 19", desc: "Frontend framework" },
  { name: "FastAPI", desc: "Python backend" },
  { name: "MongoDB Atlas", desc: "Cloud database" },
  { name: "Gemini API", desc: "AI pattern discovery" },
  { name: "Vercel", desc: "Frontend hosting" },
  { name: "Render", desc: "Backend hosting" },
];

export default function About() {
  return (
    <div className="bg-(--color-canvas) dark:bg-zinc-950">

      {/* Hero section */}
      <section className="border-b border-(--color-line) dark:border-zinc-800 bg-(--color-surface) dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-4">
            WHY FARMDNA EXISTS
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-(--color-ink) dark:text-zinc-100 tracking-tight leading-tight">
            Farming knowledge shouldn't be lost between generations.
          </h1>
          <p className="mt-6 text-lg text-(--color-muted) dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Every experienced farmer carries years of hard-won knowledge — what works in their soil, which crops survive their local weather, which decisions they'd never repeat. Most of that knowledge lives only in memory, and disappears when it's no longer passed down.
          </p>
          <p className="mt-4 text-lg text-(--color-muted) dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            FarmDNA is built to change that. By turning individual farming decisions into a shared, searchable record, we preserve agricultural wisdom and make it accessible to every farmer who comes after.
          </p>
        </div>
      </section>

      {/* Features section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">
          WHAT WE BUILD
        </p>
        <h2 className="font-display text-2xl font-medium text-(--color-ink) dark:text-zinc-100 mb-10">
          Core features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.tag}
              className="bg-(--color-surface) dark:bg-zinc-900 border border-(--color-line) dark:border-zinc-700 border-l-[3px] border-l-(--color-accent) rounded-md p-6"
            >
              <span className="font-mono text-[10px] tracking-widest text-(--color-accent) uppercase mb-2 block">
                {f.tag}
              </span>
              <h3 className="font-display text-lg font-medium text-(--color-ink) dark:text-zinc-100 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-(--color-muted) dark:text-zinc-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission section */}
      <section className="border-t border-(--color-line) dark:border-zinc-800 bg-(--color-surface) dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">
            OUR MISSION
          </p>
          <h2 className="font-display text-2xl font-medium text-(--color-ink) dark:text-zinc-100 mb-6">
            Transforming experience into intelligence
          </h2>
          <div className="space-y-4 text-(--color-muted) dark:text-zinc-400 leading-relaxed">
            <p>
              A single farmer's record of one decision isn't very powerful on its own. But ten thousand farmers recording ten thousand decisions — across different crops, regions, seasons, and conditions — creates something genuinely valuable: a dataset that AI can learn from to surface patterns no individual farmer could see on their own.
            </p>
            <p>
              That's the long-term vision of FarmDNA. Not just a journal, but a living intelligence layer built on top of real agricultural experience — one that gets smarter with every entry, and gives back more value than it takes.
            </p>
            <p>
              We believe traditional agricultural knowledge and modern AI can work together. The goal isn't to replace the farmer's judgment — it's to make sure that judgment is never lost.
            </p>
          </div>
        </div>
      </section>

      {/* Tech stack section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">
          BUILT WITH
        </p>
        <h2 className="font-display text-2xl font-medium text-(--color-ink) dark:text-zinc-100 mb-8">
          Technology stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {TECH.map((t) => (
            <div
              key={t.name}
              className="bg-(--color-surface) dark:bg-zinc-900 border border-(--color-line) dark:border-zinc-700 rounded-md px-4 py-3 flex items-center gap-3"
            >
              <div>
                <p className="text-sm font-medium text-(--color-ink) dark:text-zinc-100">
                  {t.name}
                </p>
                <p className="text-xs text-(--color-muted) dark:text-zinc-400">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="border-t border-(--color-line) dark:border-zinc-800 bg-(--color-surface) dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="font-display text-2xl font-medium text-(--color-ink) dark:text-zinc-100 mb-4">
            Ready to start recording?
          </h2>
          <p className="text-(--color-muted) dark:text-zinc-400 mb-8 max-w-md mx-auto">
            Join farmers who are already preserving their agricultural knowledge for the next generation.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-(--color-accent) text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-(--color-accent-dark) transition-colors"
            >
              Create free account
            </Link>
            <Link
              to="/archive"
              className="border border-(--color-line) dark:border-zinc-700 text-(--color-ink) dark:text-zinc-100 px-6 py-3 rounded-md text-sm font-medium hover:border-(--color-accent) transition-colors"
            >
              Browse the archive
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
