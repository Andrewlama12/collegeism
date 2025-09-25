"use client";

import { useEffect, useMemo, useState, use } from "react";
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

export default function StatementPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
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
        const res = await fetch(`/api/statements/${resolvedParams.id}`);
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
  }, [resolvedParams.id]);

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

    const ref = await fetch(`/api/statements/${resolvedParams.id}`).catch(() => null);
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
        className="inline-block mb-6 text-sm hover:underline"
      >
        ← Back to Home
      </Link>
      <h1 className="text-2xl font-semibold mb-3">Statement</h1>
      <p className="leading-7">{data.text}</p>

      <div className="mt-6 flex gap-3">
        <button
          className={`rounded-2xl border px-4 py-2 ${stance==="agree" ? "bg-black text-white" : ""}`}
          onClick={() => setStance("agree")}
        >
          Agree
        </button>
        <button
          className={`rounded-2xl border px-4 py-2 ${stance==="disagree" ? "bg-black text-white" : ""}`}
          onClick={() => setStance("disagree")}
        >
          Disagree
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-2">Comprehension Check</h2>
        {data.quiz?.map((q, qi) => (
          <div key={q.id} className="mb-5 rounded-2xl border p-4">
            <p className="font-medium mb-2">{qi + 1}. {q.question}</p>
            <div className="grid gap-2">
              {q.choices.map((c, ci) => (
                <label key={ci} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === ci}
                    onChange={() => {
                      const next = [...answers];
                      next[qi] = ci;
                      setAnswers(next);
                    }}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          className="rounded-2xl border px-4 py-2 disabled:opacity-50"
          disabled={!canSubmit}
          onClick={submit}
        >
          Submit vote
        </button>

        {error && <p className="mt-3 text-red-600">{error}</p>}
      </div>

      <div className="mt-10 rounded-2xl border p-4">
        <h3 className="font-semibold mb-2">Community Results (Weighted)</h3>
        <p className="text-sm opacity-70 mb-2">Votes are weighted by quiz performance.</p>
        <div className="text-sm">
          <div>Agree weight: <b>{(data.agreeWeight ?? 0).toFixed(2)}</b></div>
          <div>Disagree weight: <b>{(data.disagreeWeight ?? 0).toFixed(2)}</b></div>
          <div>Raw votes: <b>{data.totalVotes}</b></div>
        </div>

        {result && (
          <div className="mt-4 rounded-xl bg-gray-50 p-3 text-sm">
            <div>🏅 Your weight: <b>{result.weightAwarded.toFixed(2)}</b> (Correct {result.correctCount}/{result.totalQuestions})</div>
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
