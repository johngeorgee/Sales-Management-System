const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    Category_Id: {
      type: Number,
      required: true,
      unique: true
    },

    Category_Name: {
      type: String,
      required: true,
      trim: true
    },

    Department_Id: {
      type: Number,
      required: true
    },

    departmentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Category", categorySchema);