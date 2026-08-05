const express = require("express");

const {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../Controllers/customerLocation.controller");

const customerLocationRouter = express.Router();

customerLocationRouter.get("/", getLocations);
customerLocationRouter.get("/:id", getLocationById);
customerLocationRouter.post("/", createLocation);
customerLocationRouter.patch("/:id", updateLocation);
customerLocationRouter.delete("/:id", deleteLocation);

module.exports = {customerLocationRouter};