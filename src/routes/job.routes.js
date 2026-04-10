import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { createJob, getJobs } from "../controllers/job.controller.js";

console.log("JOB ROUTES LOADED ");

const router = express.Router();

router.get("/",authMiddleware,getJobs);


router.post("/",
  authMiddleware,
  requireRole("ADMIN"),
  createJob
);

export default router;