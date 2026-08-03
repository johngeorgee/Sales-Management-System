const express = require("express");

const shippingRouter = express.Router();

const {
    addShipping,
    getAllShippings,
    getShipping,
    updateShippingData,
    deleteShippingData
} = require("../Controllers/shipping.controller");


shippingRouter.get("/", getAllShippings);

shippingRouter.get("/:id", getShipping);

shippingRouter.post("/", addShipping);

shippingRouter.put("/:id", updateShippingData);

shippingRouter.delete("/:id", deleteShippingData);


module.exports = { shippingRouter };