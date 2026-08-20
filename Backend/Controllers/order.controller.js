const { createOrder, getOrders, updateOrder, deleteOrder } = require("../Services/orders.service");
const { orderModel } = require("../Models/orders.model")
const { orderListModel } = require("../Models/orderList.model")

const addOrder = async (req, res) => {
    try {
        const order = await createOrder(req.body);

        return res.status(201).json({
            message: "Order created successfully",
            data: order
        });
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            message: error.message
        });
    }
        };
    


const getAllOrders = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 15;
        const result = await getOrders(page, limit);
        return res.status(200).json({
            message: "Orders fetched successfully",
            data: result.orders,
            pagination: result.pagination
        });
    } catch (error) {

        console.log(error);

        return res.status(404).json({
            message: error.message
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await getOrderById(id);
        res.status(200).json({
            message: "Order fetched successfully",
            data: order
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const updateOrderData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await updateOrder(id, req.body);
        res.status(200).json({
            message: "Order updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}


const deleteOrderData = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteOrder(id);

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
module.exports = { addOrder, getAllOrders, getOrder, updateOrderData, deleteOrderData};
            


