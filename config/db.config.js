import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Database:", conn.connection.name);
    console.log("Host:", conn.connection.host);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};