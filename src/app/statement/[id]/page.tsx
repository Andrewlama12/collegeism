"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type QuizQ = { id: string; question: string; choices: string[]; answerIndex: number };
type Statement = {
  id: string;
  text: string;
  createdAt: string;
  totalVotes: number;
  agreeWeight: number;
  disagreeWeight: number;
  quiz: QuizQ[];
  summary?: { forReasons: string[]; againstReasons: string[] };
};

export default function StatementPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Statement | null>(null);
  const [loading, setLoading] = useState(true);
  const [stance, setStance] = useState<"agree" | "disagree" | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch statement data
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/statements/${params.id}`);
        if (!mounted) return;

        if (!res.ok) {
          setError("Failed to load statement");
          return;
        }

        const json = await res.json();
        if (!mounted) return;

        setData(json);
        setAnswers(new Array(json?.quiz?.length ?? 0).fill(-1));
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load statement");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, [params.id]);

  const canSubmit = useMemo(() => {
    if (!stance || !data) return false;
    return answers.every((i) => i >= 0);
  }, [stance, data, answers]);

  async function submit() {
    if (!data || !stance) return;
    setError(null);
    const res = await fetch(`/api/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statementId: data.id, stance, answers }),
    }).catch(() => null);
    if (!res || !res.ok) {
      setError("Failed to submit vote");
      return;
    }
    const json = await res.json();
    setResult(json);

    const ref = await fetch(`/api/statements/${params.id}`).catch(() => null);
    if (ref && ref.ok) setData(await ref.json());
  }

  if (loading) return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/" className="inline-block mb-6 text-sm hover:underline">← Back to Home</Link>
      <div>Loading…</div>
    </main>
  );
  
  if (!data) return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/" className="inline-block mb-6 text-sm hover:underline">← Back to Home</Link>
      <div>Not found.</div>
    </main>
  );

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link 
        href="/"
        className="inline-flex items-center gap-2 mb-6 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        ← Back to Home
      </Link>
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Statement</h1>
      <p className="leading-8 text-lg text-gray-900 font-medium">{data.text.replace(/^["']|["']$/g, '')}</p>

      <div className="mt-8 flex gap-4">
        <button
          className={`rounded-xl border-2 px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
            stance === "agree" 
              ? "bg-green-500 text-white border-green-600 shadow-lg scale-105" 
              : "bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50"
          }`}
          onClick={() => setStance("agree")}
        >
          <span className="text-xl">👍</span>
          Agree
        </button>
        <button
          className={`rounded-xl border-2 px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
            stance === "disagree" 
              ? "bg-red-500 text-white border-red-600 shadow-lg scale-105" 
              : "bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:bg-red-50"
          }`}
          onClick={() => setStance("disagree")}
        >
          <span className="text-xl">👎</span>
          Disagree
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📝 Comprehension Check</h2>
        {data.quiz?.map((q, qi) => (
          <div key={q.id} className="mb-6 rounded-xl border-2 border-gray-200 p-5 bg-gradient-to-br from-white to-gray-50">
            <p className="font-semibold mb-3 text-gray-800">{qi + 1}. {q.question}</p>
            <div className="grid gap-2.5">
              {q.choices.map((c, ci) => (
                <label 
                  key={ci} 
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all ${
                    answers[qi] === ci 
                      ? 'bg-blue-50 border-blue-400 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === ci}
                    onChange={() => {
                      const next = [...answers];
                      next[qi] = ci;
                      setAnswers(next);
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          className={`rounded-xl px-8 py-3 font-bold text-lg transition-all ${
            canSubmit
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!canSubmit}
          onClick={submit}
        >
          Submit Vote 🚀
        </button>

        {error && <p className="mt-3 text-red-600 font-semibold">{error}</p>}
      </div>

      <div className="mt-10 rounded-2xl border-2 border-gray-200 p-6 bg-gradient-to-br from-white to-gray-50">
        <h3 className="font-bold text-xl mb-2 text-gray-800">📊 Community Results</h3>
        <p className="text-sm text-gray-600 mb-4">Votes are weighted by quiz performance</p>
        
        <div className="mt-4 space-y-3">
          {(() => {
            const total = (data.agreeWeight ?? 0) + (data.disagreeWeight ?? 0);
            const agreePercent = total > 0 ? Math.round(((data.agreeWeight ?? 0) / total) * 100) : 0;
            const disagreePercent = total > 0 ? Math.round(((data.disagreeWeight ?? 0) / total) * 100) : 0;
            
            return (
              <>
                <div className="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👍</span>
                    <span className="font-semibold text-lg text-gray-700">Agree</span>
                  </div>
                  <span className="text-3xl font-bold text-green-600">{agreePercent}%</span>
                </div>
                
                <div className="flex items-center justify-between bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👎</span>
                    <span className="font-semibold text-lg text-gray-700">Disagree</span>
                  </div>
                  <span className="text-3xl font-bold text-red-600">{disagreePercent}%</span>
                </div>
                
                <div className="pt-3 border-t-2 text-sm text-gray-600 text-center">
                  Total votes: <b className="text-gray-800">{data.totalVotes}</b>
                </div>
              </>
            );
          })()}
        </div>

        {result && (
          <div className="mt-5 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 p-4">
            <div className="text-base font-semibold text-gray-800">
              🏅 Your weight: <span className="text-orange-600">{result.weightAwarded.toFixed(2)}</span> 
              <span className="text-sm text-gray-600 ml-2">(Correct {result.correctCount}/{result.totalQuestions})</span>
            </div>
          </div>
        )}
      </div>

      {data.summary && (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <h4 className="font-semibold mb-2">Top Reasons — For</h4>
            <ul className="list-disc pl-5 space-y-1">
              {data.summary.forReasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border p-4">
            <h4 className="font-semibold mb-2">Top Reasons — Against</h4>
            <ul className="list-disc pl-5 space-y-1">
              {data.summary.againstReasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
