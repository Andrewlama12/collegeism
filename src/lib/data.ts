import { StatementWithQuiz } from "./types";

export const db = {
  statements: [] as StatementWithQuiz[],
};

if (db.statements.length === 0) {
  const now = new Date();
  const s = (hrs: number) => new Date(now.getTime() - hrs * 3600_000).toISOString();

  db.statements.push(
    {
      id: "1",
      text: "Universities should publish all course materials online for free.",
      createdAt: s(4),
      totalVotes: 0,
      agreeWeight: 0,
      disagreeWeight: 0,
      quiz: [
        {
          id: "q1",
          question: "What does the statement propose?",
          choices: [
            "Charge higher tuition for online classes",
            "Publish all course materials online at no cost",
            "Ban online courses",
            "Paywall lecture recordings for alumni only",
          ],
          answerIndex: 1,
        },
        {
          id: "q2",
          question: "Which outcome most closely aligns with the proposal?",
          choices: [
            "Wider access to learning resources",
            "Less transparency for students",
            "Fewer open educational resources",
            "Higher textbook prices",
          ],
          answerIndex: 0,
        },
      ],
      summary: {
        forReasons: ["Equity/access", "Recruitment/branding", "Open knowledge culture"],
        againstReasons: ["IP/quality control", "Instructor workload", "Publisher contracts"],
      },
    },
    {
      id: "2",
      text: "Campus parking should be replaced with green space and microtransit.",
      createdAt: s(2),
      totalVotes: 0,
      agreeWeight: 0,
      disagreeWeight: 0,
      quiz: [
        {
          id: "q1",
          question: "What is the main trade-off described?",
          choices: [
            "Parking revenue vs cafeteria revenue",
            "Parking availability vs green space + microtransit",
            "Dorm capacity vs faculty offices",
            "Stadium seating vs tuition",
          ],
          answerIndex: 1,
        },
        {
          id: "q2",
          question: "Which is NOT a likely effect?",
          choices: [
            "More trees and pedestrian areas",
            "Less on-campus car storage",
            "More last-mile shuttle options",
            "Lower greenhouse gas per rider car trip",
          ],
          answerIndex: 3,
        },
      ],
      summary: {
        forReasons: ["Sustainability", "Walkability & safety", "Campus aesthetics"],
        againstReasons: ["Commuter burden", "Accessibility gaps", "Transition cost"],
      },
    },
    {
      id: "3",
      text: "Professors should be required to publish grading rubrics before assignments.",
      createdAt: s(1),
      totalVotes: 0,
      agreeWeight: 0,
      disagreeWeight: 0,
      quiz: [
        {
          id: "q1",
          question: "What must be published under the proposal?",
          choices: ["Lecture slides", "Grading rubrics", "Class recordings", "Exam keys"],
          answerIndex: 1,
        },
        {
          id: "q2",
          question: "A likely benefit would be:",
          choices: [
            "More arbitrary grading",
            "Less transparency",
            "Clearer expectations for students",
            "Shorter assignments",
          ],
          answerIndex: 2,
        },
      ],
      summary: {
        forReasons: ["Transparency", "Fairness", "Better learning targets"],
        againstReasons: ["Reduced instructor flexibility", "Time cost", "Rubric gaming"],
      },
    }
  );
}

export function computeBalance(st: { agreeWeight: number; disagreeWeight: number }) {
  const a = st.agreeWeight;
  const d = st.disagreeWeight;
  const total = a + d;
  if (total === 0) return 0;
  const ratio = Math.min(a, d) / Math.max(a, d);
  return Number(ratio.toFixed(3));
}