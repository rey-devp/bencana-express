// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import disasterRouter from "./routes/disaster.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_GIS = process.env.MONGO_GIS || "mongodb://localhost:27017/GIS";

mongoose
  .connect(MONGO_GIS, { dbName: "GIS" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ message: "Disaster API backend up ✅" });
});

app.use("/disasters", disasterRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
