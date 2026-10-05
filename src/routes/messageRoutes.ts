import { Router } from "express";
import { verifyToken } from "../middlewares/authmiddlewares";
import { getAllMessagesByConversationId } from "../controllers/messagesController";

const router = Router();

router.get("/:conversationId",verifyToken,getAllMessagesByConversationId);

export default router;