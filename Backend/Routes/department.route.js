const express = require("express");

const {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require("../Controllers/department.controller");

const departmentRouter = express.Router();

// Create
departmentRouter.post("/", createDepartment);

// Get All
departmentRouter.get("/", getAllDepartments);

// Get By Id
departmentRouter.get("/:id", getDepartmentById);

// Update
departmentRouter.put("/:id", updateDepartment);

// Delete
departmentRouter.delete("/:id", deleteDepartment);

module.exports = {departmentRouter};