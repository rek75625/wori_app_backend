import type { Request, Response } from 'express';
import pool from '../models/db';

type AuthRequest = Request & {
    user?: {
        id: string | number;
    };
};

export const fetchContacts = async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.id;
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        const result = await pool.query(
            `
            SELECT u.id AS contact_id, u.username, u.email
            FROM contacts c
            JOIN users u ON (u.id = c.contact_id)
            WHERE c.user_id = $1
            ORDER BY u.username ASC;
            `,
            [userId],
        );

        res.status(200).json(result.rows);
    } catch (e: any) {
        console.error("Fetch contacts failed:", e.message);
        res.status(500).json({ error: "failed to fetch contacts" });
    }
};

export const addContact = async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.id;
    const { contactEmail } = req.body;

    if (!userId || !contactEmail) {
        return res.status(400).json({ error: "Invalid request data. Missing user or contact identity." });
    }

    try {
        // 1. Find the target user by their email address
        const contactExists = await pool.query(
            `SELECT id, email FROM users WHERE email = $1;`, 
            [contactEmail.trim().toLowerCase()] // Normalizing the input string
        );
        
        if (contactExists.rows.length === 0) {
            return res.status(404).json({ error: "The target contact user does not exist." });
        }

        // ✅ Extract the real database ID of the person we want to add
        const contactId = contactExists.rows[0].id;

        // ✅ Fix 1: Properly verify if the user is trying to add themselves using their database ID
        if (userId.toString() === contactId.toString()) {
            return res.status(400).json({ error: "You cannot add yourself as a contact." });
        }

        // ✅ Fix 2: Query relationship check using targetContactId instead of email string
        const relationshipExists = await pool.query(
            `SELECT 1 FROM contacts WHERE user_id = $1 AND contact_id = $2;`,
            [userId, contactId]
        );

        if (relationshipExists.rows.length > 0) {
            return res.status(409).json({ error: "This user is already in your contacts list." });
        }

        // ✅ Fix 3: Insert using targetContactId instead of the text email
        const result = await pool.query(
            `
            INSERT INTO contacts (user_id, contact_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            RETURNING *; 
            `,
            [userId, contactId]
        );

        res.status(201).json(result.rows[0]);

    } catch (e: any) {
        console.error("Add contact failed:", e.message);
        res.status(500).json({ error: "failed to add contact" });
    }
};
