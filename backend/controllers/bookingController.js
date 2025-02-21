import { initializeBookingTable, insertBooking } from "../models/bookingSchema.js";


export const seatBooking = async (req, res) => {
    try {
        await initializeBookingTable();
        const { UserID, EventID, SeatsBooked, TotalAmount } = req.body;
        console.log(UserID, EventID, SeatsBooked, TotalAmount);
        // Validate input data
        if (!UserID || !EventID || !SeatsBooked || !TotalAmount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Insert booking into the database
        const newBooking = await insertBooking({ UserID, EventID, SeatsBooked, TotalAmount });

        if(!newBooking) {
            return res.status(500).json({ 
                success:false,
                message: 'Booking failed' 
            });
        }

        return res.status(201).json({ message: 'Booking successful', booking: newBooking });

    }catch(error) {
    console.error("Error in seatBooking:", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
    });
    }
};