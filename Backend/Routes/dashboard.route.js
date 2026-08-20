const express = require("express");

const { getDashboard } = require("../Controllers/dashboard.controller");
const {checkToken} = require("../Middlewares/isAuth")
const dashboardRouter = express.Router();

dashboardRouter.get("/", checkToken, getDashboard);

module.exports = { dashboardRouter };