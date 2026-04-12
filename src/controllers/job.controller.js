import prisma from "../config/db.js";

//
// 🆕 CREATE JOB
//
export const createJob = async (req, res) => {
  try {
    const {
      clientId,
      title,
      description,
      skills,
      location,
      status,
      experience
    } = req.body;

    if (!clientId || !title || !description || !skills || !location || !status) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const job = await prisma.job.create({
      data: {
        clientId: Number(clientId),
        title,
        description,
        skills,
        location,
        status,
        experience: experience ? Number(experience) : null
      }
    });

    return res.status(201).json({
      message: "Job created successfully",
      data: job
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to create job"
    });
  }
};

//
// 📄 GET ALL JOBS
// Supports filters: clientId, status, location, search
//
export const getJobs = async (req, res) => {
  try {
    const { clientId, status, location, search } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        ...(clientId && { clientId: Number(clientId) }),
        ...(status && { status }),
        ...(location && {
          location: {
            contains: location,
            mode: "insensitive"
          }
        }),
        ...(search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive"
              }
            },
            {
              skills: {
                contains: search,
                mode: "insensitive"
              }
            }
          ]
        })
      },
      orderBy: {
        createdOn: "desc"
      },
      include: {
        client: true,
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });

    return res.status(200).json({
      data: jobs
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch jobs"
    });
  }
};

//
// 🔍 GET JOB BY ID
//
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: {
        id: BigInt(id)
      },
      include: {
        client: true,
        submissions: true
      }
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    return res.status(200).json({
      data: job
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch job"
    });
  }
};

//
// ✏️ UPDATE JOB
//
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      skills,
      location,
      status,
      experience
    } = req.body;

    const job = await prisma.job.update({
      where: {
        id: BigInt(id)
      },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(skills && { skills }),
        ...(location && { location }),
        ...(status && { status }),
        ...(experience !== undefined && { experience: Number(experience) })
      }
    });

    return res.status(200).json({
      message: "Job updated successfully",
      data: job
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update job"
    });
  }
};

//
// ❌ DELETE JOB
//
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.job.delete({
      where: {
        id: BigInt(id)
      }
    });

    return res.status(200).json({
      message: "Job deleted successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to delete job"
    });
  }
};