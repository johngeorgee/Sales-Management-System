const mongoose = require("mongoose");

const dashboardConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dashboard name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description must be at most 200 characters"]
    },
    filters: {
      type: Object,
      default: {}
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",   // MUST match mongoose.model("users", userSchema)
      required: true
    }
  },
  {
    timestamps: true,
    collection: "DashboardConfigs"
  }
);

module.exports = mongoose.model("DashboardConfig", dashboardConfigSchema);