const { createOrder, getOrderItems, getOrders, updateOrder, deleteOrder } = require("../Services/orders.service");
const { orderModel } = require("../Models/orders.model")
const { orderListModel } = require("../Models/orderList.model")

const addOrder = async (req, res) => {
    try {
        const result = await createOrder(req.body);

        return res.status(201).json({
            message: "Order created successfully",
            data: result
        });
    } catch (error) {
        console.log(error);

        switch (error.message) {

            case "Customer and Shipping are Required":
            case "Order must contain at least one item":
            case "Product ID is required":
            case "Product price is required":
            case "Product quantity is required":
                return res.status(400).json({
                    message: error.message
                });


            case "Shipping not found":
                return res.status(404).json({
                    message: error.message
                });


            default:
                return res.status(500).json({
                    message: "Failed to create order"
                });
        }
    }
};

const getAllOrders = async (req, res) => {
    try {

        const orders = await getOrders();

        return res.status(200).json({
            message: "Orders fetched successfully",
            data: orders
        });

    } catch (error) {

        console.log(error);

        return res.status(404).json({
            message: error.message
        });
    }
};


const getAllOrderItems = async (req, res) => {
    try {

        const orderItems = await getOrderItems();

        return res.status(200).json({
            message: "Order items fetched successfully",
            data: orderItems
        });

    } catch (error) {

        console.log(error);

        return res.status(404).json({
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
            order: updatedOrder
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


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
module.exports = { addOrder, getAllOrders, getAllOrderItems, updateOrderData, deleteOrderData};