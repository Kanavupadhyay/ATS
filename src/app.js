import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//global logger
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

//auth routes
app.use("/auth", authRoutes);

//job routes
app.use("/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("ATS Backend Running");
});

// ❗ 404 handler MUST be LAST
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

export default app;