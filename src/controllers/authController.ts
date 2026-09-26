import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from "../models/db.js";



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
         res.status(500).json({error: "User failed to register"});
    }
    
}

/// login function 
export const login = async(req: Request,res:Response):Promise<any>=>{

    const {email,password} = req.body;
    try{

         const result = await pool.query("SELECT * FROM users WHERE email = s2",
            [email]
        );

        const user = result.row[0];
        if(!user) return res.status(404).json({error: "User not found"});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({error: "Invalid credentials"})

        const token = jwt.sign(
            { id: user.id},
            JWT_SECRET,
            { expiresIn: '10h' }
        );
        res.json({ message: "Login successful", token });

    } catch(error)
    
    {
          res.status(400).json({error: "User failed to login"})
    }
    

}



