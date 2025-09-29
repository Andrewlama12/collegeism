import { NextResponse } from "next/server";
import { DEBATE_TOPICS, isTopicRecent } from "@/lib/topics";
import { generateQuizForStatement, summarizeReasons } from "@/lib/ai";
import { store } from "@/lib/store";

export async function POST(request: Request) {
  try {
    // Optional count parameter in request body
    const { count = 3 } = await request.json();
    
    const results = [];
    const errors = [];

    // Process topics until we have enough statements or run out of topics
    for (const topic of DEBATE_TOPICS) {
      if (results.length >= count) break;
      
      try {
        // Skip if topic was recently used
        if (await isTopicRecent(topic.text)) {
          continue;
        }
        
        // Generate quiz and summary
        const [quiz, summary] = await Promise.all([
          generateQuizForStatement(topic.text),
          summarizeReasons(topic.text)
        ]);

        // Create statement in store
        const newStatement = store.createStatement(topic.text);

        // Create quizzes
        quiz.map((q: any) => store.createQuiz({
          question: q.question,
          choices: q.choices,
          answer_index: q.answerIndex,
          statement_id: newStatement.id
        }));

        // Create summary
        store.createSummary({
          for_reasons: summary?.forReasons ?? [],
          against_reasons: summary?.againstReasons ?? [],
          statement_id: newStatement.id
        });

        results.push({
          statement: newStatement,
          topic: topic.text,
          category: topic.category
        });
      } catch (error) {
        console.error(`Error processing topic "${topic.text}":`, error);
        errors.push({
          topic: topic.text,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      generated: results.length,
      statements: results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in generate-statements:', error);
    return NextResponse.json(
      { error: "Failed to generate statements" },
      { status: 500 }
    );
  }
}
