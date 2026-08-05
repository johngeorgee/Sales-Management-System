const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    Department_Id: {
      type: Number,
      required: true,
      unique: true
    },

    Department_Name: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Department", departmentSchema);