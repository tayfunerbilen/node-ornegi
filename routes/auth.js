import express from "express";
import {getLoginController, logoutController, postLoginController} from "../controllers/auth.js";
import {authMiddleware} from "../middlewares/auth.js";

const router = express.Router()

router.get('/login', authMiddleware, getLoginController)
router.post('/login', authMiddleware, postLoginController)
router.get('/logout', logoutController)

export default router
