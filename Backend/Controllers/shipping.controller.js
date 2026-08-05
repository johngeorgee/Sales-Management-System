const {
    createShipping,
    getShippings,
    getShippingById,
    updateShipping,
    deleteShipping
} = require("../Services/shipping.service");


const addShipping = async (req, res) => {
    try {

        const result = await createShipping(req.body);

        return res.status(201).json({
            message: "Shipping created successfully",
            data: result
        });

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            message: error.message
        });
    }
};


const getAllShippings = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const result = await getShippings(page, limit);

        return res.status(200).json({
            message: "Shippings fetched successfully",
            data: result.shippings,
            pagination: result.pagination
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
};


const getShipping = async (req, res) => {
    try {

        const { id } = req.params;

        const shipping = await getShippingById(id);

        return res.status(200).json({
            message: "Shipping fetched successfully",
            data: shipping
        });

    } catch (error) {

        console.log(error);

        if (error.message === "Shipping not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
};


const updateShippingData = async (req, res) => {
    try {

        const { id } = req.params;

        const updatedShipping = await updateShipping(id, req.body);

        return res.status(200).json({
            message: "Shipping updated successfully",
            data: updatedShipping
        });

    } catch (error) {

        console.log(error);

        if (error.message === "Shipping not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
};


const deleteShippingData = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await deleteShipping(id);

        return res.status(200).json(result);

    } catch (error) {

        console.log(error);

        if (error.message === "Shipping not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
};


module.exports = {
    addShipping,
    getAllShippings,
    getShipping,
    updateShippingData,
    deleteShippingData
};