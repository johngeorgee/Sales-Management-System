const express = require("express");

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../Controllers/category.controller");

const categoryRouter = express.Router();

// Create
categoryRouter.post("/", createCategory);

// Get All
categoryRouter.get("/", getAllCategories);

// Get By Id
categoryRouter.get("/:id", getCategoryById);

// Update
categoryRouter.put("/:id", updateCategory);

// Delete
categoryRouter.delete("/:id", deleteCategory);

module.exports = { categoryRouter };