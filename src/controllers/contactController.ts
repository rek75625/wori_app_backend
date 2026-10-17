import type { Request, Response } from 'express';
import pool from '../models/db';

type AuthRequest = Request & {
    user?: {
        id: string | number;
    };
};

export const fetchContacts = async (
    req: AuthRequest,
    res: Response,
): Promise<Response> => {
    const userId = req.user?.id;

    if (userId == null || userId === '') {
        return res.status(401).json({
            error: 'Unauthorized access',
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                u.id AS contact_id,
                u.username,
                u.email
            FROM contacts c
            JOIN users u ON u.id = c.contact_id
            WHERE c.user_id = $1
            ORDER BY u.username ASC;
            `,
            [userId],
        );

        return res.status(200).json(result.rows);
    } catch (error: unknown) {
        console.error('Fetch contacts failed:', error);

        return res.status(500).json({
            error: 'Failed to fetch contacts',
        });
    }
};

export const addContact = async (
    req: AuthRequest,
    res: Response,
): Promise<Response> => {
    const userId = req.user?.id;

    const contactEmail =
        typeof req.body?.contactEmail === 'string'
            ? req.body.contactEmail.trim().toLowerCase()
            : '';

    if (userId == null || userId === '') {
        return res.status(401).json({
            error: 'Unauthorized access',
        });
    }

    if (!contactEmail) {
        return res.status(400).json({
            error: 'A valid contact email is required.',
        });
    }

    try {
        // 1. Check if the user already exists in the system
        const contactExists = await pool.query(
            `SELECT id FROM users WHERE LOWER(email) = $1;`,
            [contactEmail],
        );

        let contactId: string | number;

        // If the user doesn't exist, create a placeholder profile instantly!
        if (contactExists.rows.length === 0) {
            const temporaryUsername = contactEmail.split('@')[0] || 'New User';
            const fallbackPassword = 'placeholder_password_value'; 

            // ✅ FIX: Changed column target label from password_hash to password
            const newPlaceholderUser = await pool.query(
                `
                INSERT INTO users (username, email, password)
                VALUES ($1, $2, $3)
                RETURNING id;
                `,
                [temporaryUsername, contactEmail, fallbackPassword]
            );
            
            contactId = newPlaceholderUser.rows[0].id;
        } else {
            contactId = contactExists.rows[0].id;
        }

        // Prevent users from adding themselves.
        if (String(userId) === String(contactId)) {
            return res.status(400).json({
                error: 'You cannot add yourself as a contact.',
            });
        }

        // Check whether this contact already exists.
        const existingContact = await pool.query(
            `
            SELECT 1
            FROM contacts
            WHERE user_id = $1 AND contact_id = $2;
            `,
            [userId, contactId],
        );

        if (existingContact.rows.length > 0) {
            return res.status(409).json({
                error: 'This user is already in your contacts list.',
            });
        }

        // Insert the relationship.
        const result = await pool.query(
            `
            INSERT INTO contacts (user_id, contact_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            RETURNING user_id, contact_id;
            `,
            [userId, contactId],
        );

        // Handle a concurrent request or another unique constraint conflict.
        if (result.rows.length === 0) {
            return res.status(409).json({
                error: 'This user is already in your contacts list.',
            });
        }

        return res.status(201).json({
            message: 'Contact added successfully.',
            contact: result.rows[0],
        });
    } catch (error: unknown) {
        console.error('Add contact backend execution failed:', error);

        return res.status(500).json({
            error: 'Failed to add contact due to server error',
        });
    }
};
