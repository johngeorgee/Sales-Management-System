const {purchaseModel} = require("../Models/purchase.model");
const {productModel} = require("../Models/products.model");
const {supplierModel} = require("../Models/suppliers.model")
const asyncHandler = require("../Middlewares/asyncHandler");

const allowedStatus = ["Draft", "Pending", "Approved", "Received", "Cancelled"]

// Create Purchase
const createPurchase = asyncHandler(async (req, res) => {

  const {
    Purchase_Order_Business_Id,
    supplierRef,
    items,
    status,
    deliveryTime
  } = req.body;

  // Validate items
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Purchase must contain at least one item");
  }

  //Validate Status
  if (status && !allowedStatus.includes(status)) {
    res.status(400);
    throw new Error("Invalid purchase status");
  }

    // Prevent duplicate products
  const productIds = items.map((item) => String(item.productRef));

  const uniqueProductIds = new Set(productIds);

  if (uniqueProductIds.size !== productIds.length) {
    res.status(400);
    throw new Error("A product cannot appear more than once in a purchase");
  }

  // Calculate item totals
  const processedItems = items.map((item) => {

       const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    const discount = Number(item.discount || 0);

    if (!item.productRef) {
      res.status(400);
      throw new Error("Product reference is required");
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      res.status(400);
      throw new Error("Quantity must be greater than zero");
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      res.status(400);
      throw new Error("Unit price cannot be negative");
    }

    if (!Number.isFinite(discount) || discount < 0) {
      res.status(400);
      throw new Error("Discount cannot be negative");
    }

    const subtotal = quantity * unitPrice;

    if (discount > subtotal) {
      res.status(400);
      throw new Error("Discount cannot exceed item subtotal");
    }

    const total = subtotal - discount;
    return {
      productRef: item.productRef,
      quantity: quantity,
      unitPrice: unitPrice,
      discount,
      total
    };
  });



  const products = await productModel.find({
    _id: { $in: productIds }
  }).select("_id");

  if (products.length !== productIds.length) {
    res.status(400);
    throw new Error("One or more products do not exist");
  }

  // Check supplier
  const supplier = await supplierModel.findById(supplierRef);

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  // Supplier must be active
  if (supplier.Status !== "Active") {
    res.status(400);
    throw new Error(
      "Cannot create purchase from inactive supplier"
    );
  }

  // Calculate totals
  const totalItems = processedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = processedItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  // Create purchase
  const purchase = await purchaseModel.create({
    Purchase_Order_Business_Id,
    supplierRef,
    items: processedItems,
    totalItems,
    totalPrice,
    status: status || "Draft",
    deliveryTime
  });

  res.status(201).json({
    success: true,
    message: "Purchase created successfully",
    data: purchase
  });
});

// Get All Purchases
const getAllPurchases = asyncHandler(async (req, res) => {
  const purchases = await purchaseModel.find()
    .populate("supplierRef")
    .populate("items.productRef");

  if (!purchases) {
    res.status(404);
    throw new Error("Purchase not found");
  }


  res.status(200).json({
    success: true,
    count: purchases.length,
    data: purchases,
  });
});


// Get Purchase By ID
const getPurchaseById = asyncHandler(async (req, res) => {
  const purchase = await purchaseModel.findById(req.params.id)
    .populate("supplierRef")
    .populate("items.productRef");

  if (!purchase) {
    res.status(404);
    throw new Error("Purchase not found");
  }

  res.status(200).json({
    success: true,
    count: purchase.length,
    data: purchase,
  });
});


