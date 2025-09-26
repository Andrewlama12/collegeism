import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuizForStatement, summarizeReasons } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid statement text" }, { status: 400 });
    }

    // Generate quiz and summary using AI
    const [quiz, summary] = await Promise.all([
      generateQuizForStatement(text),
      summarizeReasons(text)
    ]);

    // Create the statement with its relations
    const statement = await prisma.statement.create({
      data: {
        text,
        quiz: {
          create: quiz.map((q: any, i: number) => ({
            question: q.question,
            choices: JSON.stringify(q.choices),
            answerIndex: q.answerIndex,
          }))
        },
        summary: {
          create: {
            forReasons: JSON.stringify(summary?.forReasons ?? []),
            againstReasons: JSON.stringify(summary?.againstReasons ?? [])
          }
        }
      },
      include: {
        quiz: true,
        summary: true
      }
    });

    return NextResponse.json({ 
      ok: true, 
      statement: {
        ...statement,
        createdAt: statement.createdAt.toISOString(),
        quiz: statement.quiz.map(q => ({
          ...q,
          choices: JSON.parse(q.choices)
        })),
        summary: statement.summary ? {
          forReasons: JSON.parse(statement.summary.forReasons),
          againstReasons: JSON.parse(statement.summary.againstReasons)
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