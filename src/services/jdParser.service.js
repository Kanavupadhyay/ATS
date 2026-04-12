import { groq } from "../config/groq.js";

export const parseJD = async (jdText) => {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "Extract structured JSON from job descriptions.",
      },
      {
        role: "user",
        content: `
You are an ATS system.

IMPORTANT:
- Return ONLY valid JSON
- Do NOT add any explanation
- Do NOT add text before or after JSON

Return format:
{
  "mustHaveSkills": string[],
  "niceToHaveSkills": string[],
  "experience": { "min": number, "max": number },
  "keywords": string[],
  "role": string
}


JD:
${jdText}
`,
      },
    ],
    temperature: 0.2,
  });

  return JSON.parse(res.choices[0].message.content);
};