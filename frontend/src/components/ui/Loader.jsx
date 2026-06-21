/**
 * Loader component for FarmDNA
 *
 * @param {object} props
 * @param {'spinner'|'skeleton'} [props.variant='spinner'] - Loader style
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size of the spinner
 * @param {string} [props.label='Loading...'] - Accessible label for screen readers
 * @param {number} [props.lines=3] - Number of skeleton lines (skeleton variant only)
 * @param {string} [props.className] - Additional CSS classes
 */

const SPINNER_SIZES = {
  sm: "w-4 h-4 border-2",
  md: "w-7 h-7 border-2",
  lg: "w-10 h-10 border-[3px]",
};

function Spinner({ size = "md", label = "Loading..." }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex items-center justify-center"
    >
      <div
        className={`
          ${SPINNER_SIZES[size]}
          rounded-full
          border-t-(--color-accent)
          border-r-(--color-accent)
          border-b-transparent
          border-l-transparent
          animate-spin
        `}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

function Skeleton({ lines = 3, className = "" }) {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className={`space-y-3 ${className}`}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`
            h-4 rounded bg-(--color-line) dark:bg-zinc-700
            animate-pulse
            ${i === lines - 1 ? "w-3/4" : "w-full"}
          `}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default function Loader({
  variant = "spinner",
  size = "md",
  label = "Loading...",
  lines = 3,
  className = "",
}) {
  if (variant === "skeleton") {
    return <Skeleton lines={lines} className={className} />;
  }
  return <Spinner size={size} label={label} />;
}
