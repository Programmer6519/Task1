import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// console.log(MONGODB_URI);
export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error in DB connection" + error);
  }
};
