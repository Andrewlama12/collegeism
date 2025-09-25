export type Statement = {
  id: string;
  text: string;
  createdAt: string;    // ISO
  totalVotes: number;   // raw count
  agreeWeight: number;  // weighted agree sum
  disagreeWeight: number; // weighted disagree sum
  balanceScore?: number; // 1 balanced, 0 lopsided
};

export type QuizQ = {
  id: string;
  question: string;
  choices: string[];
  answerIndex: number;
};

export type StatementWithQuiz = Statement & {
  quiz: QuizQ[];
  summary?: {
    forReasons: string[];
    againstReasons: string[];
  }
};

export type VotePayload = {
  statementId: string;
  stance: "agree" | "disagree";
  answers: number[]; // selected indexes
};