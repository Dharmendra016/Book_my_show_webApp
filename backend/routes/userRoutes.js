import express from "express"
const router = express.Router()

import { getUser, loginUser, logout, registerUser } from "../controllers/userController.js";
import { authentication } from "../middlewares/auth.js";

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser",authentication,  getUser)


export default router;