const express = require("express");
const mongoose = require("mongoose");
const logger = require("./middlewares/logger.middleware");
const isAuth = require("./middlewares/isAuth");
const notFound = require("./middlewares/notFound");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(express.json());

// Logger middleware
app.use(logger.isLogged);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/sales_management_db")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Dashboard routes (protected with auth)
app.use("/api/dashboard", isAuth.checkToken, dashboardRoutes);

// 404 middleware
app.use(notFound.notFound);

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(". ") });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;