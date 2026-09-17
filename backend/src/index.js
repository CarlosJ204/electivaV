import express from "express";
import "dotenv/config";
import dns from "node:dns";
import categorysRoutes from "./routes/categorys.js"
import movementsRoutes from "./routes/movements.js"
import { connectDB } from "./lib/db.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use("/api/category", categorysRoutes);
app.use("/api/movement", movementsRoutes);

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
