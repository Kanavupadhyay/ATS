import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import clientRoutes from "./routes/client.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//global logger
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

BigInt.prototype.toJSON = function () {
  return this.toString();
};
// ROUTES

//auth routes
app.use("/auth", authRoutes);

//job routes
app.use("/jobs", jobRoutes);


//candidate routes 
app.use("/candidates", candidateRoutes);

//submission routes 
app.use("/submissions", submissionRoutes);

//client routes
app.use("/client", clientRoutes);



//health check
app.get("/", (req, res) => {
  res.send("ATS Backend Running");
});



// ❗ 404 handler MUST be LAST
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

export default app;