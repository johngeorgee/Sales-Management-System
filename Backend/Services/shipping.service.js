const { shippingModel } = require("../Models/shipping.model");
const mongoose = require("mongoose");

const createShipping = async (data) => {
    const shipping = await shippingModel.create(data);

    return shipping;
};

const getShippings = async () => {
    const shippings = await shippingModel.find();

    return shippings;
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