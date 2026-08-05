const {CustomerLocation} = require("../Models/customerLocation.model");
 const getLocations = async (req, res) => {
  try {
    const locations = await CustomerLocation.find();

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

 const getLocationById = async (req, res) => {
  try {
    const location = await CustomerLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        message: "Location Not Found",
      });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

 const createLocation = async (req, res) => {
  try {
    const location = await CustomerLocation.create(req.body);

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

 const updateLocation = async (req, res) => {
  try {
    const location = await CustomerLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!location) {
      return res.status(404).json({
        message: "Location Not Found",
      });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

 const deleteLocation = async (req, res) => {
  try {
    const location = await CustomerLocation.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        message: "Location Not Found",
      });
    }

    res.status(200).json({
      message: "Location Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = { getLocations, getLocationById, createLocation, updateLocation, deleteLocation }