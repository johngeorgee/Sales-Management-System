const express = require("express")
const orderItemsRouter = express.Router()
const { createOrderItemController, getAllOrderItems, getOneOrderItem, getOrderItemsByOrderController, deleteOrderItemController, updateOrderItemController} = require("../Controllers/orderItem.controller")


orderItemsRouter.get("/", getAllOrderItems);
orderItemsRouter.get("/order/:orderId", getOrderItemsByOrderController);
orderItemsRouter.get("/:id", getOneOrderItem);
orderItemsRouter.post("/", createOrderItemController);
orderItemsRouter.put("/:id", updateOrderItemController);
orderItemsRouter.delete("/:id", deleteOrderItemController);

module.exports = { orderItemsRouter }
