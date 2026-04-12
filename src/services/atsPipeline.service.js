import { parseJD } from "./jdParser.service.js";
import { parseResume } from "./resumeParser.service.js";
import { calculateScore } from "../engines/scoring.engine.js";
import { getGap } from "../engines/gap.engine.js";
import { explainResult } from "./explanation.service.js";
import { llmScore } from "./llmScoring.service.js"; // 🆕

export const evaluateCandidate = async (jdText, resumeText) => {
  // 1. AI extraction
  const jd = await parseJD(jdText);
  const candidate = await parseResume(resumeText);

  // 2. RULE-BASED SCORE
  const systemScore = calculateScore(jd, candidate);

  // 3. LLM SCORE (semantic understanding)
  const llm = await llmScore(jdText, resumeText);

  // 4. FINAL HYBRID SCORE
  const finalScore = Math.round(
    0.6 * systemScore.finalScore + 0.4 * llm.score
  );

  // 5. GAP (prefer LLM gaps if available)
  const gap = {
    missingSkills: llm.missingSkills || getGap(jd, candidate).missingSkills
  };

  // 6. EXPLANATION (LLM is better here)
  const explanation = llm.reason;

  return {
    jd,
    candidate,
    score: {
      finalScore,
      systemScore: systemScore.finalScore,
      llmScore: llm.score
    },
    gap,
    strengths: llm.strengths,
    explanation
  };
};