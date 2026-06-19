import { Loader2, SearchX, TriangleAlert, RotateCw } from 'lucide-react';

export const Spinner = ({ className = 'h-5 w-5' }) => (
  <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />
);

// Loading state for feeds and lists.
export const Loading = ({ label = 'Loading listings…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-600">
    <Spinner className="h-8 w-8" />
    <p className="font-medium">{label}</p>
  </div>
);

// Empty state — an invitation to act, not a dead end.
export const Empty = ({ title = 'No listings yet', message, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-ink-200 bg-white/60 py-20 text-center">
    <SearchX className="h-10 w-10 text-ink-400" aria-hidden="true" />
    <h3 className="font-display text-xl text-ink-800">{title}</h3>
    {message && <p className="max-w-sm text-coal/60">{message}</p>}
    {action}
  </div>
);

// Error state — explains what happened and offers a retry.
export const ErrorState = ({ message = 'We could not load this right now.', onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-red-100 bg-red-50/60 py-20 text-center">
    <TriangleAlert className="h-10 w-10 text-red-500" aria-hidden="true" />
    <p className="max-w-sm font-medium text-red-700">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-ghost mt-1">
        <RotateCw className="h-4 w-4" /> Try again
      </button>
    )}
  </div>
);
