import { Router } from "express";
import { verifyToken } from "../middlewares/authmiddlewares";
import {
  checkOrCreateConversation,
  getConversationsById,
} from "../controllers/conversationsController";

const router = Router();

router.get("/", verifyToken, getConversationsById);
router.post("/check-or_create", verifyToken, checkOrCreateConversation);

export default router;
