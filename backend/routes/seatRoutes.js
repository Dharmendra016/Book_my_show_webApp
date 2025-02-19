import { Router } from "express";
import { createSeat } from "../controllers/seatController.js";
import { authentication } from "../middlewares/auth.js";
const router = Router();

router.post("/seat" ,authentication, createSeat);

export default router;
