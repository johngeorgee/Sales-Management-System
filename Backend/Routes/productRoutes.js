const express = require("express");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../Controllers/productController");

const router = express.Router();

// Create
router.post("/", createProduct);

// Get All
router.get("/", getAllProducts);

// Get By Id
router.get("/:id", getProductById);

// Update
router.put("/:id", updateProduct);

// Delete
router.delete("/:id", deleteProduct);

module.exports = router;