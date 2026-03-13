const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error]: ${error.message}`);
    // If the database fails to connect, we must shut down the server
    process.exit(1);
  }
};

module.exports = connectDB;
