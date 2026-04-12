import {groq} from "../config/groq.js";
import { extractJSON } from "../utils/cleanJSON.js";

export const llmScore = async (jdText, resumeText) => {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `
You are an ATS system.

Evaluate candidate for the job.

Return ONLY JSON:
{
  "score": number (0-100),
  "strengths": string[],
  "missingSkills": string[],
  "reason": string
}

Job Description:
${jdText}

Resume:
${resumeText}
`
      }
    ]
  });

  return extractJSON(res.choices[0].message.content);
};