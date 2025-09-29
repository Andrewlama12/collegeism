import { NextResponse } from "next/server";
import { getTrendingTopics, isTopicRecent } from "@/lib/topics";
import { generateDebateStatement, generateQuizForStatement, summarizeReasons } from "@/lib/ai";
import { store } from "@/lib/store";

export async function POST(request: Request) {
  try {
    // Optional count parameter in request body
    const { count = 3 } = await request.json();
    
    // Get trending topics
    const topics = await getTrendingTopics();
    
    const results = [];
    const errors = [];

    // Process topics until we have enough statements or run out of topics
    for (const topic of topics) {
      if (results.length >= count) break;
      
      try {
        // Skip if topic was recently used
        if (await isTopicRecent(topic.title)) {
          continue;
        }

        // Generate debate statement
        const { statement, relevance, collegeContext } = await generateDebateStatement(topic);
        
        // Generate quiz and summary
        const [quiz, summary] = await Promise.all([
          generateQuizForStatement(statement),
          summarizeReasons(statement)
        ]);

        // Create statement in store
        const newStatement = store.createStatement(statement);

        // Create quizzes
        const quizzes = quiz.map((q: any) => store.createQuiz({
          question: q.question,
          choices: q.choices,
          answerIndex: q.answerIndex,
          statementId: newStatement.id
        }));

        // Create summary
        const summaryRecord = store.createSummary({
          forReasons: summary?.forReasons ?? [],
          againstReasons: summary?.againstReasons ?? [],
          statementId: newStatement.id
        });

        results.push({
          statement: newStatement,
          topic: topic.title,
          relevance,
          collegeContext
        });
      } catch (error) {
        console.error(`Error processing topic "${topic.title}":`, error);
        errors.push({
          topic: topic.title,
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
