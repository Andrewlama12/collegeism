'use client';

import Link from "next/link";
import React, { useMemo } from "react";

type Statement = {
  id: string;
  text: string;
  createdAt: string;
  totalVotes: number;
  agreeWeight: number;
  disagreeWeight: number;
  balanceScore?: number;
};

function getStatementCategory(statement: Statement): string {
  const balance = statement.balanceScore || 0;
  const now = new Date();
  const createdAt = new Date(statement.createdAt);
  const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  // If it's less than 3 days old and has votes, it's hot
  if (daysSinceCreation < 3 && statement.totalVotes > 0) {
    return "🔥 Hot";
  }

  // If balance is close to 50/50 (between 45% and 55%) and has votes
  if (statement.totalVotes > 0 && balance >= 0.45 && balance <= 0.55) {
    return "⚖️ 50/50";
  }

  // If it has significant votes, it's popular
  if (statement.totalVotes >= 5) {
    return "🌟 Popular";
  }

  // Default to New if none of the above
  return "✨ New";
}

export function Lane({ statement }: { statement: Statement }) {
  const { agreePercent, disagreePercent } = useMemo(() => {
    const agree = ((statement.balanceScore || 0) * 100).toFixed(1);
    const disagree = (100 - parseFloat(agree)).toFixed(1);
    return { agreePercent: agree, disagreePercent: disagree };
  }, [statement.balanceScore]);

  const category = useMemo(() => getStatementCategory(statement), [
    statement.totalVotes,
    statement.balanceScore,
    statement.createdAt
  ]);
  
  return (
    <Link
      href={`/statement/${statement.id}`}
      className="block w-full rounded-2xl border p-4 hover:shadow-sm transition-shadow bg-white relative"
    >
      <div className="absolute top-4 right-4">
        <span className="text-sm font-medium text-gray-600">{category}</span>
      </div>
      <p className="text-lg leading-7 pr-24">{statement.text}</p>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="opacity-70">Votes: {statement.totalVotes}</span>
        {statement.totalVotes > 0 && (
          <>
            <span className="text-emerald-600 font-medium">👍 {agreePercent}%</span>
            <span className="text-rose-600 font-medium">👎 {disagreePercent}%</span>
          </>
        )}
      </div>
    </Link>
  );
}