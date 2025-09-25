export type Statement = {
  id: string;
  text: string;
  createdAt: string;    // ISO
  totalVotes: number;   // raw count
  agreeWeight: number;  // weighted agree sum
  disagreeWeight: number; // weighted disagree sum
  // balance metric cached for the "50/50" lane
  balanceScore?: number; // 1 is perfectly balanced, 0 is lopsided
};

export type QuizQ = {
  id: string;
  question: string;
  choices: string[];
  answerIndex: number;
};

export type StatementWithQuiz = Statement & {
  quiz: QuizQ[]; // 2–3 questions
  summary?: {
    forReasons: string[];
    againstReasons: string[];
  }
};

export type VotePayload = {
  statementId: string;
  stance: "agree" | "disagree";
  answers: number[]; // selected indexes matching quiz order
};
