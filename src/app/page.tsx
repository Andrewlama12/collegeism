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
  // Import data directly since we're on the server
  const { db, computeBalance } = await import('@/lib/data');
  
  // Initialize data if empty
  if (db.statements.length === 0) {
    const now = new Date();
    const s = (hrs: number) => new Date(now.getTime() - hrs * 3600_000).toISOString();
    
    db.statements.push(
      {
        id: "1",
        text: "Universities should publish all course materials online for free.",
        createdAt: s(4),
        totalVotes: 10,
        agreeWeight: 7,
        disagreeWeight: 3,
        quiz: []
      },
      {
        id: "2",
        text: "Campus parking should be replaced with green space and microtransit.",
        createdAt: s(2),
        totalVotes: 15,
        agreeWeight: 8,
        disagreeWeight: 7,
        quiz: []
      }
    );
  }

  const items = db.statements.map(s => ({ ...s, balanceScore: computeBalance(s) }));
  
  return {
    mostPopular: [...items].sort((a, b) => b.totalVotes - a.totalVotes).slice(0, 20),
    fiftyFifty: [...items].sort((a, b) => Math.abs(0.5 - (a.agreeWeight / (a.agreeWeight + a.disagreeWeight))) - Math.abs(0.5 - (b.agreeWeight / (b.agreeWeight + b.disagreeWeight)))).slice(0, 20),
    newHot: [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 20)
  };
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
