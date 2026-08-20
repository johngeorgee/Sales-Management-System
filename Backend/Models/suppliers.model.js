
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
      Contact_Person: {
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

    Address: {
      Street: {
        type: String,
        trim: true,
      },

      City: {
        type: String,
        trim: true,
      },

      State: {
        type: String,
        trim: true,
      },

      Country: {
        type: String,
        trim: true,
      },

      ZipCode: {
        type: String,
        trim: true,
      },
    },

    Payment_Terms: {
      type: String,
      enum: [
        "Cash",
        "Net 15",
        "Net 30",
        "Net 60",
      ],
      default: "Net 30",
    },

    Notes: {
      type: String,
      trim: true,
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
const supplierModel = mongoose.model("Supplier", supplierSchema);
module.exports = {supplierModel}

