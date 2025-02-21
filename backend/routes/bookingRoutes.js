import {Router} from 'express';
import { seatBooking } from '../controllers/bookingController.js';
const router = Router();


router.post("/bookingseat", seatBooking);


export default router;