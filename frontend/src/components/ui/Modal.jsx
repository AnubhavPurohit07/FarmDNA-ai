/**
 * Modal component for FarmDNA
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls whether the modal is visible
 * @param {function} props.onClose - Called when user closes the modal
 * @param {string} [props.title] - Modal heading text
 * @param {React.ReactNode} props.children - Modal body content
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Modal width
 */

import { useEffect, useRef } from "react";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Focus trap — focus the modal container when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative w-full ${SIZES[size]} bg-(--color-surface) dark:bg-zinc-900
          border border-(--color-line) dark:border-zinc-700
          rounded-lg shadow-xl outline-none
          animate-in fade-in zoom-in-95 duration-150
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-line) dark:border-zinc-700">
          {title && (
            <h2
              id="modal-title"
              className="font-display text-lg font-medium text-(--color-ink) dark:text-zinc-100"
            >
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto text-(--color-muted) hover:text-(--color-ink) dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-sm text-(--color-muted) dark:text-zinc-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
