import { useEffect, useState } from "react";
import { getPublicEntries, searchPublicEntries, getEntries, searchEntries } from "../api/entries";
import { Input, Loader, showToast } from "../components/ui";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLES = {
  success: "bg-green-100 text-green-800",
  partial: "bg-amber-100 text-amber-800",
  failure: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-700",
};

export default function Archive() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [expanded, setExpanded] = useState(null);

  async function loadAll() {
    setLoading(true);
    try {
      const data = user ? await getEntries() : await getPublicEntries();
      setEntries(data);
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, [user]);

  useEffect(() => {
    if (!query.trim()) { loadAll(); return; }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = user
          ? await searchEntries(query.trim())
          : await searchPublicEntries(query.trim());
        setEntries(results);
      } catch (err) {
        showToast.error(err.message);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, user]);

  function toggleExpand(id) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">
        {user ? "YOUR KNOWLEDGE" : "COMMUNITY KNOWLEDGE"}
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-medium text-(--color-ink) tracking-tight">
        Knowledge Archive
      </h1>
      <p className="mt-4 text-(--color-muted) max-w-xl leading-relaxed">
        {user
          ? "Search your recorded decisions and outcomes."
          : "Search decisions and outcomes from farmers across regions and seasons. Sign in to record your own."}
      </p>

      <div className="mt-8 max-w-md">
        <Input
          placeholder="Search by crop, region, season, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {(loading || searching) && (
        <div className="py-12 flex flex-col items-center gap-3">
          <Loader variant="spinner" size="lg" />
          <p className="text-sm text-(--color-muted)">{searching ? "Searching..." : "Loading..."}</p>
        </div>
      )}

      {!loading && !searching && entries.length === 0 && (
        <div className="py-12 text-center text-(--color-muted)">
          {query ? `No entries match "${query}".` : "No entries yet."}
        </div>
      )}

      {!loading && !searching && entries.length > 0 && (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => {
            const id = entry._id || entry.id;
            const isExpanded = expanded === id;
            return (
              <article
                key={id}
                onClick={() => toggleExpand(id)}
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  gridColumn: isExpanded ? "1 / -1" : "auto",
                }}
                className={`
                  bg-(--color-surface) border border-(--color-line) border-l-[3px] border-l-(--color-accent)
                  rounded-md p-5 flex flex-col cursor-pointer
                  hover:shadow-md hover:-translate-y-0.5
                  ${isExpanded ? "shadow-lg" : ""}
                `}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] tracking-widest text-(--color-muted) uppercase">
                    {entry.region} · {entry.crop}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[entry.status]}`}>
                    {entry.status}
                  </span>
                </div>

                <h3 className={`font-display font-medium text-(--color-ink) leading-snug transition-all duration-300 ${isExpanded ? "text-2xl mb-4" : "text-base"}`}>
                  {entry.title}
                </h3>

                <p className="text-sm text-(--color-muted) leading-relaxed flex-1">
                  {entry.reason}
                </p>

                {/* Expanded content */}
                <div
                  style={{
                    maxHeight: isExpanded ? "500px" : "0px",
                    opacity: isExpanded ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                  }}
                >
                  <div className="mt-4 pt-4 border-t border-(--color-line) space-y-3">
                    <div>
                      <span className="font-mono text-[10px] tracking-widest text-(--color-accent) uppercase">Decision</span>
                      <p className="text-sm text-(--color-ink) mt-1">{entry.decision}</p>
                    </div>
                    {entry.outcome && (
                      <div>
                        <span className="font-mono text-[10px] tracking-widest text-(--color-accent) uppercase">Outcome</span>
                        <p className="text-sm text-(--color-ink) mt-1">{entry.outcome}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-(--color-muted)">{entry.season}</span>
                  <span className="text-xs text-(--color-accent) font-medium">
                    {isExpanded ? "Collapse ↑" : "Read entry →"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
