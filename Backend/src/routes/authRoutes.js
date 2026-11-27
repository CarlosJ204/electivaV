
import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );
};

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    console.log("REGISTER EJECUTADO");
    console.log("BASE DE DATOS:", User.db.name);
    console.log("COLECCIÓN:", User.collection.name);

    // Validar campos
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password should be at least 8 characters long"
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        message: "Username should be at least 3 characters long"
      });
    }

    // Verificar si el correo ya existe
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // Verificar si el usuario ya existe
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    // Crear imagen de perfil
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    // Crear usuario
    const user = new User({
      email,
      username,
      password,
      profileImage
    });

    // Guardar usuario en MongoDB
    await user.save();

    console.log("USUARIO GUARDADO:", user.email);
    console.log("BASE DE DATOS DESTINO:", User.db.name);
    console.log("COLECCIÓN:", User.collection.name);

    // Generar token
    const token = generateToken(user._id);

    // Respuesta
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.log("Error al registrar usuario:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// INICIO DE SESIÓN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Generar token
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.log("Error al iniciar sesión:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// CERRAR SESIÓN
router.post("/logout", (req, res) => {
  try {
    return res.status(200).json({
      message: "Logged out successfully"
    });

  } catch (error) {
    console.log("Error al cerrar sesión:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

export default router;
