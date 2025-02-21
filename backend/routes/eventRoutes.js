import express from "express"
import { createEvent, deleteEvent, eventUpdate, getEvent } from "../controllers/eventController.js";
import { authentication } from "../middlewares/auth.js";
import {upload} from "../utility/cloudinary.js";

const router = express.Router() ;



router.post("/createEvent", authentication, upload.single("image"), createEvent);
router.get("/getEvents" , getEvent)
router.get("/deleteEvent/:id" , deleteEvent)
router.post("/updateEvent/:id",authentication,upload.single("image"), eventUpdate)

export default router ;