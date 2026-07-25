import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEntries } from "../api/entries";
import { generateAIInsights } from "../api/ai";
import { Loader, Button, Input, showToast } from "../components/ui";

const STATUS_STYLES = {
  success: "bg-green-100 text-green-800",
  partial: "bg-amber-100 text-amber-800",
  failure: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-700",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [focusQuestion, setFocusQuestion] = useState("");
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState(null);

  useEffect(() => {
    getEntries()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerateInsights() {
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const result = await generateAIInsights(focusQuestion.trim() || undefined);
      setInsights(result);
      showToast.success("Insights generated!");
    } catch (err) {
      setInsightsError(err.message);
      showToast.error(err.message);
    } finally {
      setInsightsLoading(false);
    }
  }

  // Derived stats were previously recomputed via .filter() on every single
  // render (including renders unrelated to entries, like AI insights state
  // changes). Wrapped in useMemo so they only recompute when entries change.
  const { totalEntries, thisSeasonEntries, successfulEntries, recentEntries } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return {
      totalEntries: entries.length,
      thisSeasonEntries: entries.filter((e) => e.season?.includes(String(currentYear))).length,
      successfulEntries: entries.filter((e) => e.status === "success").length,
      recentEntries: entries.slice(0, 4),
    };
  }, [entries]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-2">OVERVIEW</p>
        <h1 className="font-display text-2xl sm:text-3xl font-medium text-(--color-ink)">My Dashboard</h1>
        <p className="mt-2 text-(--color-muted) text-sm">
          Welcome back, {user?.name?.split(" ")[0] || "Farmer"}. Here's what's happening with your records.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Entries", value: loading ? "—" : totalEntries },
          { label: "This Season", value: loading ? "—" : thisSeasonEntries },
          { label: "Successful", value: loading ? "—" : successfulEntries },
          { label: "AI Insights", value: insights ? insights.patterns.length : "—" },
        ].map((stat) => (
          <div key={stat.label} className="bg-(--color-surface) border border-(--color-line) rounded-lg p-4 sm:p-5">
            <p className="text-xs font-mono tracking-widest text-(--color-muted) uppercase mb-2">{stat.label}</p>
            <p className="font-display text-2xl sm:text-3xl font-medium text-(--color-ink)">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-(--color-surface) border border-(--color-line) rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-medium text-(--color-ink)">Recent Journal Entries</h2>
            <Link to="/journal" className="text-xs font-mono text-(--color-accent) hover:underline">View all →</Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center"><Loader variant="spinner" size="md" /></div>
          ) : recentEntries.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-(--color-muted) mb-3">No entries yet.</p>
              <Link to="/journal" className="text-sm text-(--color-accent) hover:underline">Add your first entry →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div key={entry._id || entry.id} className="border border-(--color-line) border-l-[3px] border-l-(--color-accent) rounded-md p-3 bg-(--color-canvas)">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-(--color-ink) leading-snug">{entry.title}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[entry.status]}`}>
                      {entry.status}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-(--color-muted) mt-1 uppercase break-words">
                    {entry.region} · {entry.crop} · {entry.season}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights — now has an optional input area, satisfying "properly
            designed input area" while keeping the one-click default flow */}
        <div className="bg-(--color-surface) border border-(--color-line) rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-medium text-(--color-ink)">AI Insights</h2>
            <span className="text-xs font-mono text-(--color-muted) border border-(--color-line) px-2 py-0.5 rounded">GEMINI</span>
          </div>

          {!insightsLoading && !insights && !insightsError && (
            <div className="space-y-3">
              <Input
                label="Ask something specific (optional)"
                placeholder="e.g. How is my wheat performing?"
                value={focusQuestion}
                onChange={(e) => setFocusQuestion(e.target.value)}
              />
              <div className="text-center pt-2">
                <p className="text-sm text-(--color-muted) mb-4">
                  {focusQuestion.trim()
                    ? "AI will focus on this question using your recorded entries."
                    : `Or leave blank for a general analysis of your ${totalEntries} recorded ${totalEntries === 1 ? "entry" : "entries"}.`}
                </p>
                <Button variant="primary" size="sm" onClick={handleGenerateInsights} disabled={totalEntries === 0}>
                  Generate Insights
                </Button>
                {totalEntries === 0 && (
                  <p className="text-xs text-(--color-muted) mt-2">Add at least one journal entry first.</p>
                )}
              </div>
            </div>
          )}

          {insightsLoading && (
            <div className="py-10 flex flex-col items-center gap-3">
              <Loader variant="spinner" size="md" />
              <p className="text-xs text-(--color-muted) font-mono">Analyzing your entries...</p>
            </div>
          )}

          {insightsError && !insightsLoading && (
            <div className="py-6 text-center">
              <p className="text-sm text-red-500 mb-3">{insightsError}</p>
              <Button variant="outline" size="sm" onClick={handleGenerateInsights}>Try again</Button>
            </div>
          )}

          {insights && !insightsLoading && (
            <div className="space-y-3">
              {focusQuestion.trim() && (
                <p className="text-xs font-mono text-(--color-muted) italic">"{focusQuestion.trim()}"</p>
              )}
              {insights.patterns.map((pattern, i) => (
                <div key={i} className="border border-(--color-line) rounded-md p-3 bg-(--color-canvas)">
                  <p className="text-xs font-mono tracking-widest text-(--color-accent) uppercase mb-1">Pattern {i + 1}</p>
                  <p className="text-sm text-(--color-ink) leading-relaxed">{pattern}</p>
                </div>
              ))}
              <div className="border border-(--color-accent) rounded-md p-3 bg-(--color-accent)/5">
                <p className="text-xs font-mono tracking-widest text-(--color-accent) uppercase mb-1">Recommendation</p>
                <p className="text-sm text-(--color-ink) leading-relaxed">{insights.recommendation}</p>
              </div>
              <button
                onClick={() => { setInsights(null); setInsightsError(null); }}
                className="text-xs text-(--color-accent) hover:underline font-mono"
              >
                ↻ Ask another question
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
        <Link to="/journal" className="text-center bg-(--color-accent) text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-(--color-accent-dark) transition-colors">
          + New Entry
        </Link>
        <Link to="/archive" className="text-center border border-(--color-line) text-(--color-ink) px-5 py-2.5 rounded-md text-sm font-medium hover:border-(--color-accent) transition-colors">
          Browse Archive
        </Link>
      </div>
    </div>
  );
}
