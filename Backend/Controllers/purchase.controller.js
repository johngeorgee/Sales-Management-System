const Purchase = require("../Models/purchase.model");
const asyncHandler = require("../Middlewares/asyncHandler");

// Create Purchase
const createPurchase = asyncHandler(async (req, res) => {
  const { items } = req.body;

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const purchase = await Purchase.create({
    ...req.body,
    totalItems,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    message: "Purchase created successfully",
    data: purchase,
  });
});


// Get All Purchases
const getAllPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find()
    .populate("supplierRef")
    .populate("items.productRef");

  res.status(200).json({
    success: true,
    count: purchases.length,
    data: purchases,
  });
});


// Get Purchase By ID
const getPurchaseById = asyncHandler(async (req, res) => {
  const purchase = await Purchase.findById(req.params.id)
    .populate("supplierRef")
    .populate("items.productRef");

  if (!purchase) {
    res.status(404);
    throw new Error("Purchase not found");
  }

  res.status(200).json({
    success: true,
    data: purchase,
  });
});


// Update Purchase
const updatePurchase = asyncHandler(async (req, res) => {
  const { items } = req.body;

  let updateData = {
    ...req.body,
  };

  if (items) {
    updateData.totalItems = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    updateData.totalPrice = items.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }

  const purchase = await Purchase.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!purchase) {
    res.status(404);
    throw new Error("Purchase not found");
  }

  res.status(200).json({
    success: true,
    message: "Purchase updated successfully",
    data: purchase,
  });
});


// Delete Purchase
const deletePurchase = asyncHandler(async (req, res) => {
  const purchase = await Purchase.findByIdAndDelete(
    req.params.id
  );

  if (!purchase) {
    res.status(404);
    throw new Error("Purchase not found");
  }

  res.status(200).json({
    success: true,
    message: "Purchase deleted successfully",
  });
});


module.exports = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};