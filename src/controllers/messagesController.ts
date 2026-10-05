import type { Request, Response } from "express";
import pool from "../models/db";

export const getAllMessagesByConversationId = async (req: Request, res: Response): Promise<void> => {

    const conversationId = req.params.conversationId;

    try {
        const result = await pool.query(
            `
            SELECT m.id, m.content, m.sender_id, m.conversation_id, m.created_at 
            FROM messages m
            WHERE m.conversation_id = $1 
            ORDER BY m.created_at ASC
            `,
            [conversationId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }

}

export const createMessage = async (conversationId: string, senderId: number, content: string): Promise<void> => {
     try {
        const result = await pool.query(
            `
            INSERT INTO messages (content, sender_id, conversation_id)
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
            [content, senderId, conversationId]
        );
        return result.rows[0];
        
    } catch (error) {
        console.error("Error creating message:", error);
        throw new Error("Failed to create message");
    }


}