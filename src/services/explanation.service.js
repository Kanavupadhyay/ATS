import { groq } from "../config/groq.js";

export const explainResult = async (jd, candidate, score) => {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `
Explain ATS result:

Score: ${score.finalScore}

JD: ${JSON.stringify(jd)}
Candidate: ${JSON.stringify(candidate)}

Give:
- strengths
- weaknesses
- decision reason
        `,
      },
    ],
  });

  return res.choices[0].message.content;
};