import express from "express"
const router = express.Router()

import { loginUser, logout, registerUser } from "../controllers/userController.js";

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);


export default router;