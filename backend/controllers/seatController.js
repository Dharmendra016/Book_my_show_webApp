import { initializeSeatTable, insertSeat } from "../models/seatSchema.js";


export const createSeat = async (req, res) => {
    try {
        await initializeSeatTable();
        const { SeatNumber, SeatType, Price, VenueID } = req.body;
        if (!SeatNumber || !SeatType || !Price || !VenueID) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to be filled",
            });
        }
        const seatCreated = await insertSeat({ SeatNumber, SeatType, Price, VenueID });
        if (!seatCreated) {
            return res.status(500).json({
                success: false,
                message: "Seat not created due to a server issue.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "successfully created seat",
            seat: seatCreated
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}