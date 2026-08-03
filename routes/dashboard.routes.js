const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const isDashboardAdmin = require("../middlewares/isDashboardAdmin");

// CRUD for dashboard configs

// Only admin can create
router.post("/configs", isDashboardAdmin, dashboardController.createDashboardConfig);

// Any authenticated user can read all configs
router.get("/configs", dashboardController.getAllDashboardConfigs);

// Any authenticated user can read one config
router.get("/configs/:id", dashboardController.getDashboardConfigById);

// Only admin can update
router.put("/configs/:id", isDashboardAdmin, dashboardController.updateDashboardConfig);

// Only admin can delete
router.delete("/configs/:id", isDashboardAdmin, dashboardController.deleteDashboardConfig);

// later you can add stats:
// router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;