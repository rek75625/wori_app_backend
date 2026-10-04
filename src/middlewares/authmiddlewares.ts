import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtUserPayload extends jwt.JwtPayload {
    id: string; 
}

export interface AuthenticatedRequest extends Request {
    user?: JwtUserPayload;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    // 1. Verify the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(403).json({ error: "Access denied. No valid Bearer token provided." });
        return;
    }

    // 2. Extract the actual token string cleanly (index 1 of the split array)
    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(403).json({ error: "Access denied. Token string is empty." });
        return;
    }

    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || "worisecretkey"
        ) as JwtUserPayload;

        req.user = decoded; 
        next(); 
    } catch (error: any) {
        console.error("[Auth Middleware Error]:", error?.message || error);
        res.status(401).json({ error: "Invalid, expired, or corrupted token authentication." });
    }
};
