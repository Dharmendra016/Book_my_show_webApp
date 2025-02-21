import { initializeSeatTable, insertSeat } from "../models/seatSchema.js";

import { getSeatByNumber, getSeatsByVenueID } from "../models/seatAvailability.js";
import { client } from "../utility/dbConnect.js";

// export const createSeat = async (req, res) => {
//     try {
//         await initializeSeatTable();

//         // Extracting data from request body
//         const { SeatNumber, SeatType, Price, VenueID } = req.body;

//         // Basic validation
//         if (!SeatNumber || !SeatType || !Price || !VenueID) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields (SeatNumber, SeatType, Price, VenueID) are required.",
//             });
//         }

//         // Ensure Price is a valid number
//         if (isNaN(Price) || Price <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid price. Price must be a positive number.",
//             });
//         }

//         // Insert the seat
//         const seatCreated = await insertSeat({ SeatNumber, SeatType, Price, VenueID });

//         if (!seatCreated) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to create the seat. It may already exist or there was a server issue.",
//             });
//         }

//         return res.status(201).json({
//             success: true,
//             message: "Seat successfully created.",
//             seat: seatCreated,
//         });

//     } catch (error) {
//         console.error("Error in createSeat:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error. Please try again later.",
//             error: error.message,  // Helps in debugging
//         });
//     }
// };
export const createSeats = async (req, res) => {
    try {
        await initializeSeatTable();
        const { venueId, totalSeats, PriceSeat } = req.body;

        if (!venueId || !totalSeats || !PriceSeat) {
            return res.status(400).json({ error: "Venue ID, total seats, and price per seat are required." });
        }

        const seats = [];
        const premiumSeats = Math.floor(totalSeats * 0.2); // 20% Premium
        const standardSeats = Math.floor(totalSeats * 0.5); // 50% Standard
        const budgetSeats = totalSeats - premiumSeats - standardSeats; // Remaining Budget

        // Generate Premium Seats (Row A) - 1.5x price
        for (let i = 1; i <= premiumSeats; i++) {
            seats.push({
                VenueID: venueId,
                SeatNumber: `A${i}`,
                IsBooked: false,
                Price: PriceSeat * 1.5,
            });
        }

        // Generate Standard Seats (Row B) - Base price
        for (let i = 1; i <= standardSeats; i++) {
            seats.push({
                VenueID: venueId,
                SeatNumber: `B${i}`,
                IsBooked: false,
                Price: PriceSeat,
            });
        }

        // Generate Budget Seats (Row C) - 0.7x price
        for (let i = 1; i <= budgetSeats; i++) {
            seats.push({
                VenueID: venueId,
                SeatNumber: `C${i}`,
                IsBooked: false,
                Price: PriceSeat * 0.7,
            });
        }

        // Insert seats into the database
        const insertedSeats = [];
        for (const seat of seats) {
            const newSeat = await insertSeat(seat);
            insertedSeats.push(newSeat);
        }

        return res.status(201).json({ message: "Seats created successfully", seats: insertedSeats });
    } catch (error) {
        console.error("Error creating seats:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const bookSeat = async (req, res) => {
    try {
        const { seatid, SeatNumber, VenueID } = req.params;
        console.log("seatid", seatid, "SeatNumber", SeatNumber, "VenueID", VenueID);
        // Validate inputs
        if (!seatid || !SeatNumber || !VenueID) {
            return res.status(400).json({
                success: false,
                message: "SeatNumber and VenueID are required.",
            });
        }

        // Fetch seat details from DB
        const seat = await client.query(
            `SELECT * FROM "Seat" WHERE seatid = $1 AND VenueID = $2 and seatnumber = $3`,
            [seatid, VenueID, SeatNumber]
        )

        if (!seat) {
            return res.status(404).json({
                success: false,
                message: "Seat not found.",
            });
        }

        // Check if the seat is already booked
        if (seat.isBooked) {
            return res.status(400).json({
                success: false,
                message: "Seat is already booked.",
            });
        }

        // Update the seat to booked
        const updatedSeat = await client.query(
            `UPDATE "Seat" SET isBooked = true WHERE seatid = $1 AND VenueID = $2 and seatnumber = $3 RETURNING *`,
            [seatid, VenueID, SeatNumber]
        );

        return res.status(200).json({
            success: true,
            message: "Seat booked successfully.",
            seat: updatedSeat,
        });

    } catch (error) {
        console.error("Error in bookSeat:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
}



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

        // // Check if the seat is booked
        const isbooked = seat.isbooked;

        return res.status(200).json({
            success: true,
            message: isbooked ? "Seat is available." : "Seat is already booked.",
            isbooked: isbooked,
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
        await initializeSeatTable()
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

        if (!seats) {
            return res.status(404).json({
                success: false,
                message: "No seats found for the venue.",
            });
        }

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