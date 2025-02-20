import { Router } from "express";
import { checkSeatAvailability, createSeat, getSeatsByVenue } from "../controllers/seatController.js";
import { authentication } from "../middlewares/auth.js";
const router = Router();

router.post("/seat" ,authentication, createSeat);
router.get("/seats/check/:SeatNumber/:VenueID", checkSeatAvailability);
router.get("/seats/:venueId", getSeatsByVenue);

export default router;
