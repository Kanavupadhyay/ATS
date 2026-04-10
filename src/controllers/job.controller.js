import prisma from "../config/db.js";

export const createJob = async (req, res) => {
  const { title, description, location, salary_range } = req.body;

  const job = await prisma.job.create({
    data: {
      title,
      description,
      location,
      salaryRange: salary_range,
      createdBy: req.user.userId
    }
  });

  res.json({
    msg: "Job created",
    job
  });
};

export const getJobs = async (req, res) => {
  const jobs = await prisma.job.findMany();

  res.json(jobs);
};