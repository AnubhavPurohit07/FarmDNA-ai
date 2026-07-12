import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Hero({
  eyebrow = "FIELD RECORD · KHARIF SEASON",
  headline = "Every decision a farmer makes carries a lesson worth keeping.",
  subheadline = "FarmDNA turns scattered farming experience — what was planted, why, and what happened next — into a searchable record the whole community can learn from.",
  ctaLabel = "Start your journal",
  imageSrc,
  imageAlt = "A farmer's field at golden hour",
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCTA() {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }

  return (
    <section className="border-b border-(--color-line) bg-(--color-surface) dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-(--color-accent) mb-5">
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-[1.08] font-medium text-(--color-ink) dark:text-zinc-100 tracking-tight">
            {headline}
          </h1>
          <p className="mt-6 text-base md:text-lg text-(--color-muted) max-w-md leading-relaxed">
            {subheadline}
          </p>
          <div className="mt-9 flex items-center gap-4">
            <button
              type="button"
              onClick={handleCTA}
              className="bg-(--color-accent) text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-(--color-accent-dark) transition-colors"
            >
              {ctaLabel}
            </button>
          </div>
        </div>

        <div className="relative">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-80 object-cover rounded-md border border-(--color-line)"
            />
          ) : (
            <div
              role="img"
              aria-label={imageAlt}
              className="w-full h-80 rounded-md border border-(--color-line) bg-(--color-canvas) dark:bg-zinc-800 flex items-center justify-center"
            >
              <span className="font-mono text-xs text-(--color-muted) tracking-widest">
                IMAGE PLACEHOLDER
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
