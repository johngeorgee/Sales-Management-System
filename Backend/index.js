import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import customerRoutes from "./routes/customer.route.js";
import customerLocationRoutes from "./routes/customerLocation.route.js";
dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/customers", customerRoutes);
app.use("/customer-locations", customerLocationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
