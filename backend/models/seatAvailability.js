import { client } from "../utility/dbConnect.js";

export const getSeatByNumber = async (SeatNumber, VenueID) => {
    try {
        const result = await client.query(
            `SELECT * FROM "Seat" WHERE seatnumber = $1 AND VenueID = $2`,
            [SeatNumber, VenueID]
        );
        return result.rows[0]; // Return seat details
    } catch (error) {
        console.error("Database error in getSeatByNumber:", error);
        throw error;
    }
};


export const getSeatsByVenueID = async (VenueID) => {
    try {
        const result = await client.query(
            `SELECT * FROM "Seat" WHERE VenueID = $1`,
            [VenueID]
        );
        return result.rows; // Return all seats in the venue
    } catch (error) {
        console.error("Database error in getSeatsByVenueID:", error);
        throw error;
    }
};