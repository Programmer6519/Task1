import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
  try {
    mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error in DB connection" + error);
  }
};
