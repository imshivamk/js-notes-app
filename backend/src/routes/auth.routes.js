import express from "express"
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", (req, res )=>{
    res.send("Auth route is working!")
});

router.get('/check-auth', verifyToken, checkAuth);

router.post("/signup", signup);
router.post('/login', login);
router.post('/logout', logout);
router.post("/verifyEmail", verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;