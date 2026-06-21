/**
 * Toast component for FarmDNA — powered by react-hot-toast
 *
 * Usage:
 *   1. Add <ToastProvider /> once at the root of your app (already in App.jsx)
 *   2. Call toast helpers anywhere in your components:
 *        import { showToast } from "@/components/ui/Toast";
 *        showToast.success("Entry saved!");
 *        showToast.error("Something went wrong.");
 *        showToast.info("Analyzing patterns...");
 *
 * @param {object} props - No props needed; ToastProvider self-configures
 */

import toast, { Toaster } from "react-hot-toast";

/**
 * Place <ToastProvider /> once inside App.jsx to enable toasts app-wide.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3500,
        style: {
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "0.875rem",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
        },
        success: {
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
          },
          iconTheme: { primary: "#3F6B3F", secondary: "#fff" },
        },
        error: {
          style: {
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
        },
        loading: {
          style: {
            background: "#fafaf7",
            color: "#1C1F1A",
            border: "1px solid #E3E2DC",
          },
        },
      }}
    />
  );
}

/**
 * Convenience helpers — import showToast anywhere and call:
 *   showToast.success("Done!")
 *   showToast.error("Failed.")
 *   showToast.info("Note...")
 *   showToast.loading("Saving...")
 *   showToast.dismiss()
 */
export const showToast = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast(msg, { icon: "ℹ️" }),
  loading: (msg) => toast.loading(msg),
  dismiss: () => toast.dismiss(),
};

export default ToastProvider;
