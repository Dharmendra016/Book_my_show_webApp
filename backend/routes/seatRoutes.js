import { Router } from "express";
import { bookSeat, checkSeatAvailability, createSeats, getSeatsByVenue } from "../controllers/seatController.js";
import { authentication } from "../middlewares/auth.js";
const router = Router();

router.post("/createseat" , createSeats);
router.get("/seats/check/:SeatNumber/:VenueID", checkSeatAvailability);
router.get("/seats/:VenueID", getSeatsByVenue);
router.get("/bookseat/:seatid/:SeatNumber/:VenueID", bookSeat);
export default router;
