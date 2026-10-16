import express from "express";
import "dotenv/config";
import dns from "node:dns";
import categorysRoutes from "./routes/categorys.js";
import movementsRoutes from "./routes/movements.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/users.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(express.json());

app.use("/api/category", categorysRoutes);
app.use("/api/movement", movementsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", usersRoutes);

export default app;