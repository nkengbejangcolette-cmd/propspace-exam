import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <img src="/mark.svg" alt="" className="h-14 w-14" />
      <h1 className="mt-6 font-display text-5xl font-semibold text-ink-900">404</h1>
      <p className="mt-2 text-coal/60">
        We couldn't find that page. It may have moved or never existed.
      </p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
