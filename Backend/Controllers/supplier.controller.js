const {supplierModel} = require("../Models/suppliers.model");
const {productModel} = require("../Models/products.model");
const asyncHandler = require("../Middlewares/asyncHandler");

// Create Supplier
const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierModel.create(req.body);

  res.status(201).json({
    success: true,
    message: "Supplier created successfully",
    data: supplier,
  });
});


// Get All Suppliers
const getAllSuppliers = asyncHandler(async (req, res) => {
  //lean returns plain JavaScript objects instead of Mongoose documents, which can improve performance and reduce memory usage when you don't need the full functionality of Mongoose documents.
  const suppliers = await supplierModel.find().lean();
  const suppliersWithProducts = await Promise.all(
    suppliers.map(async (supplier)=>{
      const productsCount = await productModel.countDocuments({supplierRef: supplier._id});
      return {
        ...supplier,
        productsCount: productsCount
      }
     })
  )
  res.status(200).json({
    success: true,
    count: suppliers.length,
    data: suppliersWithProducts,
  });
});


// Get Supplier By ID
const getSupplierById = asyncHandler(async (req, res) => {
  try {
     const supplier = await supplierModel.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }
  const products = await productModel.find({supplierRef: supplier._id}).populate("categoryRef", "Category_Name")
  res.status(200).json({
    success: true,
    data: supplier,
    products,
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve supplier",
      error: error.message
    });
  }
 
});


// Update Supplier
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  res.status(200).json({
    success: true,
    message: "Supplier updated successfully",
    data: supplier,
  });
});


// Delete Supplier
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierModel.findByIdAndDelete(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  res.status(200).json({
    success: true,
    message: "Supplier deleted successfully",
  });
});


module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};