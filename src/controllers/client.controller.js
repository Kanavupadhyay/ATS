import prisma from "../config/db.js";

//
// 🆕 CREATE CLIENT
//
export const createClient = async (req, res) => {
  try {
    const { name, industry } = req.body;

    if (!name || !industry) {
      return res.status(400).json({
        message: "name and industry are required",
      });
    }

    const client = await prisma.client.create({
      data: {
        name,
        industry,
      },
    });

    return res.status(201).json({
      message: "Client created successfully",
      data: client,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to create client",
    });
  }
};

//
// 📄 GET ALL CLIENTS
//
export const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdOn: "desc",
      },
      include: {
        _count: {
          select: {
            jobs: true,
            submissions: true,
          },
        },
      },
    });

    return res.status(200).json({
      data: clients,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch clients",
    });
  }
};

//
// 🔍 GET CLIENT BY ID
//
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        jobs: true,
        submissions: true,
      },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    return res.status(200).json({
      data: client,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch client",
    });
  }
};

//
// ✏️ UPDATE CLIENT
//
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, industry } = req.body;

    const updated = await prisma.client.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(name && { name }),
        ...(industry && { industry }),
      },
    });

    return res.status(200).json({
      message: "Client updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update client",
    });
  }
};

//
// ❌ DELETE CLIENT
//
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to delete client",
    });
  }
};