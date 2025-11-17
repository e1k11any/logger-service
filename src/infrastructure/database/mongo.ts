import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/eyego-logs";

/**
 * Establishes a connection to the MongoDB database.
 * Exits the process with failure code 1 if connection fails.
 * * @returns {Promise<void>} Resolves when connection is successful.
 */
export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
