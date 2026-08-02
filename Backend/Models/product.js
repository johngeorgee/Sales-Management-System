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

module.exports = mongoose.model("Product", productSchema);
