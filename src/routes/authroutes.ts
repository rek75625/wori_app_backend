import { Router } from "express";
import { register, login } from "../controllers/authController"; 

const router = Router();

// Changed 'app' to 'router' here 
router.post("/register", register);
router.post("/login", login);

export default router;
