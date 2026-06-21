import { useState } from "react";
import { Button, Input, Modal, Loader, showToast } from "../components/ui";

export default function UIShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const handleInputValidate = () => {
    if (!inputValue.trim()) {
      setInputError("This field cannot be empty.");
    } else {
      setInputError("");
      showToast.success("Input looks good!");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">
      {/* Page header */}
      <div>
        <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-3">
          WEEK 2 DELIVERABLE
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-medium text-(--color-ink) tracking-tight">
          UI Component Library
        </h1>
        <p className="mt-3 text-(--color-muted) max-w-xl leading-relaxed">
          A showcase of all reusable UI components built for FarmDNA. Each
          component is fully interactive and supports dark mode.
        </p>
      </div>

      {/* Button */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-(--color-ink) border-b border-(--color-line) pb-2">
          Button
        </h2>
        <p className="text-sm text-(--color-muted)">
          Supports <code className="font-mono text-xs bg-(--color-canvas) px-1 rounded">variant</code>,{" "}
          <code className="font-mono text-xs bg-(--color-canvas) px-1 rounded">size</code>, and{" "}
          <code className="font-mono text-xs bg-(--color-canvas) px-1 rounded">disabled</code> props.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" onClick={() => showToast.success("Primary clicked!")}>
            Primary
          </Button>
          <Button variant="secondary" onClick={() => showToast.info("Secondary clicked!")}>
            Secondary
          </Button>
          <Button variant="outline" onClick={() => showToast.info("Outline clicked!")}>
            Outline
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm" variant="primary">Small</Button>
          <Button size="md" variant="primary">Medium</Button>
          <Button size="lg" variant="primary">Large</Button>
        </div>
      </section>

      {/* Input */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-(--color-ink) border-b border-(--color-line) pb-2">
          Input
        </h2>
        <p className="text-sm text-(--color-muted)">
          Supports <code className="font-mono text-xs bg-(--color-canvas) px-1 rounded">label</code>,{" "}
          <code className="font-mono text-xs bg-(--color-canvas) px-1 rounded">error</code>, and controlled{" "}
          <code className="font-mono text-xs bg-(--color-canvas) px-1 rounded">value</code>.
        </p>
        <div className="max-w-sm space-y-4">
          <Input
            label="Crop name"
            placeholder="e.g. Wheat, Cotton, Tomato"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setInputError(""); }}
            error={inputError}
          />
          <Input label="Season" placeholder="e.g. Kharif 2025" />
          <Input label="Password" type="password" placeholder="Enter password" />
          <Button variant="outline" size="sm" onClick={handleInputValidate}>
            Validate first field
          </Button>
        </div>
      </section>

      {/* Modal */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-(--color-ink) border-b border-(--color-line) pb-2">
          Modal
        </h2>
        <p className="text-sm text-(--color-muted)">
          Traps focus, closes on Escape key or backdrop click.
        </p>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Open Modal
        </Button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Log a farming decision"
        >
          <p className="mb-4">
            Use this dialog to record an important farming decision — what you
            chose, why you chose it, and what season it applies to.
          </p>
          <div className="space-y-3">
            <Input label="Decision" placeholder="e.g. Switch to drip irrigation" />
            <Input label="Reason" placeholder="e.g. Dry spell forecast for next 3 weeks" />
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="primary" onClick={() => { setModalOpen(false); showToast.success("Decision logged!"); }}>
              Save entry
            </Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      </section>

      {/* Toast */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-(--color-ink) border-b border-(--color-line) pb-2">
          Toast
        </h2>
        <p className="text-sm text-(--color-muted)">
          Powered by react-hot-toast. Appears bottom-right, auto-dismisses after 3.5s.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm" onClick={() => showToast.success("Entry saved successfully!")}>
            Success toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => showToast.error("Failed to save entry.")}>
            Error toast
          </Button>
          <Button variant="secondary" size="sm" onClick={() => showToast.info("AI is analyzing patterns...")}>
            Info toast
          </Button>
          <Button variant="secondary" size="sm" onClick={() => showToast.loading("Saving your record...")}>
            Loading toast
          </Button>
        </div>
      </section>

      {/* Loader */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-(--color-ink) border-b border-(--color-line) pb-2">
          Loader
        </h2>
        <p className="text-sm text-(--color-muted)">
          Two variants: spinner (for actions) and skeleton (for content loading).
        </p>
        <div className="flex flex-wrap items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Loader variant="spinner" size="sm" />
            <span className="font-mono text-xs text-(--color-muted)">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader variant="spinner" size="md" />
            <span className="font-mono text-xs text-(--color-muted)">md</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader variant="spinner" size="lg" />
            <span className="font-mono text-xs text-(--color-muted)">lg</span>
          </div>
          <div className="w-64">
            <Loader variant="skeleton" lines={3} />
          </div>
        </div>
      </section>
    </div>
  );
}
