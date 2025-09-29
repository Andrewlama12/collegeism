'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="rounded-2xl border p-6 bg-red-50">
        <h2 className="text-xl font-semibold mb-2 text-red-700">Something went wrong!</h2>
        <p className="text-red-600 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}