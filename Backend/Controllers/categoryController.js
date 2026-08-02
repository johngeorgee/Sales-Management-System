const Category = require("../Models/Category");
const asyncHandler = require("../Middleware/asyncHandler");

// Create Category
const createCategory = asyncHandler(async (req, res) => {

    const category = await Category.create(req.body);

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category
    });

});

// Get All Categories
const getAllCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find().populate("departmentRef");

    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    });

});

// Get Category By Id
const getCategoryById = asyncHandler(async (req, res) => {

    const category = await Category.findById(req.params.id)
        .populate("departmentRef");

    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    res.status(200).json({
        success: true,
        data: category
    });

});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category
    });

});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    res.status(200).json({
        success: true,
        message: "Category deleted successfully"
    });

});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};