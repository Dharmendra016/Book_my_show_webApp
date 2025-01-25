import express from "express"
import { createEvent } from "../controllers/eventController.js";
import { authentication } from "../middlewares/auth.js";

const router = express.Router() ;



router.post("/createEvent",authentication, createEvent)



export default router ;