import express from "express";
import Category from "../modules/Category.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        //borrar el userId cuando se implemente el login
        const { name, description, userId } = req.body;

        if (!name) return res.status(400).json({ message: "Name is required" });

        const category = new Category({
            name,
            description,
            //cuando se haga el login se debe reemplazar el user por la linea que esta comentada abajo  
            userId: userId
            //  user: req.user,
        });

        await category.save();

        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const { userId } = req.body
        const categories = await Category.find({
            userId: userId,
        })
        res.status(200).json(categories);

    } catch {
        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }

})

export default router;