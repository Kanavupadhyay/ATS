import { groq } from "../config/groq.js";

export const parseResume = async (text) => {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "Extract candidate profile as JSON only.",
      },
      {
        role: "user",
        content: `
  You are an ATS parser.

STRICT RULES:
- Return ONLY JSON
- No markdown
- No explanation
- No backticks

Return format:
{
  "skills": string[],
  "experienceYears": number,
  "projects": string[]
}


Resume:
${text}
        `,
      },
    ],
    temperature: 0.2,
  });

  return JSON.parse(res.choices[0].message.content);
};