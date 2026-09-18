import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import dns from "node:dns";
import categorysRoutes from "./routes/categorys.js"
import movementsRoutes from "./routes/movements.js"
import {connectDB} from "./lib/db.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = process.env.PORT;
console.log({PORT});

app.use(express.json());  

app.use("/api/auth",authRoutes);

app.use("/api/category", categorysRoutes);
app.use("/api/movement", movementsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
}  );     