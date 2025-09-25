import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const st = db.statements.find(s => s.id === params.id);
  if (!st) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(st);
}
