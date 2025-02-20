import { initializeSeatTable, insertSeat } from "../models/seatSchema.js";

import { getSeatByNumber, getSeatsByVenueID } from "../models/seatAvailability.js";

export const createSeat = async (req, res) => {
    try {
        await initializeSeatTable();

        // Extracting data from request body
        const { SeatNumber, SeatType, Price, VenueID } = req.body;

        // Basic validation
        if (!SeatNumber || !SeatType || !Price || !VenueID) {
            return res.status(400).json({
                success: false,
                message: "All fields (SeatNumber, SeatType, Price, VenueID) are required.",
            });
        }

        // Ensure Price is a valid number
        if (isNaN(Price) || Price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid price. Price must be a positive number.",
            });
        }

        // Insert the seat
        const seatCreated = await insertSeat({ SeatNumber, SeatType, Price, VenueID });

        if (!seatCreated) {
            return res.status(500).json({
                success: false,
                message: "Failed to create the seat. It may already exist or there was a server issue.",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Seat successfully created.",
            seat: seatCreated,
        });

    } catch (error) {
        console.error("Error in createSeat:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
            error: error.message,  // Helps in debugging
        });
    }
};


export const checkSeatAvailability = async (req, res) => {
    try {
        const { SeatNumber, VenueID } = req.params;

        // Validate inputs
        if (!SeatNumber || !VenueID) {
            return res.status(400).json({
                success: false,
                message: "SeatNumber and VenueID are required.",
            });
        }

        // Fetch seat details from DB
        const seat = await getSeatByNumber(SeatNumber, VenueID);

        if (!seat) {
            return res.status(404).json({
                success: false,
                message: "Seat not found.",
            });
        }

        // Check if the seat is booked
        const isAvailable = !seat.isBooked;

        return res.status(200).json({
            success: true,
            message: isAvailable ? "Seat is available." : "Seat is already booked.",
            available: isAvailable,
            seat: seat,
        });

    } catch (error) {
        console.error("Error in checkSeatAvailability:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
};


export const getSeatsByVenue = async (req, res) => {
    try {
        const { VenueID } = req.params;

        // Validate inputs
        if (!VenueID) {
            return res.status(400).json({
                success: false,
                message: "VenueID is required.",
            });
        }

        // Fetch all seats in the venue
        const seats = await getSeatsByVenueID(VenueID);

        return res.status(200).json({
            success: true,
            message: "Seats fetched successfully.",
            seats: seats,
        });

    } catch (error) {
        console.error("Error in getSeatsByVenue:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
}