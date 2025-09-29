import { NextResponse } from "next/server";
import { getStatementById } from "@/lib/data";
import { generateQuizForStatement, summarizeReasons } from "@/lib/ai";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const st = await getStatementById(params.id);
  if (!st) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const quiz = await generateQuizForStatement(st.text);
  const summary = await summarizeReasons(st.text);

  if (Array.isArray(quiz) && quiz.length >= 2) {
    st.quiz = quiz.map((q: { question: string; choices: string[]; answerIndex: number }, i: number) => ({
      id: `q${i + 1}`,
      question: q.question,
      choices: q.choices,
      answerIndex: q.answerIndex,
    }));
  }

  st.summary = {
    forReasons: summary?.forReasons ?? [],
    againstReasons: summary?.againstReasons ?? [],
  };

  return NextResponse.json({ ok: true, quizCount: st.quiz.length, summary: st.summary });
}
