import {Router} from 'express';
import { createVenue, getVenue, updateVenue } from '../controllers/venueController.js';
import { authentication } from '../middlewares/auth.js';

const router = Router();


router.post("/venue",createVenue); 
router.get("/venue/:id",authentication, getVenue);
router.post("/updateVenue/:id",authentication, updateVenue);

export default router;