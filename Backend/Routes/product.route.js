const express = require("express");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../Controllers/product.controller");

const productRouter = express.Router();

// Create
productRouter.post("/", createProduct);

// Get All
productRouter.get("/", getAllProducts);

// Get By Id
productRouter.get("/:id", getProductById);

// Update
productRouter.put("/:id", updateProduct);

// Delete
productRouter.delete("/:id", deleteProduct);

module.exports = {productRouter};