const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    
    Product_Card_Id: {
      type: Number,
      required: true,
      unique: true
    },

    Product_Name: {
      type: String,
      required: true,
      trim: true
    },

    Product_Price: {
      type: Number,
      required: true,
      min: 0
    },

    Product_Status: {
      type: String,
      required: true
    },

    Product_Image: {
      type: String
    },

    Product_Category_Id: {
      type: Number,
      required: true
    },
    Product_Stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    Product_Reorder_Level: {
  type: Number,
  required: true,
  min: 0,
  default: 5
  },
    supplierRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    }, 

    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  {
    timestamps: true
  }
);
const productModel = mongoose.model("Product", productSchema);
module.exports = {productModel}
