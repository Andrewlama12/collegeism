import { prisma } from './prisma';
import { StatementWithQuiz } from './types';

export async function getStatements(): Promise<StatementWithQuiz[]> {
  const statements = await prisma.statement.findMany({
    include: {
      quiz: true,
      summary: true,
    },
  });

  return statements.map(statement => ({
    id: statement.id,
    text: statement.text,
    createdAt: statement.createdAt.toISOString(),
    totalVotes: statement.totalVotes,
    agreeWeight: statement.agreeWeight,
    disagreeWeight: statement.disagreeWeight,
    quiz: statement.quiz.map(q => ({
      id: q.id,
      question: q.question,
      choices: JSON.parse(q.choices),
      answerIndex: q.answerIndex,
    })),
    summary: statement.summary ? {
      forReasons: JSON.parse(statement.summary.forReasons),
      againstReasons: JSON.parse(statement.summary.againstReasons),
    } : undefined,
  }));
}

export function computeBalance(st: { agreeWeight: number; disagreeWeight: number }) {
  const a = st.agreeWeight;
  const d = st.disagreeWeight;
  const total = a + d;
  if (total === 0) return 0;
  const ratio = Math.min(a, d) / Math.max(a, d);
  return Number(ratio.toFixed(3));
}