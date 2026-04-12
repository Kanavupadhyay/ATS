import prisma from "../config/db.js";

//
// 🆕 CREATE JOB (RECRUITER OWNED)
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

    const userId = req.user.id; // 🔥 recruiter from auth

    if (!clientId || !title || !description || !skills || !location || !status) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const job = await prisma.job.create({
      data: {
        clientId: Number(clientId),
        createdBy: BigInt(userId), // 🔥 IMPORTANT FIX

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
// 📄 GET ALL JOBS (RECRUITER SCOPED)
//
export const getJobs = async (req, res) => {
  try {
    const { status, location, search } = req.query;
    const userId = req.user.id;

    const jobs = await prisma.job.findMany({
      where: {
        createdBy: BigInt(userId), // 🔥 IMPORTANT SECURITY FIX

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
            },
            {
              description: {
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
// 🔍 GET JOB BY ID (SECURED)
//
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await prisma.job.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId) // 🔥 SECURITY FIX
      },
      include: {
        client: true,
        submissions: {
          include: {
            candidate: true
          }
        }
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
// ✏️ UPDATE JOB (SECURED)
//
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const {
      title,
      description,
      skills,
      location,
      status,
      experience
    } = req.body;

    const job = await prisma.job.updateMany({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId) // 🔥 SECURITY FIX
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
// ❌ DELETE JOB (SECURED)
//
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.job.deleteMany({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId) // 🔥 SECURITY FIX
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