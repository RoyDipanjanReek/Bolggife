import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI!;

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    console.log("ALready connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("DB connected successfully");
  } catch (error) {
    console.log("database connection failed", error);

    process.exit(1);
  }
}

export default dbConnect;
