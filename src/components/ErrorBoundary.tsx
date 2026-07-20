import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Last-resort error boundary: if anything in the tree throws during render,
 * show a calm, styled recovery screen instead of a blank page. Progress lives
 * in LocalStorage, so a reload never loses the learner's data.
 */
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[florine] render crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment px-6 text-ink">
        <div className="max-w-md space-y-4 rounded-lg border border-ink/20 bg-card p-6 text-center shadow-[4px_4px_0_rgba(23,18,12,0.25)]">
          <p className="font-display text-2xl font-bold text-rouge">Oups. Croâ.</p>
          <p className="text-sm text-ink/75">
            Something went wrong while drawing this page. Your progress is safe — it lives in
            this browser, not on the page that just crashed.
          </p>
          <p className="rounded bg-parchment px-3 py-2 text-left font-mono text-xs text-ink/60">
            {this.state.error.message}
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded bg-marine px-4 py-2 text-sm font-medium text-white hover:bg-marine/90"
            >
              Reload
            </button>
            <a
              href="/"
              className="rounded border border-ink/25 px-4 py-2 text-sm font-medium text-ink/80 hover:border-marine hover:text-marine"
            >
              Back home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
