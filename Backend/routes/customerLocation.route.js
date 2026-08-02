import express from "express";

import {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/customerLocation.controller.js";

const router = express.Router();

router.get("/", getLocations);
router.get("/:id", getLocation);
router.post("/", createLocation);
router.patch("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router;