// Update Purchase
const updatePurchase = asyncHandler(async (req, res) => {
  const { items, status } = req.body;

  if (status !== undefined) {
    res.status(400);
    throw new Error(
      "Purchase status must be updated using the status endpoint"
    );
  }
    const purchase = await purchaseModel.findById(req.params.id);
      if (!purchase) {
    res.status(404);
    throw new Error("Purchase not found");
  }

  // Prevent editing completed/cancelled purchases
  if (
    purchase.status === "Received" ||
    purchase.status === "Cancelled"
  ) {
    res.status(400);
    throw new Error(
      `Cannot update a purchase with status ${purchase.status}`
    );
  }
  let updateData = {
    ...req.body,
  };

  if (items !== undefined) {
   if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("Purchase must contain at least one item");
    }

    // Prevent duplicate products
    const productIds = items.map((item) => String(item.productRef));
    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
      res.status(400);
      throw new Error(
        "A product cannot appear more than once in a purchase"
      );
    }

    // Check products exist
    const products = await productModel.find({
      _id: { $in: productIds },
    }).select("_id");

    if (products.length !== uniqueProductIds.size) {
      res.status(400);
      throw new Error("One or more products do not exist");
    }

    const processedItems = items.map((item) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      const discount = Number(item.discount || 0);

      if (!item.productRef) {
        res.status(400);
        throw new Error("Product reference is required");
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        res.status(400);
        throw new Error("Quantity must be greater than zero");
      }

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        res.status(400);
        throw new Error("Unit price cannot be negative");
      }

      if (!Number.isFinite(discount) || discount < 0) {
        res.status(400);
        throw new Error("Discount cannot be negative");
      }

      const subtotal = quantity * unitPrice;

      if (discount > subtotal) {
        res.status(400);
        throw new Error("Discount cannot exceed item subtotal");
      }

      const total = subtotal - discount;

      return {
        productRef: item.productRef,
        quantity,
        unitPrice,
        discount,
        total,
      };
    });

    updateData.items = processedItems;

    updateData.totalItems = processedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    updateData.totalPrice = processedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }

  const updatedPurchase = await purchaseModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("supplierRef")
    .populate("items.productRef");

  res.status(200).json({
    success: true,
    message: "Purchase updated successfully",
    data: updatedPurchase,
  });
});


//Update Purchase Status 
const updatePurchaseStatus = asyncHandler(async(req, res)=>{
  const { status } = req.body;

  

  if(!status || !allowedStatus.includes(status)){
    res.status(400).send("invalid purchase status");
    return;
  }

  const purchase = await purchaseModel.findById(req.params.id);
  if(!purchase){
    res.status(404).send("Purchase Not Found")
    return;
  }

  const currentStatus = purchase.status;

  const allowedTransitions = {
    Draft : ["Pending", "Cancelled"],
    Pending: ["Approved", "Cancelled"],
    Approved: ["Received", "Cancelled"],
    Received: [],
    Cancelled: []
  };
  if (!allowedTransitions[currentStatus].includes(status)) {
    res.status(400);
    throw new Error(
      `Cannot change purchase status from ${currentStatus} to ${status}`
    );
  }

  if(status === "Received"){
    for (const item of purchase.items) {
      
      const product = await productModel.findById(item.productRef);
      
      if (!product) {
        res.status(404);
        throw new Error(
          `Product ${item.productRef} not found`
        );
      }
      product.Product_Stock += item.quantity;

      await product.save();
    }
  }
  
  purchase.status = status;
  await purchase.save();

  res.status(200).json({
    success: true,
    message: `Purchase status changed from ${currentStatus} to ${status}`,
    data: purchase,
  });
})


// Delete Purchase
const deletePurchase = asyncHandler(async (req, res) => {
  const purchase = await purchaseModel.findByIdAndDelete(
    req.params.id
  );

  if (!purchase) {
    res.status(404);
    throw new Error("Purchase not found");
  }

  // Do not delete purchases that already affected inventory
  if (purchase.status === "Received") {
    res.status(400);
    throw new Error(
      "Received purchases cannot be deleted because they have already affected inventory"
    );
  }

  // Do not delete cancelled history
  if (purchase.status === "Cancelled") {
    res.status(400);
    throw new Error(
      "Cancelled purchases cannot be deleted"
    );
  }

  await Purchase.findByIdAndDelete(req.params.id);

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
  updatePurchaseStatus,
  deletePurchase,
};