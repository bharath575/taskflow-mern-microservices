import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected (tasks)");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
