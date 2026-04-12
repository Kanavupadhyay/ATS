import express from "express";

import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate
} from "../controllers/candidate.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js"; // 🔥 ADD THIS

const router = express.Router();

console.log("CANDIDATE ROUTES LOADED");

//
// 📄 GET ALL CANDIDATES
//
router.get(
  "/",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  getCandidates
);

//
// 🔍 GET CANDIDATE BY ID
//
router.get(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  getCandidateById
);

//
// 🆕 CREATE CANDIDATE (WITH PDF UPLOAD)
//
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  upload.single("resume"), // 🔥 IMPORTANT
  createCandidate
);

//
// ✏️ UPDATE CANDIDATE (OPTIONAL PDF UPDATE)
//
router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  upload.single("resume"), // 🔥 IMPORTANT
  updateCandidate
);

//
// ❌ DELETE CANDIDATE
//
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  deleteCandidate
);

export default router;