const { orderListModel } = require("../Models/orderList.model")
const { createOrderItem, deleteOrderItem, getOrderItemById, getOrderItems, updateOrderItem, getOrderItemsByOrderId } = require("../Services/orderItems.service")

const getOrderItemByIdController = async (id) => {
    const orderItem = await orderListModel
        .findById(id)
        .populate("productRef");

    if (!orderItem) {
        throw new Error("Order item not found");
    }
    return orderItem;
};

const getAllOrderItems = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const result = await getOrderItems(page, limit);

        return res.status(200).json({
            message: "Order items fetched successfully",
            data: result.orderItems,
            pagination: result.pagination,
        });

    } catch (error) {

        console.log(error);

        return res.status(404).json({
            message: error.message
        });
    }
};

const createOrderItemController = async (req, res) => {
    try {

        const orderItem = await createOrderItem(req.body);

        return res.status(201).json({
            message: "Order item created successfully",
            data: orderItem
        });

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            message: error.message
        });
    }
};

const getOneOrderItem = async (req, res) => {
    try {

        const orderItem = await getOrderItemById(req.params.id);

        return res.status(200).json({
            message: "Order item fetched successfully",
            data: orderItem
        });

    } catch (error) {

        console.log(error);

        return res.status(404).json({
            message: error.message
        });
    }
};

const updateOrderItemController = async (req, res) => {
    try {

        const orderItem = await updateOrderItem(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Order item updated successfully",
            data: orderItem
        });

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            message: error.message
        });
    }
};

const deleteOrderItemController = async (req, res) => {
    try {

        await deleteOrderItem(req.params.id);

        return res.status(200).json({
            message: "Order item deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(404).json({
            message: error.message
        });
    }
};
const getOrderItemsByOrderController = async (req, res) => {

    try {

        const { orderId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const result = await getOrderItemsByOrderId(
            orderId,
            page,
            limit
        );

        return res.status(200).json({
            message: "Order items fetched successfully",
            data: result.orderItems,
            pagination: result.pagination
        });

    } catch (error) {

        console.log(error);

        return res.status(404).json({
            message: error.message
        });
    }
};

module.exports = { getAllOrderItems, createOrderItemController, getOneOrderItem, getOrderItemsByOrderController, updateOrderItemController, deleteOrderItemController}