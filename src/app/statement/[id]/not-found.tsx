import Link from 'next/link';

export default function StatementNotFound() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link 
        href="/"
        className="inline-block mb-6 text-sm hover:underline"
      >
        ← Back to Home
      </Link>
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Statement Not Found</h2>
        <p className="text-gray-600 mb-6">
          This statement may have been removed or never existed.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 rounded-2xl bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Browse Statements
        </Link>
      </div>
    </main>
  );
}
