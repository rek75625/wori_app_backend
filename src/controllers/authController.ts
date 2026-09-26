import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";

const SALT_ROUND = 10;
const JWT_SECRET = process.env.JWT_SECRET || "worisecretkey";

// REGISTER
export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        const user = result.rows[0];

        res.status(201).json({message: "User registered successfully",user});

    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({error: "User failed to register"});
    }
};


// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
);

        const user = result.rows[0];

        if (!user) {
            res.status(404).json({error: "User not found"});
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({error: "Invalid credentials"});
            return;
        }

        const token = jwt.sign(
            { id: user.id },JWT_SECRET,{ expiresIn: "10h"});

        res.json({message: "Login successful",token});

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({error: "User failed to login"});
    }
};