const express = require("express")
const orderRouter = express.Router()
const { addOrder, getAllOrders, getOrder, updateOrderData, deleteOrderData} = require("../Controllers/order.controller")



orderRouter.get("/", getAllOrders);
orderRouter.get("/:id", getOrder);
orderRouter.post("/", addOrder);
orderRouter.put("/:id", updateOrderData);
orderRouter.delete("/:id", deleteOrderData)

module.exports = { orderRouter }