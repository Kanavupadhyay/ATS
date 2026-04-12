import prisma from "../config/db.js";
import axios from "axios"; // 👈 Make sure to import axios
import { evaluateCandidate } from "../services/atsPipeline.service.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";

export const evaluateOnly = async (req, res) => {
  try {
    const jobId = req.body.jobId;
    const file = req.file;

    if (!jobId || !file) {
      return res.status(400).json({ message: "jobId and resume file are required" });
    }

    const job = await prisma.job.findUnique({
      where: { id: BigInt(jobId) },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🚀 STEP 1: Get the Cloudinary URL
    const fileUrl = file.path; 

    // 🚀 STEP 2: Download the file as an arraybuffer (Mirroring Candidate logic)
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer"
    });

    // 🚀 STEP 3: Convert to Uint8Array
    const buffer = new Uint8Array(response.data);

    // 🚀 STEP 4: Pass the buffer to your existing parser
    const resumeText = await extractTextFromPDF(buffer);

    if (!resumeText) {
      return res.status(400).json({ message: "Could not extract resume text" });
    }

    // ✅ AI evaluation
    const result = await evaluateCandidate(
      job.description + " " + job.skills,
      resumeText
    );

    return res.status(200).json({
      message: "AI evaluation completed",
      data: result,
    });

  } catch (err) {
    console.error("Evaluation error:", err);
    return res.status(500).json({ message: "Evaluation failed" });
  }
};