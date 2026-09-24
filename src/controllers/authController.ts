import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import pool from "../models/db.js";
import type { Jwt } from "jsonwebtoken";



const SALT_ROUND = 10;  
const JWT_SECRET = process.env.JWT_SECRET || 'worisecretkey';

export const register = async(req: Request,res:Response)=>{

    const {username, email, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,SALT_ROUND);
        const result = await pool.query("INSERT INTO users (username, email, password) VALUES (s1, s2, s3) RETURNING *",
            [username, email, hashedPassword]
        );
        const user = result.row[0];
        res.status(201).json({message: "User registered successfully",user});


    } catch(error){
         res.status(500).json({message: "User failed to register"});
    }
    
}