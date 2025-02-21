import { client } from "../utility/dbConnect.js";

const seatModel = `
    CREATE TABLE IF NOT EXISTS "Seat"(
        SeatID SERIAL PRIMARY KEY,
        VenueID INT NOT NULL,
        SeatNumber VARCHAR(10) NOT NULL,
        IsBooked BOOLEAN DEFAULT FALSE,
        Price DECIMAL(10, 2) DEFAULT 0.00,
        FOREIGN KEY (VenueID) REFERENCES "Venue"(venueid) ON DELETE CASCADE
    );
`;

const seatInput = `
    INSERT INTO "Seat"(VenueID, SeatNumber, isBooked , Price)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
`;

const initializeSeatTable = async () => {
    try {
        await client.query(seatModel);
        console.log("Successfully created the Seat table or it already exists.");
    } catch (error) {
        console.error("Error creating Seat table:", error.message);
    }
};

const insertSeat = async ({ VenueID, SeatNumber, isBooked = false , Price }) => {
    try {
        console.log("SeatNumber", SeatNumber);
        console.log("VenueID", VenueID);

        const result = await client.query(seatInput, [VenueID, SeatNumber, isBooked, Price]);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting seat:", error.message);
        throw error;
    }
};

export { initializeSeatTable, insertSeat };
