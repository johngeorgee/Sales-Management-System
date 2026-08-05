const mongoose  = require("mongoose");
const {Schema} = mongoose
const { CustomerLocation } = require("./customerLocation.model")


const customerSchema = new Schema({
    Customer_ID: { type: Number, required: true, unique: true },
    Customer_FullName: { type: String, required: true },
    Customer_Segment: {
      type: String,
      enum: ["Consumer", "Corporate", "Home Office"],
      default: "Consumer",
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "customer_locations"
    },
  },
  { timestamps: true },
);
const Customer = mongoose.model("customers", customerSchema);

module.exports =  { Customer }
 
