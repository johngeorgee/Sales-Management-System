const express = require("express");

const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../Controllers/supplier.controller");

const supplierRouter = express.Router();

supplierRouter.post("/", createSupplier);

supplierRouter.get("/", getAllSuppliers);

supplierRouter.get("/:id", getSupplierById);

supplierRouter.put("/:id", updateSupplier);

supplierRouter.delete("/:id", deleteSupplier);

module.exports = { supplierRouter };