const { orderModel } = require("../Models/orders.model")
const { orderListModel } = require("../Models/orderList.model")
const { shippingModel } = require("../Models/shipping.model")
const { Customer } = require("../Models/customer.model");

const createOrder = async (orderData) => {
    const order = await orderModel.create(orderData);
    return order;
};
const getOrders = async (page = 1, limit = 20) => {

    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
        orderModel
            .find()
            .skip(skip)
            .limit(limit)
            .populate("customerRef")
            .populate("shippingRef"),

        orderModel.countDocuments()
    ]);

    const formattedOrders = await Promise.all(

        orders.map(async (order) => {

            const items = await orderListModel
                .find({ orderRef: order._id })
                .populate("productRef");

            const itemCount = items.reduce(
                (sum, item) => sum + (item.Quantity || 0),
                0
            );

            const totalAmount = items.reduce(
                (sum, item) => {
                    const price = item.productRef?.Product_Price || 0;
                    return sum + ((item.Quantity || 0) * price);
                },
                0
            );

            return {
                ...order.toObject(),
                itemCount,
                totalAmount
            };

        })

    );

    return {
        orders: formattedOrders,
        pagination: {
            currentPage: page,
            limit,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit)
        }
    };

};
const getOrderById = async (id) => {
    const order = await orderModel.findById(id).populate("customerRef").populate("shippingRef");
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
}
const updateOrder = async (id, orderData) => {
    const order = await orderModel.findByIdAndUpdate(id, orderData, { new: true, runValidators: true })
    .populate("customerRef")
    .populate("shippingRef");
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
}
const deleteOrder = async (id) => {
    const order = await orderModel.findByIdAndDelete(id);
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
}

module.exports = { createOrder, getOrders, getOrderById, updateOrder, deleteOrder }