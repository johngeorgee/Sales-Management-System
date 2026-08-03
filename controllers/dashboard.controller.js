// controllers/dashboard.controller.js

const DashboardConfig = require("../models/dashboardConfig.model");

// CREATE  (POST /api/dashboard/configs)
async function createDashboardConfig(req, res, next) {
  try {
    const { name, description, filters, isDefault, createdBy } = req.body;

    // Basic manual validation
    if (!name || typeof name !== "string" || name.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Name is required and must be at least 3 characters." });
    }

    if (!createdBy) {
      return res
        .status(400)
        .json({ message: "createdBy (user id) is required." });
    }

    const config = await DashboardConfig.create({
      name: name.trim(),
      description,
      filters,
      isDefault,
      createdBy
    });

    return res.status(201).json(config);
  } catch (err) {
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }

    // Invalid ObjectId in createdBy, etc.
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid createdBy user id format" });
    }

    next(err);
  }
}

// READ ALL  (GET /api/dashboard/configs)
async function getAllDashboardConfigs(req, res, next) {
  try {
    const configs = await DashboardConfig.find()
      .populate("createdBy", "username email roleId isActive") // adjust fields if needed
      .sort({ createdAt: -1 });

    return res.json(configs);
  } catch (err) {
    next(err);
  }
}

// READ ONE  (GET /api/dashboard/configs/:id)
async function getDashboardConfigById(req, res, next) {
  try {
    const { id } = req.params;

    const config = await DashboardConfig.findById(id)
      .populate("createdBy", "username email roleId isActive");

    if (!config) {
      return res.status(404).json({ message: "DashboardConfig not found" });
    }

    return res.json(config);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next(err);
  }
}

// UPDATE  (PUT /api/dashboard/configs/:id)
async function updateDashboardConfig(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, filters, isDefault, createdBy } = req.body;

    const updated = await DashboardConfig.findByIdAndUpdate(
      id,
      { name, description, filters, isDefault, createdBy },
      { new: true, runValidators: true }
    ).populate("createdBy", "username email roleId isActive");

    if (!updated) {
      return res.status(404).json({ message: "DashboardConfig not found" });
    }

    return res.json(updated);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next(err);
  }
}

// DELETE  (DELETE /api/dashboard/configs/:id)
async function deleteDashboardConfig(req, res, next) {
  try {
    const { id } = req.params;

    const deleted = await DashboardConfig.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "DashboardConfig not found" });
    }

    return res.json({ message: "DashboardConfig deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next(err);
  }
}

module.exports = {
  createDashboardConfig,
  getAllDashboardConfigs,
  getDashboardConfigById,
  updateDashboardConfig,
  deleteDashboardConfig
};