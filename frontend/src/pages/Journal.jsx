import { useEffect, useState } from "react";
import { getEntries, createEntry, updateEntry, deleteEntry } from "../api/entries";
import { Button, Input, Modal, Loader, showToast } from "../components/ui";

const STATUS_STYLES = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  partial: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  failure: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const STATUS_OPTIONS = ["pending", "success", "partial", "failure"];

const EMPTY_FORM = {
  title: "",
  crop: "",
  region: "",
  season: "",
  decision: "",
  reason: "",
  outcome: "",
};

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [updating, setUpdating] = useState(false);

  // Delete state
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

  // ── Create ────────────────────────────────────────────────────────────
  function updateCreateField(field, value) {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate() {
    if (!createForm.title || !createForm.crop || !createForm.region ||
        !createForm.season || !createForm.decision || !createForm.reason) {
      showToast.error("Please fill in all required fields before saving.");
      return;
    }
    setCreating(true);
    try {
      const newEntry = await createEntry(createForm);
      setEntries((prev) => [newEntry, ...prev]);
      showToast.success("Entry saved successfully!");
      setCreateForm(EMPTY_FORM);
      setCreateOpen(false);
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setCreating(false);
    }
  }

  // ── Edit ──────────────────────────────────────────────────────────────
  function openEdit(entry) {
    setEditingEntry(entry);
    setEditForm({
      title: entry.title || "",
      crop: entry.crop || "",
      region: entry.region || "",
      season: entry.season || "",
      decision: entry.decision || "",
      reason: entry.reason || "",
      outcome: entry.outcome || "",
      status: entry.status || "pending",
    });
    setEditOpen(true);
  }

  function updateEditField(field, value) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleUpdate() {
    if (!editingEntry) return;
    setUpdating(true);
    try {
      const entryId = editingEntry._id || editingEntry.id;
      const updated = await updateEntry(entryId, editForm);
      setEntries((prev) =>
        prev.map((e) => {
          const eId = e._id || e.id;
          const updatedId = updated._id || updated.id;
          return eId === updatedId ? updated : e;
        })
      );
      showToast.success("Entry updated successfully!");
      setEditOpen(false);
      setEditingEntry(null);
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setUpdating(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────
  async function handleDelete(entry) {
    const entryId = entry._id || entry.id;
    setDeletingId(entryId);
    try {
      await deleteEntry(entryId);
      setEntries((prev) => prev.filter((e) => (e._id || e.id) !== entryId));
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
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
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

      {/* Error state */}
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
          {entries.map((entry) => {
            const entryId = entry._id || entry.id;
            return (
              <article
                key={entryId}
                className="bg-white dark:bg-zinc-900 border border-(--color-line) dark:border-zinc-700 border-l-[3px] border-l-(--color-accent) rounded-md p-5 transition-colors"
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
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[entry.status]}`}>
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEdit(entry)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deletingId === entryId}
                      onClick={() => handleDelete(entry)}
                    >
                      {deletingId === entryId ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Create Modal ── */}
      <Modal
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); setCreateForm(EMPTY_FORM); }}
        title="Log a farming decision"
      >
        <div className="space-y-3">
          <Input label="Title" placeholder="e.g. Switched to drip irrigation"
            value={createForm.title} onChange={(e) => updateCreateField("title", e.target.value)} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Crop" placeholder="Wheat"
              value={createForm.crop} onChange={(e) => updateCreateField("crop", e.target.value)} />
            <Input label="Region" placeholder="Punjab"
              value={createForm.region} onChange={(e) => updateCreateField("region", e.target.value)} />
            <Input label="Season" placeholder="Rabi 2026"
              value={createForm.season} onChange={(e) => updateCreateField("season", e.target.value)} />
          </div>
          <Input label="Decision" placeholder="What did you decide to do?"
            value={createForm.decision} onChange={(e) => updateCreateField("decision", e.target.value)} />
          <Input label="Reason" placeholder="Why did you make this decision?"
            value={createForm.reason} onChange={(e) => updateCreateField("reason", e.target.value)} />
          <Input label="Outcome (optional)" placeholder="What happened at harvest?"
            value={createForm.outcome} onChange={(e) => updateCreateField("outcome", e.target.value)} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="primary" onClick={handleCreate} disabled={creating}>
            {creating ? "Saving..." : "Save entry"}
          </Button>
          <Button variant="secondary" onClick={() => { setCreateOpen(false); setCreateForm(EMPTY_FORM); }} disabled={creating}>
            Cancel
          </Button>
        </div>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal
        isOpen={editOpen}
        onClose={() => { setEditOpen(false); setEditingEntry(null); }}
        title="Edit entry"
        size="lg"
      >
        <div className="space-y-3">
          <Input label="Title" placeholder="e.g. Switched to drip irrigation"
            value={editForm.title} onChange={(e) => updateEditField("title", e.target.value)} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Crop" placeholder="Wheat"
              value={editForm.crop} onChange={(e) => updateEditField("crop", e.target.value)} />
            <Input label="Region" placeholder="Punjab"
              value={editForm.region} onChange={(e) => updateEditField("region", e.target.value)} />
            <Input label="Season" placeholder="Rabi 2026"
              value={editForm.season} onChange={(e) => updateEditField("season", e.target.value)} />
          </div>
          <Input label="Decision" placeholder="What did you decide to do?"
            value={editForm.decision} onChange={(e) => updateEditField("decision", e.target.value)} />
          <Input label="Reason" placeholder="Why did you make this decision?"
            value={editForm.reason} onChange={(e) => updateEditField("reason", e.target.value)} />
          <Input label="Outcome" placeholder="What happened at harvest?"
            value={editForm.outcome} onChange={(e) => updateEditField("outcome", e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--color-ink) dark:text-zinc-200">
              Status
            </label>
            <select
              value={editForm.status}
              onChange={(e) => updateEditField("status", e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-(--color-line) dark:border-zinc-700 bg-(--color-surface) dark:bg-zinc-800 text-(--color-ink) dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="primary" onClick={handleUpdate} disabled={updating}>
            {updating ? "Saving..." : "Save changes"}
          </Button>
          <Button variant="secondary" onClick={() => { setEditOpen(false); setEditingEntry(null); }} disabled={updating}>
            Cancel
          </Button>
        </div>
      </Modal>
    </section>
  );
}
