import { Router } from "express";
import { verifyToken } from "../middlewares/authmiddlewares";
import {
  addContact,
  fetchContacts,
  recentContact,
} from "../controllers/contactController";

const router = Router();

router.get("/", verifyToken, fetchContacts);
router.post("/", verifyToken, addContact);
router.get("/recent", verifyToken, recentContact);

export default router;
