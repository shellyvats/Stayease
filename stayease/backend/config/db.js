const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "stayease",
    });

    console.log("MongoDB Connected:", conn.connection.host);
    console.log("Database:", conn.connection.name);

    const collections = await conn.connection.db.listCollections().toArray();
    console.log(
      "Collections:",
      collections.map(c => c.name)
    );

    const count = await conn.connection.db
      .collection("properties")
      .countDocuments();

    console.log("Properties in DB:", count);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;