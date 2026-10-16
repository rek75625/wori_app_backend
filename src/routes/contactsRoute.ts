import { Router} from "express";
import { verifyToken } from "../middlewares/authmiddlewares";
import { addContact, fetchContacts } from "../controllers/contactController";


const router = Router();

router.get("/",verifyToken,fetchContacts);
router.post("/",verifyToken,addContact);

export default router;