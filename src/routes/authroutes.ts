import { Router } from "express";
import { register, register1,register2,register3,register4,register5,register6,register7, } from '../controllers/authController.js';

const router = Router();

router.post('/register',register);
// router.post('/login');

router.post('/register1',register1);
// router.post('/login');
router.post('/register2',register2);
// router.post('/login');
router.post('/register3',register3);
// router.post('/login');
router.post('/register4',register4);
// router.post('/login');
router.post('/register5',register5);
// router.post('/login');
router.post('/register6',register6);
// router.post('/login');
router.post('/register7',register7);
// router.post('/login');

export default router;






