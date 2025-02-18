import { client } from "../utility/dbConnect.js";

const eventModel = `
    CREATE TABLE IF NOT EXISTS "Event" (
        EventID SERIAL PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Description TEXT,
        Genre VARCHAR(50),
        Language VARCHAR(50),
        Duration INT,
        DateTime TIMESTAMP,
        PricePerSeat DECIMAL(10, 2),
        VenueID INT,
        CreatedByUserID INT,
        FOREIGN KEY (VenueID) REFERENCES "Venue"(venueid) ON DELETE CASCADE,
        FOREIGN KEY (CreatedByUserID) REFERENCES "User"(userid) ON DELETE CASCADE
    );
`;

const eventInsert = `
    INSERT INTO "Event"(Name, Description, Genre, Language, Duration, DateTime, PricePerSeat, VenueID, CreatedByUserID)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
`;

const initializeEventTable = async () => {
    try {
        await client.query(eventModel);
        console.log("Successfully created Event table or it already exists.");
    } catch (error) {
        console.error("Error creating Event table:", error.message);
    }
};

const insertEvent = async ({ Name, Description, Genre, Language, Duration, DateTime, PricePerSeat, VenueID, CreatedByUserID }) => {
    try {
        const result = await client.query(eventInsert, [
            Name,
            Description,
            Genre,
            Language,
            Duration,
            DateTime,
            PricePerSeat,
            VenueID,
            CreatedByUserID,
        ]);
        return result.rows[0]; 
    } catch (error) {
        console.error("Error inserting event:", error.message);
    }
};

export { initializeEventTable, insertEvent };
