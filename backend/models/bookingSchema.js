const bookingModel = `
    CREATE TABLE IF NOT EXISTS "Booking"(
        BookingID SERIAL PRIMARY KEY,
        UserID INT NOT NULL,
        EventID INT NOT NULL,
        BookingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        SeatsBooked INT NOT NULL,
        TotalAmount DECIMAL NOT NULL,
        FOREIGN KEY (EventID) REFERENCES "Event"(EventId) ON DELETE CASCADE
    );
`;

const bookingInput = `
    INSERT INTO "Booking"(UserID, EventID, SeatsBooked, TotalAmount)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
`;

const initializeBookingTable = async () => {
    try {
        await client.query(bookingModel);
        console.log("Successfully created the Booking table or it already exists.");
    } catch (error) {
        console.error("Error creating Booking table:", error.message);
    }
};

const insertBooking = async ({ UserID, EventID, SeatsBooked, TotalAmount }) => {
    try {
        const result = await client.query(bookingInput, [UserID, EventID, SeatsBooked, TotalAmount]);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting booking:", error.message);
        throw error;
    }
};

export { initializeBookingTable, insertBooking };
