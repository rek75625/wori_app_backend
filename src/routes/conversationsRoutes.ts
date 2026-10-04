import { type Request, type Response } from "express";
import pool from "../models/db.js";

interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}

export const getUserConversations = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user?.id;

    // Check authentication first
    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                c.id AS conversation_id,
                u.username AS participant_name,
                m.content AS last_message,
                m.created_at AS last_message_time

            FROM conversations c

            JOIN users u ON (
                (u.id = c.participant_two AND c.participant_one = $1)
                OR
                (u.id = c.participant_one AND c.participant_two = $1)
            )

            LEFT JOIN LATERAL (
                SELECT
                    content,
                    created_at
                FROM messages
                WHERE conversation_id = c.id
                ORDER BY created_at DESC
                LIMIT 1
            ) m ON true

            WHERE c.participant_one = $1
               OR c.participant_two = $1

            ORDER BY m.created_at DESC;
            `,
            [userId]
        );

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error("Failed to fetch conversations:", error);

        return res.status(500).json({
            error: "Failed to fetch conversations"
        });
    }
};