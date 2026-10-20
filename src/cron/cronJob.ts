import cron from "node-cron";
import pool from "../models/db";
import { generateDailyQuestions } from "../services/openaiService";
import { AI_BOT_ID } from "../services/config";

cron.schedule("* * * * *", async () => {
  try {
    const conversations = await pool.query(`SELECT id FROM conversations`);
    for (const conversation of conversations.rows) {
      const question = await generateDailyQuestions();
      await pool.query(
        `
        INSERT INTO (conversation_id, sender_id, content)
        VALUES ($1, $2,$3);
        `,
        [conversation.id, AI_BOT_ID, question],
      );
      console.log("Daily questions sent for conversations ${conversation.id}");
    }
  } catch (e) {
    console.error("Error in daily questioning job ", e);
  }
});
