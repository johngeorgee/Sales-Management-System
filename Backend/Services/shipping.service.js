const { shippingModel } = require("../Models/shipping.model");
const mongoose = require("mongoose");

const createShipping = async (data) => {
    const shipping = await shippingModel.create(data);

    return shipping;
};

const getShippings = async (page=1 ,limit = 20) => {
     const skip = (page - 1) * limit;
    const shippings = await shippingModel.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "shippingRef",
      as: "order"
    }
  },
  {
    $project: {
      _id: 1,
      Shipping_ID: 1,
      Shipping_Mode: 1,
      Delivery_Status: 1,
      Days_for_shipping_real: 1,
      Days_for_shipment_scheduled: 1,
      Late_delivery_risk: 1,
      Order_ID: ["$order.Order_ID", 0]
    }
  },
  {
    $skip: skip
  }, 
  {
    $limit: limit
  }
]);

    return {
        shippings,
        pagination: {
        currentPage: page,
        limit,
        totalShippings: await shippingModel.countDocuments(),
        totalPages: Math.ceil(await shippingModel.countDocuments() / limit)
    }};
};

const getShippingById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid shipping ID");
    }

    const shipping = await shippingModel.findById(id);

    if (!shipping) {
        throw new Error("Shipping not found");
    }

    return shipping;
};

const updateShipping = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid shipping ID");
    }

    const shipping = await shippingModel.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!shipping) {
        throw new Error("Shipping not found");
    }

    return shipping;
};

const deleteShipping = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid shipping ID");
    }

    const shipping = await shippingModel.findByIdAndDelete(id);

    if (!shipping) {
        throw new Error("Shipping not found");
    }

    return {
        message: "Shipping deleted successfully",
        data: shipping
    };
};

module.exports = {
    createShipping,
    getShippings,
    getShippingById,
    updateShipping,
    deleteShipping
};