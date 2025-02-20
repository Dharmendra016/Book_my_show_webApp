import express from "express"
import { createEvent, deleteEvent, eventUpdate, getEvent } from "../controllers/eventController.js";
import { authentication } from "../middlewares/auth.js";

const router = express.Router() ;



router.post("/createEvent",authentication, createEvent)
router.get("/getEvents" , getEvent)
router.get("/deleteEvent/:id" , deleteEvent)
router.post("/updateEvent/:id",authentication, eventUpdate)

export default router ;