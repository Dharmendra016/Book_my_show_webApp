const seatModel = `
    CREATE TABLE IF NOT EXISTS "Seat"(
        SeatID SERIAL PRIMARY KEY,
        VenueID INT NOT NULL,
        Row VARCHAR(10) NOT NULL,
        Number INT NOT NULL,
        IsAvailable BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (VenueID) REFERENCES "Venue"(VenueId) ON DELETE CASCADE
    );
`;

const seatInput = `
    INSERT INTO "Seat"(VenueID, Row, Number, IsAvailable)
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

const insertSeat = async ({ VenueID, Row, Number, IsAvailable = true }) => {
    try {
        const result = await client.query(seatInput, [VenueID, Row, Number, IsAvailable]);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting seat:", error.message);
        throw error;
    }
};

export { initializeSeatTable, insertSeat };
