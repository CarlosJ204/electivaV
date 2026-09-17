import express from "express";
import Movement from "../modules/Movement.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { type, amount, date, categoryId, description, userId } = req.body;
        console.log(req.body);
        if (!type) return res.status(400).json({ message: "Type is required" });
        if (!amount) return res.status(400).json({ message: "Amount is required" });
        if (!categoryId) return res.status(400).json({ message: "CategoryId is required" });

        const movement = new Movement({
            type,
            amount,
            date,
            categoryId,
            description,
            userId,
        });

        await movement.save();

        res.status(201).json({ message: "Movement created successfully", movement });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;