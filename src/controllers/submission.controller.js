import prisma from "../config/db.js";

//
// 🆕 CREATE SUBMISSION
// (link candidate ↔ job ↔ client ↔ recruiter)
//
export const createSubmission = async (req, res) => {
  try {
    const {
      clientId,
      jobId,
      candidateId,
      userId,
      status,
      score,
      comments
    } = req.body;

    if (!clientId || !jobId || !candidateId || !userId || !status) {
      return res.status(400).json({
        message: "Missing required fields"
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
// 📄 GET ALL SUBMISSIONS
// Supports filtering for ATS pipeline
//
export const getSubmissions = async (req, res) => {
  try {
    const { clientId, jobId, candidateId, status } = req.query;

    const submissions = await prisma.submission.findMany({
      where: {
        ...(clientId && { clientId: Number(clientId) }),
        ...(jobId && { jobId: BigInt(jobId) }),
        ...(candidateId && { candidateId: BigInt(candidateId) }),
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
// 🔍 GET SUBMISSION BY ID
//
export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: {
        id: BigInt(id)
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
// 🔄 UPDATE STATUS (CORE ATS FEATURE)
//
export const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, score, comments } = req.body;

    const updated = await prisma.submission.update({
      where: {
        id: BigInt(id)
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
// ❌ DELETE SUBMISSION
//
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.submission.delete({
      where: {
        id: BigInt(id)
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