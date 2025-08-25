import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "streamr", // optional: set your DB name
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    
  }
};

export default dbConnect;
