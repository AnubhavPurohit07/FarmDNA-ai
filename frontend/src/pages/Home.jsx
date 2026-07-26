import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPublicEntries } from "../api/entries";
import { Loader } from "../components/ui";
import Hero from "../components/Hero";
import heroImage from "../assets/images/hero-farm.jpg";

const STATUS_STYLES = {
  success: "bg-green-100 text-green-800",
  partial: "bg-amber-100 text-amber-800",
  failure: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-700",
};

const HOW_IT_WORKS = [
  { step: "01", title: "Record your decision", description: "Log what you planted, which method you used, and why you made that choice — before the season begins." },
  { step: "02", title: "Track the outcome", description: "After harvest, come back and record what actually happened — yield, challenges, success or failure." },
  { step: "03", title: "Discover patterns", description: "AI analyzes your own records to surface what actually worked and what didn't." },
  { step: "04", title: "Share with community", description: "Your experience becomes part of a living knowledge base that helps the next generation of farmers." },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getPublicEntries()
      .then(setAllEntries)
      .catch(() => setAllEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const recentEntries = useMemo(() => allEntries.slice(0, 3), [allEntries]);

  const stats = useMemo(() => {
    const totalDecisions = allEntries.length;
    const regions = new Set(allEntries.map((e) => e.region).filter(Boolean));
    const crops = new Set(allEntries.map((e) => e.crop).filter(Boolean));
    const successCount = allEntries.filter((e) => e.status === "success").length;
    const successRate = totalDecisions > 0
      ? Math.round((successCount / totalDecisions) * 100)
      : 0;

    return [
      { value: loading ? "—" : String(totalDecisions), label: "Decisions recorded" },
      { value: loading ? "—" : String(regions.size), label: "Regions represented" },
      { value: loading ? "—" : String(crops.size), label: "Crop varieties logged" },
      { value: loading ? "—" : `${successRate}%`, label: "Recorded as successful" },
    ];
  }, [allEntries, loading]);

  function toggleExpand(id) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <div className="bg-(--color-canvas)">
      <Hero imageSrc={heroImage} />

      {/* Stats bar — now computed from real public entries, not fabricated */}
      <section className="border-y border-(--color-line) bg-(--color-surface)">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-medium text-(--color-accent)">{stat.value}</p>
              <p className="text-xs sm:text-sm text-(--color-muted) mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">HOW IT WORKS</p>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-medium text-(--color-ink) mb-10 sm:mb-12">
          From a single decision to collective intelligence
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="font-mono text-3xl font-medium text-(--color-accent) opacity-40">{item.step}</span>
              <h3 className="font-display text-lg font-medium text-(--color-ink)">{item.title}</h3>
              <p className="text-sm text-(--color-muted) leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent community entries */}
      <section className="border-t border-(--color-line) bg-(--color-surface) py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-2">RECENT ENTRIES</p>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-medium text-(--color-ink)">
                Decisions from the community
              </h2>
            </div>
            <button onClick={() => navigate("/archive")} className="text-sm font-medium text-(--color-accent) hover:underline text-left">
              Browse all →
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center"><Loader variant="spinner" size="lg" /></div>
          ) : recentEntries.length === 0 ? (
            <div className="py-12 text-center text-(--color-muted)">No community entries yet — be the first to add one.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEntries.map((entry) => {
                const id = entry._id || entry.id;
                const isExpanded = expanded === id;
                return (
                  <article
                    key={id}
                    onClick={() => toggleExpand(id)}
                    style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", gridColumn: isExpanded ? "1 / -1" : "auto" }}
                    className={`bg-(--color-canvas) border border-(--color-line) border-l-[3px] border-l-(--color-accent) rounded-md overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${isExpanded ? "shadow-lg" : ""}`}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-mono text-[10px] tracking-widest text-(--color-muted) uppercase break-words">
                          {entry.region} · {entry.crop} · {entry.season}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[entry.status]}`}>
                          {entry.status}
                        </span>
                      </div>
                      <h3 className={`font-display font-medium text-(--color-ink) leading-snug mb-2 transition-all ${isExpanded ? "text-xl sm:text-2xl" : "text-base"}`}>
                        {entry.title}
                      </h3>
                      <p className="text-sm text-(--color-muted) leading-relaxed">{entry.reason}</p>

                      <div style={{
                        maxHeight: isExpanded ? "400px" : "0px",
                        opacity: isExpanded ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease 0.1s",
                      }}>
                        <div className="mt-4 pt-4 border-t border-(--color-line) space-y-3">
                          <div>
                            <span className="font-mono text-[10px] tracking-widest text-(--color-accent) uppercase block mb-1">Decision</span>
                            <p className="text-sm text-(--color-ink)">{entry.decision}</p>
                          </div>
                          {entry.outcome && (
                            <div>
                              <span className="font-mono text-[10px] tracking-widest text-(--color-accent) uppercase block mb-1">Outcome</span>
                              <p className="text-sm text-(--color-ink)">{entry.outcome}</p>
                            </div>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(user ? "/archive" : "/login"); }}
                            className="mt-2 text-sm font-medium bg-(--color-accent) text-white px-4 py-2 rounded-md hover:bg-(--color-accent-dark) transition-colors"
                          >
                            {user ? "View in Archive →" : "Sign in to record yours →"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-(--color-muted)">
                          Logged {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-(--color-accent) font-medium">
                          {isExpanded ? "Collapse ↑" : "Read entry →"}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why FarmDNA */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">WHY FARMDNA</p>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-medium text-(--color-ink) mb-6 max-w-2xl">
          Years of farming experience shouldn't disappear with a generation
        </h2>
        <p className="text-(--color-muted) max-w-2xl leading-relaxed mb-10 text-sm sm:text-base">
          Every experienced farmer carries knowledge that took decades to earn. Most of that knowledge lives
          only in memory. FarmDNA turns it into a permanent, searchable, learnable record.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "For individual farmers", description: "Keep a personal record of every decision you make, so next season you're not starting from memory alone." },
            { title: "For farming communities", description: "Learn from your neighbor's experience — what worked and why, in your own region and season." },
            { title: "For future generations", description: "Traditional agricultural knowledge that would otherwise be lost between generations is now preserved permanently." },
          ].map((item) => (
            <div key={item.title} className="bg-(--color-surface) border border-(--color-line) border-l-[3px] border-l-(--color-accent) rounded-md p-6">
              <h3 className="font-display text-lg font-medium text-(--color-ink) mb-2">{item.title}</h3>
              <p className="text-sm text-(--color-muted) leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-(--color-line) bg-(--color-surface)">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-medium text-(--color-ink) mb-4">
            Ready to start preserving your farming knowledge?
          </h2>
          <p className="text-(--color-muted) mb-8 max-w-md mx-auto text-sm sm:text-base">
            Join farmers who are already building their decision record for next season.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/register")}
              className="w-full sm:w-auto bg-(--color-accent) text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-(--color-accent-dark) transition-colors"
            >
              {user ? "Go to Dashboard →" : "Create free account →"}
            </button>
            <button
              onClick={() => navigate("/archive")}
              className="w-full sm:w-auto border border-(--color-line) text-(--color-ink) px-6 py-3 rounded-md text-sm font-medium hover:border-(--color-accent) transition-colors"
            >
              Browse the archive
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
