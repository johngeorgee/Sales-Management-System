const express = require("express");
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../Controllers/customer.controller");

const customerRouter = express.Router();

customerRouter.get("/", getCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.post("/", createCustomer);
customerRouter.patch("/:id", updateCustomer);
customerRouter.delete("/:id", deleteCustomer);

module.exports = {customerRouter};
