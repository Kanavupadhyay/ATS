import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} from "../controllers/client.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

console.log("CLIENT ROUTES LOADED");

//
// 🔐 CREATE CLIENT (ADMIN ONLY)
//
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  createClient
);

//
// 📄 GET ALL CLIENTS (ADMIN / RECRUITER)
//
router.get(
  "/",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  getClients
);

//
// 🔍 GET SINGLE CLIENT
//
router.get(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "RECRUITER"),
  getClientById
);

//
// ✏️ UPDATE CLIENT (ADMIN ONLY)
//
router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  updateClient
);

//
// ❌ DELETE CLIENT (ADMIN ONLY)
// (you can later convert this to soft delete)
//
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  deleteClient
);

export default router;