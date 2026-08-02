const express = require("express");

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../Controllers/categoryController");

const router = express.Router();

// Create
router.post("/", createCategory);

// Get All
router.get("/", getAllCategories);

// Get By Id
router.get("/:id", getCategoryById);

// Update
router.put("/:id", updateCategory);

// Delete
router.delete("/:id", deleteCategory);

module.exports = router;