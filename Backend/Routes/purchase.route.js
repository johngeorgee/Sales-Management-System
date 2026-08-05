const express = require("express");

const {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} = require("../Controllers/purchase.controller");

const purchaseRouter = express.Router();

purchaseRouter.post("/", createPurchase);

purchaseRouter.get("/", getAllPurchases);

purchaseRouter.get("/:id", getPurchaseById);

purchaseRouter.put("/:id", updatePurchase);

purchaseRouter.delete("/:id", deletePurchase);

module.exports = { purchaseRouter };