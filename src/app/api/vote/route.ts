import { NextResponse } from "next/server";
import { db } from "@/lib/data";
import { VotePayload } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as VotePayload;
  const st = db.statements.find(s => s.id === body.statementId);
  if (!st) return NextResponse.json({ error: "Statement not found" }, { status: 404 });

  if (!Array.isArray(body.answers) || !st.quiz?.length) {
    return NextResponse.json({ error: "Missing answers or quiz" }, { status: 400 });
  }

  let correct = 0;
  st.quiz.forEach((q, i) => {
    if (body.answers[i] === q.answerIndex) correct += 1;
  });

  let weight = 0;
  if (correct === st.quiz.length) weight = 1.0;
  else if (correct > 0) weight = 0.5;

  st.totalVotes += 1;
  if (body.stance === "agree") st.agreeWeight += weight;
  else st.disagreeWeight += weight;

  const result = {
    weightAwarded: weight,
    correctCount: correct,
    totalQuestions: st.quiz.length,
    tallies: {
      agree: st.agreeWeight,
      disagree: st.disagreeWeight,
      rawVotes: st.totalVotes,
    },
  };

  return NextResponse.json(result);
}
