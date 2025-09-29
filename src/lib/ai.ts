export async function generateQuizForStatement(text: string, apiKey = process.env.OPENAI_API_KEY) {
  if (!apiKey) {
    console.warn("Missing OPENAI_API_KEY - returning mock quiz data");
    return [
      {
        question: "What is the main point being discussed?",
        choices: [
          "The opposite of the statement",
          "The exact statement",
          "Something unrelated",
          "None of the above"
        ],
        answerIndex: 1
      }
    ];
  }
  const body = {
    model: "gpt-4-turbo-preview",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You produce 2–3 multiple-choice questions to verify comprehension of a short opinion statement. Return JSON { quiz: [{ question, choices: string[4], answerIndex }] } ONLY.",
      },
      { role: "user", content: `Statement: ${text}` },
    ],
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return parsed?.quiz ?? [];
}

export async function summarizeReasons(text: string, apiKey = process.env.OPENAI_API_KEY) {
  if (!apiKey) {
    console.warn("Missing OPENAI_API_KEY - returning mock summary data");
    return {
      forReasons: ["This is a placeholder reason in favor"],
      againstReasons: ["This is a placeholder reason against"]
    };
  }
  const body = {
    model: "gpt-4-turbo-preview",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Given an opinion statement, produce concise bullet-point reasons for both sides. Return JSON { forReasons: string[], againstReasons: string[] } ONLY.",
      },
      { role: "user", content: `Statement: ${text}` },
    ],
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return parsed ?? { forReasons: [], againstReasons: [] };
}