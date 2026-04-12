import prisma from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.id; // or req.query.userId

    // 📌 ONLY THIS RECRUITER'S SUBMISSIONS
    const submissions = await prisma.submission.findMany({
      where: { userId }
    });

    const jobs = await prisma.job.findMany({
      where: {
        submissions: {
          some: { userId }
        }
      }
    });

    const candidates = await prisma.candidate.findMany({
      where: {
        submissions: {
          some: { userId }
        }
      }
    });

    const clients = await prisma.client.findMany({
      where: {
        jobs: {
          some: {
            submissions: {
              some: { userId }
            }
          }
        }
      }
    });

    // 📊 PIPELINE COUNT (ONLY THIS USER)
    const pipelineRaw = await prisma.submission.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true }
    });

    const pipeline = {
      APPLIED: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      OFFERED: 0,
      HIRED: 0,
      REJECTED: 0
    };

    pipelineRaw.forEach(p => {
      pipeline[p.status] = p._count.status;
    });

    // 📊 AVG SCORE
    const score = await prisma.submission.aggregate({
      where: { userId },
      _avg: { score: true }
    });

    res.json({
      clients: clients.length,
      jobs: jobs.length,
      candidates: candidates.length,
      submissions: submissions.length,
      pipeline,
      avgScore: score._avg.score || 0
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};