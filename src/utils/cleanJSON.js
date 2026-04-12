export const extractJSON = (raw) => {
  if (!raw) throw new Error("Empty AI response");

  // remove ```json ``` and ```
  let cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // extract JSON block
  const match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    console.error("RAW RESPONSE:", raw);
    throw new Error("No valid JSON found");
  }

  try {
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("INVALID JSON:", match[0]);
    throw new Error("JSON parsing failed");
  }
};