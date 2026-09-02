import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);

export const connectDB = async () => {
  try {
    // 1. Establish the connection
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // 2. Log success with the host name for clarity
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // 3. Log the actual error message so you can debug it
    console.error(`Database connection error: ${error.message}`);

    // 4. Exit the process immediately if the DB fails to connect
    process.exit(1);
  }
};
