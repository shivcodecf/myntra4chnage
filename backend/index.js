import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
dotenv.config();
import { connectDB } from "./config/db.js";
import pblRoutes from "./routes/pblRoutes.js";
import grantRoutes from "./routes/grantRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 1000;

connectDB()

app.get("/", (req, res) => {
  res.json({
    message: "Mantra4Change API is running",
  });
});

app.use("/api/pbl", pblRoutes);
app.use("/api/grants", grantRoutes);

app.listen(PORT, () => {
  console.log(`backend is running on ${PORT}`);
});
