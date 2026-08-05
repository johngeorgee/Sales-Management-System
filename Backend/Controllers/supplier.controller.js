const Supplier = require("../Models/suppliers.model");
const asyncHandler = require("../Middlewares/asyncHandler");

// Create Supplier
const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.create(req.body);

  res.status(201).json({
    success: true,
    message: "Supplier created successfully",
    data: supplier,
  });
});


// Get All Suppliers
const getAllSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find();

  res.status(200).json({
    success: true,
    count: suppliers.length,
    data: suppliers,
  });
});


// Get Supplier By ID
const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  res.status(200).json({
    success: true,
    data: supplier,
  });
});


// Update Supplier
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(
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
  const supplier = await Supplier.findByIdAndDelete(req.params.id);

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