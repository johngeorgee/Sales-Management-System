const express = require("express")
const orderRouter = express.Router()
const { addOrder, getAllOrderItems, getAllOrders, updateOrderData, deleteOrderData} = require("../Controllers/order.controller")


orderRouter.get("/items", getAllOrderItems);
orderRouter.get("/", getAllOrders);
orderRouter.post("/", addOrder);
orderRouter.put("/:id", updateOrderData);
orderRouter.post("/:id", deleteOrderData);

module.exports = { orderRouter }