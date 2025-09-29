export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {[1, 2, 3].map((i) => (
        <section key={i} className="mb-10">
          <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="min-w-[340px] max-w-[340px] rounded-2xl border p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="mt-3 flex gap-2">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
