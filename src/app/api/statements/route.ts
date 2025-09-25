import { NextResponse } from "next/server";
import { db, computeBalance } from "@/lib/data";

export async function GET() {
  const items = db.statements.map(s => ({ ...s, balanceScore: computeBalance(s) }));

  const mostPopular = [...items].sort((a, b) => b.totalVotes - a.totalVotes).slice(0, 20);
  const fiftyFifty  = [...items].sort((a, b) => (b.balanceScore! - a.balanceScore!)).slice(0, 20);
  const newHot      = [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 20);

  return NextResponse.json({ mostPopular, fiftyFifty, newHot });
}
