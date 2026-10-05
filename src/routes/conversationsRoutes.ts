import { Router} from "express";
import { verifyToken } from "../middlewares/authmiddlewares";
import { getConversationsById } from "../controllers/conversationsController";


const router = Router();

router.get("/",verifyToken,getConversationsById);

export default router;