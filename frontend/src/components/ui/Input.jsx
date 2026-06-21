/**
 * Input component for FarmDNA
 *
 * @param {object} props
 * @param {string} [props.label] - Label text shown above the input
 * @param {string} [props.placeholder] - Placeholder text inside the input
 * @param {string} [props.type='text'] - HTML input type (text, email, password, etc.)
 * @param {string} [props.value] - Controlled value
 * @param {function} [props.onChange] - Change handler
 * @param {string} [props.error] - Error message shown below the input
 * @param {string} [props.id] - HTML id for label association
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.className] - Additional CSS classes
 */

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  id,
  disabled = false,
  className = "",
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-(--color-ink) dark:text-zinc-200"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full px-3.5 py-2.5 text-sm rounded-md border transition-colors
          bg-(--color-surface) dark:bg-zinc-800
          text-(--color-ink) dark:text-zinc-100
          placeholder:text-(--color-muted) dark:placeholder:text-zinc-500
          focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-400 dark:border-red-500"
              : "border-(--color-line) dark:border-zinc-700 hover:border-(--color-muted)"
          }
        `}
      />
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
