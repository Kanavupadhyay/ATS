export const calculateScore = (jd, candidate) => {
  const normalize = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]/g, "");

  const jdSkills = jd.mustHaveSkills.map(normalize);
  const candidateSkills = candidate.skills.map(normalize);

  // synonym map (VERY IMPORTANT)
  const synonyms = {
    machinelearning: ["ml"],
    ml: ["machinelearning"],
    datascience: ["dataanalysis"],
  };

  const isMatch = (skill) => {
    if (candidateSkills.includes(skill)) return true;

    if (synonyms[skill]) {
      return synonyms[skill].some(s => candidateSkills.includes(s));
    }

    return candidateSkills.some(cs => cs.includes(skill));
  };

  const matched = jdSkills.filter(isMatch);

  const skillScore = (matched.length / jdSkills.length) * 100;

  // experience scoring
  const minExp = jd.experience?.min || 0;
  let expScore = 100;

  if (candidate.experienceYears < minExp) {
    expScore = 60;
  }

  const finalScore = 0.6 * skillScore + 0.4 * expScore;

  return {
    finalScore: Math.round(finalScore),
    skillScore: Math.round(skillScore),
    expScore
  };
};