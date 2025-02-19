import {Router} from 'express';
import { createVenue } from '../controllers/venueController.js';
import { authentication } from '../middlewares/auth.js';

const router = Router();


router.post("/venue" ,authentication,createVenue); 


export default router;