import { supabase as db } from './supabase';
export { db };
import { StatementWithQuiz } from './types';

export async function getStatements(): Promise<StatementWithQuiz[]> {
  try {
    const { data: statements, error } = await db
      .from('statements')
      .select(`
        *,
        quiz (
          id,
          question,
          choices,
          answer_index
        ),
        summary (
          for_reasons,
          against_reasons
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Failed to fetch statements: ${error.message}`);
    }
    
    if (!statements) {
      console.log('No statements found, returning empty array');
      return [];
    }

    return statements.map(statement => ({
      id: statement.id,
      text: statement.text,
      createdAt: statement.created_at,
      totalVotes: statement.total_votes,
      agreeWeight: statement.agree_weight,
      disagreeWeight: statement.disagree_weight,
      quiz: statement.quiz?.map((q: { id: string; question: string; choices: string[]; answer_index: number }) => ({
        id: q.id,
        question: q.question,
        choices: q.choices,
        answerIndex: q.answer_index,
      })) || [],
      summary: statement.summary?.[0] ? {
        forReasons: statement.summary[0].for_reasons,
        againstReasons: statement.summary[0].against_reasons,
      } : undefined
    }));
  } catch (error) {
    console.error('Error in getStatements:', error);
    throw error;
  }
}

export async function getStatementById(id: string): Promise<StatementWithQuiz | null> {
  try {
    const { data: statement, error } = await db
      .from('statements')
      .select(`
        *,
        quiz (
          id,
          question,
          choices,
          answer_index
        ),
        summary (
          for_reasons,
          against_reasons
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      return null;
    }
    
    if (!statement) {
      return null;
    }

    return {
      id: statement.id,
      text: statement.text,
      createdAt: statement.created_at,
      totalVotes: statement.total_votes,
      agreeWeight: statement.agree_weight,
      disagreeWeight: statement.disagree_weight,
      quiz: statement.quiz?.map((q: { id: string; question: string; choices: string[]; answer_index: number }) => ({
        id: q.id,
        question: q.question,
        choices: q.choices,
        answerIndex: q.answer_index,
      })) || [],
      summary: statement.summary?.[0] ? {
        forReasons: statement.summary[0].for_reasons,
        againstReasons: statement.summary[0].against_reasons,
      } : undefined
    };
  } catch (error) {
    console.error('Error in getStatementById:', error);
    return null;
  }
}

export function computeBalance(st: { agreeWeight: number; disagreeWeight: number }) {
  const a = st.agreeWeight;
  const d = st.disagreeWeight;
  const total = a + d;
  if (total === 0) return 0;
  const ratio = Math.min(a, d) / Math.max(a, d);
  return Number(ratio.toFixed(3));
}