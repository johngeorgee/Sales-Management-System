const Inventory = require("../Models/inventory.model");
const asyncHandler = require("../Middlewares/asyncHandler");

// Create Inventory
const createInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.create(req.body);

  res.status(201).json({
    success: true,
    message: "Inventory created successfully",
    data: inventory,
  });
});


// Get All Inventory
const getAllInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find()
    .populate({
      path: "productRef",
      populate: {
        path: "categoryRef",
      },
    });

  res.status(200).json({
    success: true,
    count: inventory.length,
    data: inventory.map(item => ({ ...item.toObject(),
    status: getStockStatus(
    item.currentStock,
    item.reorderLevel
  ),
})),
  });
});


// Get Inventory By ID
const getInventoryById = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id)
    .populate({
      path: "productRef",
      populate: {
        path: "categoryRef",
      },
    });

  if (!inventory) {
    res.status(404);
    throw new Error("Inventory record not found");
  }

  res.status(200).json({
    success: true,
    data: inventory,
  });
});


// Update Inventory
const updateInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!inventory) {
    res.status(404);
    throw new Error("Inventory record not found");
  }

  res.status(200).json({
    success: true,
    message: "Inventory updated successfully",
    data: inventory,
  });
});


// Delete Inventory
const deleteInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findByIdAndDelete(req.params.id);

  if (!inventory) {
    res.status(404);
    throw new Error("Inventory record not found");
  }

  res.status(200).json({
    success: true,
    message: "Inventory deleted successfully",
  });
});

function getStockStatus(currentStock, reorderLevel) {
  if (currentStock === 0) {
    return "Out of Stock";
  }

  if (currentStock <= reorderLevel) {
    return "Low Stock";
  }

  return "In Stock";
}

module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};