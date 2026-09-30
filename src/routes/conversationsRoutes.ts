import { Router, type Request, type Response } from "express";
import pool from "../models/db.js";
import { verifyToken } from "../middlewares/authmiddlewares.js";

interface AuthenticatedRequest extends Request {
    user?: {
        id: number | string;
    };
}

let router = Router();

router.get('/', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id ?? null;

    try {
        const result = await pool.query(
            `
            SELECT c.id AS conversation_id, u.username AS participant_name, m.content AS last_message, m.created_at AS last_message_time 
            FROM conversation c
            JOIN USER u ON (u.id = c.participant_two AND u.id != $1)
            LEFT JOIN LATERAL (
                SELECT content, created_at
                FROM messages
                WHERE conversation_id = c.id
                ORDER BY created_at DESC
                LIMIT 1
                ) m ON true
            WHERE c.participant_one = $1 OR c.participant_two = $1
            ORDER BY m.created_at DESC
             `,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500).json({ error: "failed to fetch conversation" });
    }
});

export default router;