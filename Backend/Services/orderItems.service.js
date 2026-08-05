const { orderListModel } = require("../Models/orderList.model")

const getOrderItems = async (page= 1, limit= 20 ) => {
        const skip = (page - 1) * limit;
        const [orderItems, totalOrderItems] = await Promise.all([
            orderListModel.find().skip(skip).
            limit(limit).populate("orderRef").populate("productRef"),

            orderListModel.countDocuments()
        ]);

    if (!orderItems || orderItems.length === 0) {
        throw new Error("No order items found");
    }

    return {
        orderItems,
        pagination: {
            currentPage: page,
            limit,
            totalOrderItems,
            totalPages: Math.ceil(totalOrderItems / limit)
        }

    };
};

const createOrderItem = async (orderItemData) => {

    const orderItem = await orderListModel.create(orderItemData);

    return orderItem;
};

const getOrderItemById = async (id) => {

    const orderItem = await orderListModel
        .findById(id)
        .populate("orderRef")
        .populate("productRef");

    if (!orderItem) {
        throw new Error("Order item not found");
    }

    return orderItem;
};
const getOrderItemsByOrderId = async (orderId, page = 1, limit = 20) => {

    const skip = (page - 1) * limit;

    const [orderItems, totalOrderItems] = await Promise.all([

        orderListModel
            .find({ orderRef: orderId })
            .skip(skip)
            .limit(limit)
            .populate("orderRef")
            .populate("productRef"),

        orderListModel.countDocuments({
            orderRef: orderId
        })

    ]);

    return {
        orderItems,
        pagination: {
            currentPage: page,
            limit,
            totalOrderItems,
            totalPages: Math.ceil(totalOrderItems / limit)
        }
    };
};

const updateOrderItem = async (id, orderItemData) => {

    const orderItem = await orderListModel.findByIdAndUpdate(
        id,
        orderItemData,
        {
            new: true,
            runValidators: true
        }
    )
    .populate("orderRef")
    .populate("productRef");

    if (!orderItem) {
        throw new Error("Order item not found");
    }

    return orderItem;
};

const deleteOrderItem = async (id) => {

    const orderItem = await orderListModel.findByIdAndDelete(id);

    if (!orderItem) {
        throw new Error("Order item not found");
    }

    return orderItem;
};

module.exports = { getOrderItems, createOrderItem, getOrderItemById, getOrderItemsByOrderId, updateOrderItem, deleteOrderItem }