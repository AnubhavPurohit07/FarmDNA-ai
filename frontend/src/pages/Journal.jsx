import { useEffect, useState } from "react";
import { getEntries, createEntry, deleteEntry } from "../api/entries";
import { Button, Input, Modal, Loader, showToast } from "../components/ui";

const STATUS_STYLES = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  partial: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  failure: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const EMPTY_FORM = {
  title: "",
  crop: "",
  region: "",
  season: "",
  decision: "",
  reason: "",
};

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadEntries() {
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
    loadEntries();
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate() {
    if (!form.title || !form.crop || !form.region || !form.season || !form.decision || !form.reason) {
      showToast.error("Please fill in all fields before saving.");
      return;
    }
    setSubmitting(true);
    try {
      const newEntry = await createEntry(form);
      setEntries((prev) => [newEntry, ...prev]);
      showToast.success("Entry saved successfully!");
      setForm(EMPTY_FORM);
      setModalOpen(false);
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      showToast.success("Entry deleted.");
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">
            YOUR RECORDS
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-medium text-(--color-ink) tracking-tight">
            Decision Journal
          </h1>
          <p className="mt-3 text-(--color-muted) max-w-xl leading-relaxed">
            Record crop choices, irrigation methods, and the reasoning behind
            each decision — then log what happened at harvest.
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + New Entry
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 flex flex-col items-center gap-3">
          <Loader variant="spinner" size="lg" />
          <p className="text-sm text-(--color-muted)">Loading your entries...</p>
        </div>
      )}

      {/* Error state (only shown if load failed and nothing to show) */}
      {!loading && error && entries.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-red-500 mb-3">
            Couldn't load entries: {error}
          </p>
          <Button variant="outline" size="sm" onClick={loadEntries}>
            Try again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && entries.length === 0 && (
        <div className="py-12 text-center text-(--color-muted)">
          <p>No entries yet. Add your first farming decision above.</p>
        </div>
      )}

      {/* Entries list */}
      {!loading && entries.length > 0 && (
        <div className="space-y-4">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="bg-(--color-surface) dark:bg-zinc-900 border border-(--color-line) dark:border-zinc-700 border-l-[3px] border-l-(--color-accent) rounded-md p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-(--color-muted) uppercase">
                    {entry.region} · {entry.crop} · {entry.season}
                  </span>
                  <h3 className="font-display text-lg font-medium text-(--color-ink) dark:text-zinc-100 mt-1">
                    {entry.title}
                  </h3>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[entry.status]}`}
                >
                  {entry.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-sm text-(--color-muted) dark:text-zinc-400">
                <p><span className="font-medium text-(--color-ink) dark:text-zinc-200">Decision:</span> {entry.decision}</p>
                <p><span className="font-medium text-(--color-ink) dark:text-zinc-200">Reason:</span> {entry.reason}</p>
                {entry.outcome && (
                  <p><span className="font-medium text-(--color-ink) dark:text-zinc-200">Outcome:</span> {entry.outcome}</p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-(--color-muted)">
                  Logged {new Date(entry.created_at).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deletingId === entry.id}
                  onClick={() => handleDelete(entry.id)}
                >
                  {deletingId === entry.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* New Entry Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log a farming decision"
      >
        <div className="space-y-3">
          <Input label="Title" placeholder="e.g. Switched to drip irrigation" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Crop" placeholder="Wheat" value={form.crop} onChange={(e) => updateField("crop", e.target.value)} />
            <Input label="Region" placeholder="Punjab" value={form.region} onChange={(e) => updateField("region", e.target.value)} />
            <Input label="Season" placeholder="Rabi 2026" value={form.season} onChange={(e) => updateField("season", e.target.value)} />
          </div>
          <Input label="Decision" placeholder="What did you decide to do?" value={form.decision} onChange={(e) => updateField("decision", e.target.value)} />
          <Input label="Reason" placeholder="Why did you make this decision?" value={form.reason} onChange={(e) => updateField("reason", e.target.value)} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="primary" onClick={handleCreate} disabled={submitting}>
            {submitting ? "Saving..." : "Save entry"}
          </Button>
          <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
            Cancel
          </Button>
        </div>
      </Modal>
    </section>
  );
}
