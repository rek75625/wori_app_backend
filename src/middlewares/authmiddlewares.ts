import { type Request, type Response, type NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(403).json({ error: "No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "worisecretkey");
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};