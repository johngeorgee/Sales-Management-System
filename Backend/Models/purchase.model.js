const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
  {
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      min: 0,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);


const purchaseSchema = new mongoose.Schema(
  {
    Purchase_Order_Business_Id: {
      type: Number,
      required: true,
      unique: true,
    },

    supplierRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    items: {
      type: [purchaseItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Purchase must contain at least one item",
      },
    },

    totalItems: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Pending",
        "Approved",
        "Received",
        "Cancelled",
      ],
      default: "Draft",
    },

    deliveryTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Purchase", purchaseSchema);