import mongoose from "mongoose";

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

export const CustomerLocation = mongoose.model(
  "CustomerLocation",
  customerLocationSchema,
  "customer_locations",
);
