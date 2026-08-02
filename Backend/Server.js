const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./Config/db");

// Routes
const departmentRoutes = require("./Routes/departmentRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const productRoutes = require("./Routes/productRoutes");

// Middlewares
const notFound = require("./Middleware/notFound");
const errorHandler = require("./Middleware/errorHandler");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello"
    });
});

app.use(express.static('Public')); 

// API Routes
app.use("/api/departments", departmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// 404 Middleware
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running On http://localhost:${PORT}`);
});

