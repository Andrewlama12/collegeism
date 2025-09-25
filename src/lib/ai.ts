export async function generateQuizForStatement(text: string, apiKey = process.env.OPENAI_API_KEY) {
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
  const body = {
    model: "gpt-4o-mini",
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
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
  const body = {
    model: "gpt-4o-mini",
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