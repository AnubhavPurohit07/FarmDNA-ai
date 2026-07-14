import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEntries } from "../api/entries";
import { Loader } from "../components/ui";

const STATUS_STYLES = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  partial: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  failure: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const AI_INSIGHTS = [
  {
    title: "Drip irrigation shows better outcomes",
    description: "Entries using drip irrigation report 30% better yield outcomes compared to flood irrigation across multiple regions.",
  },
  {
    title: "Delayed sowing reduces seedling loss",
    description: "Farmers who delayed sowing by 1–2 weeks after early monsoon signals reported significantly lower seedling loss.",
  },
  {
    title: "Pest pressure after new fertilizers",
    description: "Several entries report increased pest activity after switching to compound fertilizers. Monitor closely if trying new mixes.",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEntries()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const totalEntries = entries.length;
  const currentYear = new Date().getFullYear();
  const thisSeasonEntries = entries.filter((e) =>
    e.season?.includes(String(currentYear))
  ).length;
  const successfulEntries = entries.filter((e) => e.status === "success").length;
  const recentEntries = entries.slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-2">OVERVIEW</p>
        <h1 className="font-display text-3xl font-medium text-(--color-ink)">
          My Dashboard
        </h1>
        <p className="mt-2 text-(--color-muted) text-sm">
          Welcome back, {user?.name?.split(" ")[0] || "Farmer"}. Here's what's happening with your records.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Entries", value: loading ? "—" : totalEntries },
          { label: "This Season", value: loading ? "—" : thisSeasonEntries },
          { label: "Successful", value: loading ? "—" : successfulEntries },
          { label: "AI Insights", value: AI_INSIGHTS.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-(--color-surface) border border-(--color-line) rounded-lg p-5">
            <p className="text-xs font-mono tracking-widest text-(--color-muted) uppercase mb-2">{stat.label}</p>
            <p className="font-display text-3xl font-medium text-(--color-ink)">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Two column */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent entries */}
        <div className="bg-(--color-surface) border border-(--color-line) rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-medium text-(--color-ink)">Recent Journal Entries</h2>
            <Link to="/journal" className="text-xs font-mono text-(--color-accent) hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center"><Loader variant="spinner" size="md" /></div>
          ) : recentEntries.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-(--color-muted) mb-3">No entries yet.</p>
              <Link to="/journal" className="text-sm text-(--color-accent) hover:underline">
                Add your first entry →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry._id || entry.id}
                  className="border border-(--color-line) border-l-[3px] border-l-(--color-accent) rounded-md p-3 bg-(--color-canvas)"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-(--color-ink) leading-snug">{entry.title}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[entry.status]}`}>
                      {entry.status}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-(--color-muted) mt-1 uppercase">
                    {entry.region} · {entry.crop} · {entry.season}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-(--color-surface) border border-(--color-line) rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-medium text-(--color-ink)">AI Insights</h2>
            <span className="text-xs font-mono text-(--color-muted) border border-(--color-line) px-2 py-0.5 rounded">GEMINI</span>
          </div>
          <div className="space-y-3">
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} className="border border-(--color-line) rounded-md p-3 bg-(--color-canvas)">
                <p className="text-sm font-medium text-(--color-ink) mb-1">{insight.title}</p>
                <p className="text-xs text-(--color-muted) leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-(--color-muted) mt-4 font-mono">
            Full AI analysis powered by Gemini — coming soon.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/journal" className="bg-(--color-accent) text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-(--color-accent-dark) transition-colors">
          + New Entry
        </Link>
        <Link to="/archive" className="border border-(--color-line) text-(--color-ink) px-5 py-2.5 rounded-md text-sm font-medium hover:border-(--color-accent) transition-colors">
          Browse Archive
        </Link>
      </div>
    </div>
  );
}
