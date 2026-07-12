import { useEffect, useState } from "react";
import { getEntries, searchEntries } from "../api/entries";
import { Input, Loader, showToast } from "../components/ui";

const STATUS_STYLES = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  partial: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  failure: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export default function Archive() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (err) {
      setError(err.message);
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      loadAll();
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchEntries(query.trim());
        setEntries(results);
        setError(null);
      } catch (err) {
        setError(err.message);
        showToast.error(err.message);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">
        SEARCHABLE RECORD
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-medium text-(--color-ink) dark:text-zinc-100 tracking-tight">
        Knowledge Archive
      </h1>
      <p className="mt-4 text-(--color-muted) max-w-xl leading-relaxed">
        Search decisions and outcomes recorded by farmers facing similar crops, regions, or seasons.
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
          <p className="text-sm text-(--color-muted)">{searching ? "Searching..." : "Loading archive..."}</p>
        </div>
      )}

      {!loading && !searching && error && entries.length === 0 && (
        <div className="py-12 text-center text-sm text-red-500">
          Couldn't load the archive: {error}
        </div>
      )}

      {!loading && !searching && !error && entries.length === 0 && (
        <div className="py-12 text-center text-(--color-muted)">
          No entries match "{query}". Try a different keyword.
        </div>
      )}

      {!loading && !searching && entries.length > 0 && (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <article
              key={entry._id || entry.id}
              className="bg-white dark:bg-zinc-900 border border-(--color-line) dark:border-zinc-700 border-l-[3px] border-l-(--color-accent) rounded-md p-5 flex flex-col transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] tracking-widest text-(--color-muted) uppercase">
                  {entry.region} · {entry.crop}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[entry.status]}`}>
                  {entry.status}
                </span>
              </div>
              <h3 className="font-display text-base font-medium text-(--color-ink) dark:text-zinc-100 leading-snug">
                {entry.title}
              </h3>
              <p className="mt-2 text-sm text-(--color-muted) dark:text-zinc-400 leading-relaxed flex-1">
                {entry.reason}
              </p>
              <span className="mt-3 font-mono text-[10px] text-(--color-muted)">
                {entry.season}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
