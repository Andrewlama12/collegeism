import Link from "next/link";
import React from "react";

type StatementItem = {
  id: string;
  text: string;
  createdAt: string;
  totalVotes: number;
  agreeWeight: number;
  disagreeWeight: number;
  summary?: {
    forReasons: string[];
    againstReasons: string[];
  };
};

function getBadges(statement: StatementItem) {
  const badges: { label: string; emoji: string }[] = [];
  
  // Check if popular (more than 5 votes)
  if (statement.totalVotes >= 5) {
    badges.push({ label: "Popular", emoji: "🔥" });
  }
  
  // Check if new (created in last 24 hours)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  if (new Date(statement.createdAt).getTime() > oneDayAgo) {
    badges.push({ label: "New", emoji: "✨" });
  }
  
  // Check if close (votes are within 20% of each other)
  const total = statement.agreeWeight + statement.disagreeWeight;
  if (total > 0) {
    const agreePercent = (statement.agreeWeight / total) * 100;
    if (agreePercent >= 40 && agreePercent <= 60) {
      badges.push({ label: "Close", emoji: "⚖️" });
    }
  }
  
  // Check for low understanding (people failing the quiz)
  // Weight scoring: 1.0 = all correct, 0.5 = partial, 0.0 = wrong
  // If average weight < 0.5, people are doing poorly
  if (statement.totalVotes >= 3) {
    const totalWeight = statement.agreeWeight + statement.disagreeWeight;
    const avgWeight = totalWeight / statement.totalVotes;
    
    if (avgWeight < 0.5) {
      badges.push({ label: "Uninformed", emoji: "⚠️" });
    }
  }
  
  return badges;
}

function getPercentages(agreeWeight: number, disagreeWeight: number) {
  const total = agreeWeight + disagreeWeight;
  if (total === 0) return { agree: 0, disagree: 0 };
  
  return {
    agree: Math.round((agreeWeight / total) * 100),
    disagree: Math.round((disagreeWeight / total) * 100)
  };
}

async function getStatements() {
  const { getStatements } = await import('@/lib/data');
  const statements = await getStatements();
  
  // Sort by most recent first
  return statements.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

function StatementCard({ statement }: { statement: StatementItem }) {
  const badges = getBadges(statement);
  const percentages = getPercentages(statement.agreeWeight, statement.disagreeWeight);
  
  // Remove surrounding quotes from text
  const cleanText = statement.text.replace(/^["']|["']$/g, '');
  
  // Calculate comprehension rate
  const getComprehensionStats = () => {
    if (statement.totalVotes < 1) return null;
    
    const totalWeight = statement.agreeWeight + statement.disagreeWeight;
    const avgWeight = totalWeight / statement.totalVotes;
    const comprehensionRate = Math.round(avgWeight * 100);
    
    let bgColor = 'bg-blue-50';
    let borderColor = 'border-blue-200';
    let textColor = 'text-blue-700';
    
    if (comprehensionRate >= 70) {
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
      textColor = 'text-green-700';
    } else if (comprehensionRate < 50) {
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
      textColor = 'text-red-700';
    } else if (comprehensionRate < 70) {
      bgColor = 'bg-yellow-50';
      borderColor = 'border-yellow-200';
      textColor = 'text-yellow-700';
    }
    
    return { rate: comprehensionRate, bgColor, borderColor, textColor };
  };
  
  const comprehension = getComprehensionStats();
  
  return (
    <Link
      href={`/statement/${statement.id}`}
      className="group rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 relative bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
    >
      {/* Badges in upper right */}
      {badges.length > 0 && (
        <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap justify-end max-w-[140px]">
          {badges.map((badge, i) => (
            <span
              key={i}
              className="text-xs bg-gradient-to-r from-gray-100 to-gray-50 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm"
            >
              <span>{badge.emoji}</span>
              <span className="font-semibold text-gray-700">{badge.label}</span>
            </span>
          ))}
        </div>
      )}
      
      <p className="leading-7 pr-20 text-gray-800 font-semibold text-lg group-hover:text-gray-900">{cleanText}</p>
      
      {/* Comprehension Rate Ribbon */}
      {comprehension && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🧠</span>
            <span>Voter Comprehension:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold ${comprehension.textColor}`}>{comprehension.rate}%</span>
            <span className="text-gray-500">
              {comprehension.rate >= 70 && 'Informed'}
              {comprehension.rate < 50 && 'Uninformed'}
              {comprehension.rate >= 50 && comprehension.rate < 70 && 'Partly Informed'}
            </span>
          </div>
        </div>
      )}
      
      {/* Preview of arguments */}
      {statement.summary && (
        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="font-semibold text-green-800 mb-2 flex items-center gap-1">
              <span>✓</span> For
            </div>
            <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">
              {statement.summary.forReasons[0]}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="font-semibold text-red-800 mb-2 flex items-center gap-1">
              <span>✗</span> Against
            </div>
            <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">
              {statement.summary.againstReasons[0]}
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex items-center gap-5 text-sm border-t pt-4">
        <div className="flex items-center gap-1.5 bg-green-50 rounded-lg px-3 py-1.5">
          <span className="text-lg">👍</span>
          <span className="font-bold text-green-700">{percentages.agree}%</span>
        </div>
        <div className="flex items-center gap-1.5 bg-red-50 rounded-lg px-3 py-1.5">
          <span className="text-lg">👎</span>
          <span className="font-bold text-red-700">{percentages.disagree}%</span>
        </div>
        <span className="text-xs opacity-60 ml-auto">
          {statement.totalVotes} {statement.totalVotes === 1 ? 'vote' : 'votes'}
        </span>
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-xs text-blue-600 font-medium group-hover:underline">
          Click to read more & vote →
        </span>
      </div>
    </Link>
  );
}

export default async function Home() {
  try {
    const statements = await getStatements();

    return (
      <main className="mx-auto max-w-5xl p-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-black">
            Collegeism — Understanding &gt; Noise
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Vote on important world issues. Earn weight by demonstrating comprehension. See both sides of every debate.
          </p>
        </header>

        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
          {statements.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-500 text-lg">No statements yet. Create one to get started!</p>
            </div>
          ) : (
            statements.map((statement) => (
              <StatementCard key={statement.id} statement={statement} />
            ))
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    throw error;
  }
}
