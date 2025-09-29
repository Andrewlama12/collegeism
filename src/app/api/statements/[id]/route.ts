import { NextResponse } from "next/server";
import { getStatementById } from "@/lib/data";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const statement = await getStatementById(params.id);
    
    if (!statement) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json(statement);
  } catch (error) {
    console.error('Error fetching statement:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
