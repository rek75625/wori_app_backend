import { Router } from "express";
import { verifyToken } from "../middlewares/authmiddlewares";
import {
  checkOrCreateConversation,
  getConversationsById,
  getDailyQuestions,
} from "../controllers/conversationsController";

const router = Router();

router.get("/", verifyToken, getConversationsById);
router.post("/check-or_create", verifyToken, checkOrCreateConversation);
router.get("/:id/daily-question", verifyToken, getDailyQuestions);

export default router;
