export const getGap = (jd, candidate) => {
  const missingSkills = jd.mustHaveSkills.filter(
    s => !candidate.skills.includes(s.toLowerCase())
  );

  return { missingSkills };
};