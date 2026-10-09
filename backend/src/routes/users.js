import express from "express"
import User from "../models/User.js"
import Joi from "joi";
import passwordComplexity from 'joi-password-complexity';

const router = express.Router();

//parametros para las contraseñas de usuario
const paramsPassword = {
    min: 8,
    max: 15,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1
};

//Esquema de validacion para crear usuarios
const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: passwordComplexity(paramsPassword).required()
});

router.post("/create-user", async (req, res) => {

    try {
        const { error, value } = createUserSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const { email, password } = value;

        const newUser = new User({
            email,
            password
        });

        await newUser.save();

        res.status(201).json({
            message: "User create successfully",
            newUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

});

export default router;