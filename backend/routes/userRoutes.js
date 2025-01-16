import express from "express"
const router = express.Router()


import { loginUser, logout, registerUser, sendOtp, verifyOtp } from "../controller/userController";

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);


export default router;