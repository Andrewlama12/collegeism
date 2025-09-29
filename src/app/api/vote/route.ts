import { NextResponse } from "next/server";
import { getStatementById } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { VotePayload } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VotePayload;
    
    // Fetch the statement with quiz
    const statement = await getStatementById(body.statementId);
    
    if (!statement) {
      return NextResponse.json({ error: "Statement not found" }, { status: 404 });
    }

    if (!Array.isArray(body.answers) || !statement.quiz?.length) {
      return NextResponse.json({ error: "Missing answers or quiz" }, { status: 400 });
    }

    // Calculate correct answers
    let correct = 0;
    statement.quiz.forEach((q, i) => {
      if (body.answers[i] === q.answerIndex) correct += 1;
    });

    // Calculate weight based on correct answers
    let weight = 0;
    if (correct === statement.quiz.length) weight = 1.0;
    else if (correct > 0) weight = 0.5;

    // Update the statement in Supabase
    const newTotalVotes = statement.totalVotes + 1;
    const newAgreeWeight = body.stance === "agree" 
      ? statement.agreeWeight + weight 
      : statement.agreeWeight;
    const newDisagreeWeight = body.stance === "disagree" 
      ? statement.disagreeWeight + weight 
      : statement.disagreeWeight;

    const { error: updateError } = await supabase
      .from('statements')
      .update({
        total_votes: newTotalVotes,
        agree_weight: newAgreeWeight,
        disagree_weight: newDisagreeWeight,
      })
      .eq('id', body.statementId);

    if (updateError) {
      console.error('Error updating statement:', updateError);
      return NextResponse.json({ error: "Failed to update vote" }, { status: 500 });
    }

    const result = {
      weightAwarded: weight,
      correctCount: correct,
      totalQuestions: statement.quiz.length,
      tallies: {
        agree: newAgreeWeight,
        disagree: newDisagreeWeight,
        rawVotes: newTotalVotes,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
