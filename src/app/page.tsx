import Link from "next/link";
import React from "react";

type LaneItem = {
  id: string;
  text: string;
  createdAt: string;
  totalVotes: number;
  agreeWeight: number;
  disagreeWeight: number;
  balanceScore?: number;
};

async function getLanes() {
  try {
    const res = await fetch('/api/statements', {
      cache: 'force-cache',
      next: { 
        revalidate: 30,    // Cache for 30 seconds
        tags: ['statements'] // Tag for manual revalidation
      }
    });
    
    if (!res.ok) {
      console.error("Failed to load statements:", await res.text());
      throw new Error("Failed to load statements");
    }

    const data = await res.json();
    return data as { mostPopular: LaneItem[]; fiftyFifty: LaneItem[]; newHot: LaneItem[] };
  } catch (error) {
    console.error("Error fetching statements:", error);
    return {
      mostPopular: [],
      fiftyFifty: [],
      newHot: []
    };
  }
}

function Lane({ title, items }: { title: string; items: LaneItem[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.length === 0 ? (
          <div className="min-w-[340px] max-w-[340px] rounded-2xl border p-4 animate-pulse bg-gray-50">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-3 flex gap-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ) : (
          items.map((s) => (
            <Link
              key={s.id}
              href={`/statement/${s.id}`}
              className="min-w-[340px] max-w-[340px] rounded-2xl border p-4 hover:shadow-sm transition-shadow"
            >
              <p className="leading-6">{s.text}</p>
              <div className="mt-3 text-xs opacity-70">
                <span className="mr-3">Votes: {s.totalVotes}</span>
                <span>Balance: {s.balanceScore?.toFixed?.(2) ?? "0.00"}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

export default async function Home() {
  const lanes = await getLanes();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Collegeism — Understanding &gt; Noise</h1>
        <p className="opacity-70 mt-2">
          Vote, earn weight by passing quick comprehension checks, and see summarized reasons for both sides.
        </p>
      </header>

      <Lane title="Most Popular" items={lanes.mostPopular} />
      <Lane title="50/50 Debates" items={lanes.fiftyFifty} />
      <Lane title="New / Hot" items={lanes.newHot} />
    </main>
  );
}
