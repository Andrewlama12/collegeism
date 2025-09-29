import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  try {
    const statements = await store.getStatements();
    return NextResponse.json({ statements });
  } catch (error) {
    console.error('Error in test-statements:', error);
    return NextResponse.json(
      { error: "Failed to fetch test statements" },
      { status: 500 }
    );
  }
}
