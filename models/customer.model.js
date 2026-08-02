import mongoose from "mongoose";

const customerLocationSchema = new mongoose.Schema({
  Customer_City: { type: String, required: true },
  Customer_State: { type: String, required: true },
  Customer_Country: { type: String, required: true },
  Customer_Street: { type: String, required: true },
  Customer_Zipcode: { type: String },
  Latitude: { type: Number },
  Longitude: { type: Number },
});

const customerSchema = new mongoose.Schema(
  {
    Customer_ID: { type: Number, required: true, unique: true },
    Customer_FullName: { type: String, required: true },
    Customer_Segment: {
      type: String,
      enum: ["Consumer", "Corporate", "Home Office"],
      default: "Consumer",
    },
    location: customerLocationSchema,
  },
  { timestamps: true },
);

export const Customer = mongoose.model("Customer", customerSchema);
