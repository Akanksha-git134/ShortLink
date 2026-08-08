const mongoose = require("mongoose");

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * WHY isolate this: server.js shouldn't know *how* we connect, only that
 * connectDB() either resolves (app can start) or throws (app should not
 * start with a broken DB connection — failing loudly beats failing silently).
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop the app rather than run with a dead DB
  }
}

module.exports = connectDB;
