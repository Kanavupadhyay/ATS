import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
const router = express.Router();

// 📊 GET /dashboard
router.get("/",authMiddleware,requireRole("ADMIN", "RECRUITER"), getDashboardStats);

export default router;