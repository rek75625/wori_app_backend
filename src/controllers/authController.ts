import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../models/db"; // Removed .js for consistent extensionless imports

const SALT_ROUND = 10;
const JWT_SECRET = process.env.JWT_SECRET || "worisecretkey";
const randomImages = [
  "https://plus.unsplash.com/premium_photo-1682309526815-efe5d6225117?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://plus.unsplash.com/premium_photo-1682309526815-efe5d6225117?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://plus.unsplash.com/premium_photo-1682309526815-efe5d6225117?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://plus.unsplash.com/premium_photo-1682309526815-efe5d6225117?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://plus.unsplash.com/premium_photo-1682309526815-efe5d6225117?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
];

// REGISTER
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
    const randomImage: String =
      randomImages[Math.floor(Math.random() * randomImages.length)];

    const result = await pool.query(
      "INSERT INTO users (username, email, password, profile_image) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, randomImage],
    );

    const user = result.rows[0];
    delete user.password; // Protect the password hash from being leaked

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "User failed to register" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "10h" });

    delete user.password; // Protect the password hash from being leaked
    let finalResult = { ...user, token };

    res.json({ user: finalResult });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "User failed to login" });
  }
};
