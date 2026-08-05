const mongoose = require("mongoose");

const customerLocationSchema = new mongoose.Schema(
  {
    Customer_ID: {
      type: Number,
      required: true,
      unique: true,
    },
    Customer_City: {
      type: String,
      required: true,
    },
    Customer_State: {
      type: String,
      required: true,
    },
    Customer_Country: {
      type: String,
      required: true,
    },
    Customer_Street: {
      type: String,
      required: true,
    },
    Customer_Zipcode: String,
    Latitude: Number,
    Longitude: Number,
  },
  {
    timestamps: true,
  },
);
const CustomerLocation = mongoose.model("customer_locations", customerLocationSchema);

module.exports = { CustomerLocation }