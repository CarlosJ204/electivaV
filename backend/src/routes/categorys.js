import express from "express";
import Category from "../modules/Category.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, description } = req.body;
        console.log(req.body);
        if (!name) return res.status(400).json({ message: "Name is required" });

        const category = new Category({
            name,
            description,
            //user: req.user,
        });

        await category.save();

        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;