import prisma from "../config/db.js";
import { evaluateCandidate } from "../services/atsPipeline.service.js";

export const evaluateOnly = async (req, res) => {
  try {
    const { jobId, resumeText } = req.body;

    if (!jobId || !resumeText) {
      return res.status(400).json({
        message: "jobId and resumeText are required"
      });
    }

    // get job only
    const job = await prisma.job.findUnique({
      where: { id: BigInt(jobId) }
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    // 🔥 NO candidate fetch
    const result = await evaluateCandidate(
      job.description,
      resumeText
    );

    return res.status(200).json({
      message: "AI evaluation completed",
      data: result
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Evaluation failed"
    });
  }
};