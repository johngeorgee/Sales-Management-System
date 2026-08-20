const {productModel} = require("../Models/products.model");
const asyncHandler = require("../Middlewares/asyncHandler");

// Create Product
const createProduct = asyncHandler(async (req, res) => {

    const product = await productModel.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });

});

// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {

    const products = await productModel.find().populate("supplierRef").populate({
        path: "categoryRef",
        populate: {
            path: "departmentRef"
        }
    });

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });

});

// Get Product By Id
const getProductById = asyncHandler(async (req, res) => {

    const product = await productModel.findById(req.params.id).populate({
        path: "categoryRef",
        populate: {
            path: "departmentRef"
        }
    });

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        data: product
    });

});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {

    const product = await productModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
    });

});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {

    const product = await productModel.findByIdAndDelete(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });

});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};