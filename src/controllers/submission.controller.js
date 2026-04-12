import prisma from "../config/db.js";
import axios from "axios";
import { evaluateCandidate } from "../services/atsPipeline.service.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
//
// 🆕 CREATE SUBMISSION (SECURE)
//
export const createSubmission = async (req, res) => {
  try {
    const {
      clientId,
      jobId,
      candidateId,
      status,
      score,
      comments
    } = req.body;

    const userId = req.user.id; // 🔥 NEVER trust frontend

    if (!clientId || !jobId || !candidateId || !status) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // 🔥 VERIFY JOB OWNERSHIP
    const job = await prisma.job.findFirst({
      where: {
        id: BigInt(jobId),
        createdBy: BigInt(userId)
      }
    });

    if (!job) {
      return res.status(403).json({
        message: "Unauthorized job access"
      });
    }

    // 🔥 VERIFY CANDIDATE OWNERSHIP
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: BigInt(candidateId),
        createdBy: BigInt(userId)
      }
    });

    if (!candidate) {
      return res.status(403).json({
        message: "Unauthorized candidate access"
      });
    }

    const submission = await prisma.submission.create({
      data: {
        clientId: Number(clientId),
        jobId: BigInt(jobId),
        candidateId: BigInt(candidateId),
        userId: BigInt(userId),

        status,
        score: score ? Number(score) : 0,
        comments: comments || ""
      }
    });

    return res.status(201).json({
      message: "Submission created successfully",
      data: submission
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to create submission"
    });
  }
};

//
// 📄 GET ALL SUBMISSIONS (RECRUITER SCOPED)
//
export const getSubmissions = async (req, res) => {
  try {
    const { jobId, status } = req.query;
    const userId = req.user.id;

    const submissions = await prisma.submission.findMany({
      where: {
        userId: BigInt(userId), // 🔥 IMPORTANT FIX

        ...(jobId && {
          jobId: BigInt(jobId)
        }),

        ...(status && { status })
      },
      orderBy: {
        createdOn: "desc"
      },
      include: {
        client: true,
        job: true,
        candidate: true,
        user: true
      }
    });

    return res.status(200).json({
      data: submissions
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch submissions"
    });
  }
};

//
// 🔍 GET SUBMISSION BY ID (SECURED)
//
export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const submission = await prisma.submission.findFirst({
      where: {
        id: BigInt(id),
        userId: BigInt(userId)
      },
      include: {
        client: true,
        job: true,
        candidate: true,
        user: true
      }
    });

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found"
      });
    }

    return res.status(200).json({
      data: submission
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch submission"
    });
  }
};

//
// 🔄 UPDATE STATUS (SECURED ATS FLOW)
//
export const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, score, comments } = req.body;
    const userId = req.user.id;

    const updated = await prisma.submission.updateMany({
      where: {
        id: BigInt(id),
        userId: BigInt(userId)
      },
      data: {
        ...(status && { status }),
        ...(score !== undefined && { score: Number(score) }),
        ...(comments && { comments })
      }
    });

    return res.status(200).json({
      message: "Submission updated successfully",
      data: updated
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update submission"
    });
  }
};

//
// ❌ DELETE SUBMISSION (SECURED)
//
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.submission.deleteMany({
      where: {
        id: BigInt(id),
        userId: BigInt(userId)
      }
    });

    return res.status(200).json({
      message: "Submission deleted successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to delete submission"
    });
  }
};

export const createCandidateWithSubmission = async (req, res) => {
  try {
    
    //const { name, email, mobNo, currentCompany, jobId } = req.body;
    const name=req.body.name;
    const email=req.body.email;
    const mobNo=req.body.mobNo;
    const currentCompany=req.body.currentCompany;
    const jobId=req.body.jobId;
    //console.log("Received data:", { name, email, mobNo, currentCompany, jobId, file: req.file });
    const userId = req.user.id;
    
    if (!name || !email || !mobNo || !req.file || !jobId) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const job = await prisma.job.findFirst({
      where: {
        id: BigInt(jobId),
        createdBy: BigInt(userId)
      }
    });

    if (!job) {
      return res.status(403).json({
        message: "Unauthorized job access"
      });
    }

    // 🔥 TRANSACTION START
    const result = await prisma.$transaction(async (tx) => {

      // ✅ Create candidate
      const fileUrl = req.file.path;

      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer"
      });

      const buffer = new Uint8Array(response.data);
      const extractedText = await extractTextFromPDF(buffer);
      console.log("Extracted Resume Text:", extractedText); // DEBUG
      // 🔥 CALL AI EVALUATION
      const evaluation = await evaluateCandidate(
        job.description,
        extractedText
      );

      console.log("EVALUATION:", evaluation); // DEBUG

      const candidate = await tx.candidate.create({
        data: {
          createdBy: BigInt(userId),
          name,
          email,
          mobNo,
          currentCompany,
          resume: fileUrl,
          parsedResumeText: extractedText,

          // ✅ FIX HERE
          skills: evaluation?.candidate?.skills?.join(", ") || "",

          // ✅ ALSO FIX THIS (you already have data!)
          experience: evaluation?.candidate?.experienceYears || 0
        }
      });

      // 🔥 USE EVALUATION OUTPUT
      const submission = await tx.submission.create({
        data: {
          clientId: job.clientId,
          jobId: BigInt(jobId),
          candidateId: candidate.id,
          userId: BigInt(userId),

          status: "APPLIED",
          score: evaluation?.score?.finalScore || 0,   // 🔥 FIX
          comments: evaluation?.explanation || ""      // 🔥 FIX
        }
      });

      return { candidate, submission ,evaluation};
    });

    return res.status(201).json({
      message: "Candidate + Submission created",
      data: result
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to create candidate + submission"
    });
  }
};