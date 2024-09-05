/*
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getTicketCollection() {
  try {
    await client.connect();
    const db = client.db("myDatabase");

    // Check if the collection already exists
    const collections = await db
      .listCollections({ name: "Ticket2024Collection" })
      .toArray();

    if (!collections.length) {
      // If the collection does not exist, create it
      const result = await db.createCollection("Ticket2024Collection");
      console.log("🚀 ~ Collection created:", result.collectionName);
    } else {
      console.log("🚀 ~ Collection already exists.");
    }

    return db.collection("Ticket2024Collection");
  } catch (err) {
    console.error(err);
  }
}

module.exports = getTicketCollection;
*/

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
