import prisma from "../config/db.js";
import axios from "axios";
import { extractTextFromPDF } from "../utils/pdfParser.js";

//
// 🆕 CREATE CANDIDATE (UPLOAD + PARSE RESUME)
//
export const createCandidate = async (req, res) => {
  try {
    const { name, email, mobNo, currentCompany } = req.body;

    if (!name || !email || !mobNo || !req.file) {
      return res.status(400).json({
        message: "Missing required fields (including resume PDF)"
      });
    }

    // 🔥 Check duplicate
    const existing = await prisma.candidate.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(400).json({
        message: "Candidate already exists"
      });
    }

    // 🔥 Cloudinary file URL
    const fileUrl = req.file.path;

    // 🔥 Download PDF
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer"
    });

    const buffer = new Uint8Array(response.data);

    // 🔥 Extract text from PDF
    const extractedText = await extractTextFromPDF(buffer);

    // 🔥 Save to DB
    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        mobNo,
        currentCompany,
        resume: fileUrl,
        parsedResumeText: extractedText,
        skills: "",
        experience: 0
      }
    });

    return res.status(201).json({
      message: "Candidate created successfully",
      data: candidate
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to create candidate"
    });
  }
};

//
// 📄 GET ALL CANDIDATES
//
export const getCandidates = async (req, res) => {
  try {
    const { search, skills, experience } = req.query;

    const candidates = await prisma.candidate.findMany({
      where: {
        ...(skills && {
          skills: {
            contains: skills,
            mode: "insensitive"
          }
        }),
        ...(experience && {
          experience: Number(experience)
        }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { currentCompany: { contains: search, mode: "insensitive" } },
            { skills: { contains: search, mode: "insensitive" } }
          ]
        })
      },
      orderBy: {
        createdOn: "desc"
      },
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });

    return res.status(200).json({
      data: candidates
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch candidates"
    });
  }
};

//
// 🔍 GET CANDIDATE BY ID
//
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id: BigInt(id) },
      include: {
        submissions: true
      }
    });

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    return res.status(200).json({
      data: candidate
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch candidate"
    });
  }
};

//
// ✏️ UPDATE CANDIDATE (OPTIONAL RESUME REUPLOAD)
//
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      mobNo,
      currentCompany,
      skills,
      experience
    } = req.body;

    let updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(mobNo && { mobNo }),
      ...(currentCompany && { currentCompany }),
      ...(skills && { skills }),
      ...(experience !== undefined && { experience: Number(experience) })
    };

    // 🔥 If new resume uploaded
    if (req.file) {
      const fileUrl = req.file.path;

      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer"
      });

      const buffer = new Uint8Array(response.data);

      const extractedText = await extractTextFromPDF(buffer);

      updateData.resume = fileUrl;
      updateData.parsedResumeText = extractedText;
    }

    const candidate = await prisma.candidate.update({
      where: { id: BigInt(id) },
      data: updateData
    });

    return res.status(200).json({
      message: "Candidate updated successfully",
      data: candidate
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update candidate"
    });
  }
};

//
// ❌ DELETE CANDIDATE
//
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.candidate.delete({
      where: { id: BigInt(id) }
    });

    return res.status(200).json({
      message: "Candidate deleted successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to delete candidate"
    });
  }
};