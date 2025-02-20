import { client } from "../utility/dbConnect.js";

export const getSeatByNumber = async (SeatNumber, VenueID) => {
    try {
        const result = await client.query(
            `SELECT * FROM "Seat" WHERE SeatNumber = ? AND VenueID = ?`,
            [SeatNumber, VenueID]
        );
        return result[0]; // Return seat details
    } catch (error) {
        console.error("Database error in getSeatByNumber:", error);
        throw error;
    }
};


export const getSeatsByVenueID = async (VenueID) => {
    try {
        const result = await client.query(
            `SELECT * FROM "Seat" WHERE VenueID = ?`,
            [VenueID]
        );
        return result; // Return all seats in the venue
    } catch (error) {
        console.error("Database error in getSeatsByVenueID:", error);
        throw error;
    }
};