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
        const newStatement = await store.createStatement(topic.text);

        // Create quizzes
        await Promise.all(quiz.map((q: { question: string; choices: string[]; answer_index: number }) => store.createQuiz({
          question: q.question,
          choices: q.choices,
          answer_index: q.answer_index,
          statement_id: newStatement.id
        })).then((results: { data: any; error: any }[]) => {
          for (const result of results) {
            if (result.error) throw result.error;
          }
        }));

        // Create summary
        await store.createSummary({
          for_reasons: summary?.for_reasons ?? [],
          against_reasons: summary?.against_reasons ?? [],
          statement_id: newStatement.id
        }).then(result => {
          if (result.error) throw result.error;
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
