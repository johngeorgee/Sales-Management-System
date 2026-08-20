const asyncHandler = require("../Middlewares/asyncHandler");
const { getDashboardData } = require("../Services/dashboard.service");

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getDashboardData();

  res.status(200).json({
    message: "Dashboard data retrieved successfully",
    data: dashboard,
  });
});

module.exports = {
  getDashboard,
};