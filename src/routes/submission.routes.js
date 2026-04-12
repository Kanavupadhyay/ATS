import express from "express";

import {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission,
    createCandidateWithSubmission
} from "../controllers/submission.controller.js";
import { evaluateOnly } from "../controllers/ats.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

console.log("SUBMISSION ROUTES LOADED");

//
// 📄 GET ALL SUBMISSIONS (pipeline view)
// ADMIN + RECRUITER
//
router.get(
  "/",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  getSubmissions
);

//
// 🔍 GET SINGLE SUBMISSION
//
router.get(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  getSubmissionById
);

//
// 🆕 CREATE SUBMISSION (apply candidate to job)
//
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  upload.single("resume"),
  createCandidateWithSubmission
);

//
// 🔄 UPDATE STATUS (core ATS flow)
// APPLIED → SHORTLISTED → INTERVIEW → OFFERED → HIRED
//
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  updateSubmissionStatus
);

//
// ❌ DELETE SUBMISSION
//
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  deleteSubmission
);

//
// 🧠 AI EVALUATION (PRE-SCREENING ONLY)
// NO DB WRITE
//
router.post(
  "/evaluate",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  upload.single("resume"), // 🔥 Accept resume file for evaluation
  evaluateOnly
);



export default router;