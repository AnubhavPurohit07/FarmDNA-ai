export default function Card({
  title,
  description,
  imageSrc,
  imageAlt = "",
  tag,
  actionLabel,
  onAction,
}) {
  return (
    <article className="bg-(--color-surface) border border-(--color-line) border-l-[3px] border-l-(--color-accent) rounded-md overflow-hidden flex flex-col hover:shadow-sm transition-shadow">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-36 object-cover border-b border-(--color-line)"
        />
      ) : (
        <div className="w-full h-36 bg-(--color-canvas) border-b border-(--color-line) flex items-center justify-center">
          <span className="font-mono text-[10px] tracking-widest text-(--color-muted)">
            NO IMAGE
          </span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {tag && (
          <span className="font-mono text-[10px] tracking-widest text-(--color-accent) mb-2 uppercase">
            {tag}
          </span>
        )}
        <h3 className="font-display text-lg font-medium text-(--color-ink) leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-sm text-(--color-muted) leading-relaxed flex-1">
          {description}
        </p>

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 self-start text-sm font-medium text-(--color-accent) hover:text-(--color-accent-dark) transition-colors"
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </article>
  );
}
