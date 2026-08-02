const express = require("express");

const {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require("../Controllers/departmentController");

const router = express.Router();

// Create
router.post("/", createDepartment);

// Get All
router.get("/", getAllDepartments);

// Get By Id
router.get("/:id", getDepartmentById);

// Update
router.put("/:id", updateDepartment);

// Delete
router.delete("/:id", deleteDepartment);

module.exports = router;