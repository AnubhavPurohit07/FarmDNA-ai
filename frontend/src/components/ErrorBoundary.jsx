import { Component } from "react";

/**
 * ErrorBoundary — catches JavaScript errors during rendering anywhere in
 * the component tree below it, logs them, and shows a friendly fallback
 * UI instead of the blank white screen React would otherwise leave behind.
 *
 * Must be a class component — React only supports error boundaries via
 * the class-based getDerivedStateFromError / componentDidCatch lifecycle;
 * there is no hook equivalent as of this writing.
 *
 * Usage: wrap around <App /> or around individual route sections.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a production app this would also report to an error-tracking
    // service (Sentry, LogRocket, etc). For now, logging to console is
    // enough to debug during development.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-(--color-canvas) px-4">
          <div className="max-w-md text-center">
            <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-4">
              SOMETHING WENT WRONG
            </p>
            <h1 className="font-display text-2xl font-medium text-(--color-ink) mb-3">
              This page hit an unexpected error
            </h1>
            <p className="text-sm text-(--color-muted) mb-6 leading-relaxed">
              Sorry about that — something broke while rendering this page.
              Your data is safe. Try going back to the homepage, and if this
              keeps happening, let us know what you were doing when it broke.
            </p>
            <button
              onClick={this.handleReset}
              className="bg-(--color-accent) text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-(--color-accent-dark) transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
