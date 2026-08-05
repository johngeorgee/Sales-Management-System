const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    Supplier_Company_Name: {
      type: String,
      required: true,
      trim: true,
    },

    Business_Id: {
      type: Number,
      required: true,
      unique: true,
    },

    Contact_Info: {
      Nickname: {
        type: String,
        required: true,
        trim: true,
      },

      Email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },

      Phone_Number: {
        type: String,
        required: true,
        trim: true,
      },
    },

    Status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Supplier", supplierSchema);