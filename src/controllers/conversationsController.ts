import { type Request, type Response } from "express";
import pool from "../models/db.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number | string;
  };
}

export const getConversationsById = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id ?? null;

  try {
    const result = await pool.query(
      `
    SELECT
      c.id AS conversation_id,
      CASE
          WHEN u1.id = $1 THEN u2.username
          ELSE u1.username
      END AS participant_name,
      m.content AS last_message,
      m.created_at AS last_message_time
    FROM conversations c
    JOIN users u1
        ON u1.id = c.participant_one
    JOIN users u2
        ON u2.id = c.participant_two
    LEFT JOIN LATERAL (
      SELECT content, created_at
      FROM messages
      WHERE conversation_id = c.id
      ORDER BY created_at DESC
      LIMIT 1
  ) m ON true
  WHERE c.participant_one = $1
     OR c.participant_two = $1
  ORDER BY COALESCE(m.created_at, c.created_at) DESC;
    `,
      [userId],
    );

    res.status(200).json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "failed to fetch conversation" });
  }
};

export const checkOrCreateConversation = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<any> => {
  const userId = req.user?.id ?? null;
  const { contactId } = req.body;

  try {
    const existingConversation = await pool.query(
      `
        SELECT id from conversations
        Where (participant_one = $1 AND participant_two = $2)
            OR (participant_two = $1 AND participant_one = $2) 
        LIMIT 1;
        `,
      [userId, contactId],
    );
    if (
      existingConversation.rowCount != null &&
      existingConversation.rowCount! > 0
    ) {
      return res.json({ conversationId: existingConversation.rows[0].id });
    }

    const newConversation = await pool.query(
      `
      INSERT INTO conversations (participant_one,participant_two)
      VALUES ($1,$2)
      RETURNING id;
      `,
      [userId, contactId],
    );
    res.json({ conversationId: newConversation.rows[0].id });
  } catch (e) {
    console.error("Error Checking or Creating Conversations", e);
    res.status(500).json({ e: "Failed to check or create coversation" });
  }
};
