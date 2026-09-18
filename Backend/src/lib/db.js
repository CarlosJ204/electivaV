import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const coon =await mongoose.connect(process.env.MONGODB_URI, {  });
    console.log(`Connected to MongoDB${coon.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);//exit with failure
  }
};