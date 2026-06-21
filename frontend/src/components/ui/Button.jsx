/**
 * Button component for FarmDNA
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'outline'} [props.variant='primary'] - Visual style variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {function} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button label/content
 * @param {'button'|'submit'|'reset'} [props.type='button'] - HTML button type
 * @param {string} [props.className] - Additional CSS classes
 */

const VARIANTS = {
  primary:
    "bg-(--color-accent) text-white hover:bg-(--color-accent-dark) disabled:bg-(--color-muted)",
  secondary:
    "bg-(--color-canvas) dark:bg-zinc-800 text-(--color-ink) dark:text-zinc-100 border border-(--color-line) dark:border-zinc-700 hover:border-(--color-accent) dark:hover:border-(--color-accent) disabled:opacity-50",
  outline:
    "bg-transparent text-(--color-accent) border border-(--color-accent) hover:bg-(--color-accent) hover:text-white disabled:opacity-50",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5 rounded",
  md: "text-sm px-5 py-2.5 rounded-md",
  lg: "text-base px-7 py-3.5 rounded-md",
};

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center font-medium transition-colors
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)
        disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
