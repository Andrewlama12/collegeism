export const initialStatements = [
  {
    id: "1",
    text: "College degrees should be free for all students",
    createdAt: new Date().toISOString(),
    totalVotes: 150,
    agreeWeight: 75,
    disagreeWeight: 75,
    quiz: [
      {
        id: "q1",
        question: "What is the main argument being discussed?",
        choices: ["Cost of college education", "Quality of education", "Length of degree programs", "Campus facilities"],
        answerIndex: 0,
        statementId: "1"
      }
    ],
    summary: {
      id: "s1",
      forReasons: [
        "Education is a fundamental right",
        "Reduces student debt burden",
        "Increases economic mobility"
      ],
      againstReasons: [
        "High cost to taxpayers",
        "May decrease education value perception",
        "Could lead to overcrowding"
      ],
      statementId: "1"
    }
  },
  {
    id: "2",
    text: "Online learning should completely replace traditional classrooms",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    totalVotes: 200,
    agreeWeight: 80,
    disagreeWeight: 120,
    quiz: [
      {
        id: "q2",
        question: "What type of learning environment is being compared?",
        choices: ["Online vs Traditional", "Group vs Individual", "Practical vs Theoretical", "Short vs Long-term"],
        answerIndex: 0,
        statementId: "2"
      }
    ],
    summary: {
      id: "s2",
      forReasons: [
        "Greater flexibility and accessibility",
        "Cost-effective for institutions",
        "Leverages modern technology"
      ],
      againstReasons: [
        "Lacks face-to-face interaction",
        "Requires self-discipline",
        "Technical barriers for some students"
      ],
      statementId: "2"
    }
  },
  {
    id: "3",
    text: "Standardized testing should be eliminated from college admissions",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    totalVotes: 300,
    agreeWeight: 200,
    disagreeWeight: 100,
    quiz: [
      {
        id: "q3",
        question: "What aspect of college admissions is being questioned?",
        choices: ["Standardized testing", "GPA requirements", "Extracurricular activities", "Letters of recommendation"],
        answerIndex: 0,
        statementId: "3"
      }
    ],
    summary: {
      id: "s3",
      forReasons: [
        "Reduces bias against disadvantaged students",
        "Better indicators of success exist",
        "Decreases test anxiety"
      ],
      againstReasons: [
        "Provides objective comparison metric",
        "Standardized measurement needed",
        "May increase importance of subjective factors"
      ],
      statementId: "3"
    }
  },
  {
    id: "4",
    text: "Universities should require all students to take coding courses",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    totalVotes: 50,
    agreeWeight: 35,
    disagreeWeight: 15,
    quiz: [
      {
        id: "q4",
        question: "What curriculum change is being proposed?",
        choices: ["Mandatory coding courses", "Optional coding courses", "Removing coding courses", "Advanced coding only"],
        answerIndex: 0,
        statementId: "4"
      }
    ],
    summary: {
      id: "s4",
      forReasons: [
        "Digital literacy is essential in modern world",
        "Develops logical thinking skills",
        "Improves job prospects"
      ],
      againstReasons: [
        "Not relevant for all career paths",
        "May overburden non-technical students",
        "Limited course time available"
      ],
      statementId: "4"
    }
  },
  {
    id: "5",
    text: "College athletes should be paid a salary",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    totalVotes: 400,
    agreeWeight: 200,
    disagreeWeight: 200,
    quiz: [
      {
        id: "q5",
        question: "What compensation model is being discussed?",
        choices: ["Direct salary payments", "Scholarship increases", "Performance bonuses", "Equipment allowances"],
        answerIndex: 0,
        statementId: "5"
      }
    ],
    summary: {
      id: "s5",
      forReasons: [
        "Athletes generate significant revenue",
        "Compensates for time commitment",
        "Helps with living expenses"
      ],
      againstReasons: [
        "Maintains amateur status",
        "Could create unfair advantages",
        "May impact team dynamics"
      ],
      statementId: "5"
    }
  },
  {
    id: "6",
    text: "Every college student should study abroad for at least one semester",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    totalVotes: 250,
    agreeWeight: 175,
    disagreeWeight: 75,
    quiz: [
      {
        id: "q6",
        question: "What educational requirement is being proposed?",
        choices: ["Mandatory study abroad", "Optional study abroad", "Virtual international programs", "Local cultural programs"],
        answerIndex: 0,
        statementId: "6"
      }
    ],
    summary: {
      id: "s6",
      forReasons: [
        "Broadens cultural perspectives",
        "Improves language skills",
        "Develops independence"
      ],
      againstReasons: [
        "High cost burden",
        "May delay graduation",
        "Not feasible for all students"
      ],
      statementId: "6"
    }
  },
  {
    id: "7",
    text: "Colleges should eliminate traditional letter grades",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    totalVotes: 10,
    agreeWeight: 3,
    disagreeWeight: 7,
    quiz: [
      {
        id: "q7",
        question: "What grading system change is being proposed?",
        choices: ["Eliminating letter grades", "Adding more grade levels", "Keeping current system", "Mixed grading approach"],
        answerIndex: 0,
        statementId: "7"
      }
    ],
    summary: {
      id: "s7",
      forReasons: [
        "Reduces academic stress",
        "Focuses on learning not scoring",
        "Better reflects real-world evaluation"
      ],
      againstReasons: [
        "Makes comparison difficult",
        "May reduce motivation",
        "Employers prefer clear metrics"
      ],
      statementId: "7"
    }
  },
  {
    id: "8",
    text: "College textbooks should be replaced with open-source digital materials",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    totalVotes: 180,
    agreeWeight: 150,
    disagreeWeight: 30,
    quiz: [
      {
        id: "q8",
        question: "What change to course materials is being suggested?",
        choices: ["Open-source digital materials", "Traditional textbooks", "Mixed resources", "Custom publications"],
        answerIndex: 0,
        statementId: "8"
      }
    ],
    summary: {
      id: "s8",
      forReasons: [
        "Reduces student costs",
        "More accessible and updateable",
        "Environmentally friendly"
      ],
      againstReasons: [
        "Quality control concerns",
        "Screen fatigue issues",
        "Internet access required"
      ],
      statementId: "8"
    }
  }
];