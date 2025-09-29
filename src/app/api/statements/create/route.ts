import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateQuizForStatement, summarizeReasons } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid statement text" }, { status: 400 });
    }

    // Remove any surrounding quotes from the text
    const cleanText = text.trim().replace(/^["']|["']$/g, "");

    // Generate quiz and summary using AI
    const [quiz, summary] = await Promise.all([
      generateQuizForStatement(cleanText),
      summarizeReasons(cleanText)
    ]);

    // Create the statement
    const { data: statement, error: statementError } = await supabase
      .from('statements')
      .insert([{ text: cleanText }])
      .select()
      .single();

    if (statementError) throw statementError;
    if (!statement) throw new Error('Failed to create statement');

    // Create quizzes
    const { error: quizError } = await supabase
      .from('quiz')
      .insert(
        quiz.map((q: any) => ({
          statement_id: statement.id,
          question: q.question,
          choices: q.choices,
          answer_index: q.answerIndex,
        }))
      );

    if (quizError) throw quizError;

    // Create summary
    const { error: summaryError } = await supabase
      .from('summary')
      .insert([{
        statement_id: statement.id,
        for_reasons: summary?.forReasons ?? [],
        against_reasons: summary?.againstReasons ?? []
      }]);

    if (summaryError) throw summaryError;

    // Fetch the complete statement with relations
    const { data: completeStatement, error: fetchError } = await supabase
      .from('statements')
      .select(`
        *,
        quiz (*),
        summary (*)
      `)
      .eq('id', statement.id)
      .single();

    if (fetchError) throw fetchError;
    if (!completeStatement) throw new Error('Failed to fetch complete statement');

    return NextResponse.json({ 
      ok: true, 
      statement: {
        id: completeStatement.id,
        text: completeStatement.text,
        createdAt: completeStatement.created_at,
        totalVotes: completeStatement.total_votes,
        agreeWeight: completeStatement.agree_weight,
        disagreeWeight: completeStatement.disagree_weight,
        quiz: completeStatement.quiz?.map((q: { id: string; question: string; choices: string[]; answer_index: number }) => ({
          id: q.id,
          question: q.question,
          choices: q.choices,
          answerIndex: q.answer_index,
        })) || [],
        summary: completeStatement.summary?.[0] ? {
          forReasons: completeStatement.summary[0].for_reasons,
          againstReasons: completeStatement.summary[0].against_reasons,
        } : undefined
      }
    });
  } catch (error) {
    console.error("Error creating statement:", error);
    return NextResponse.json(
      { error: "Failed to create statement" }, 
      { status: 500 }
    );
  }
}