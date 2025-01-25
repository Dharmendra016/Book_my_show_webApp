import { client } from "../utility/dbConnect.js";

const venueModel = `
    CREATE TABLE IF NOT EXISTS "Venue"(
        VenueId SERIAL PRIMARY KEY,
        Name VARCHAR(100) NOT NULL,
        Location VARCHAR(255) NOT NULL,
        Capacity INT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const venueInput = `
    INSERT INTO "Venue"(Name, Location, Capacity)
    VALUES ($1, $2, $3)
    RETURNING *;
`;

const initializeVenueTable = async () => {
    try {
        await client.query(venueModel);
        console.log("Successfully created the Venue table or it already exists.");
    } catch (error) {
        console.error("Error creating Venue table:", error.message);
    }
};

const insertVenue = async ({ Name, Location, Capacity }) => {
    try {
        const result = await client.query(venueInput, [Name, Location, Capacity]);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting venue:", error.message);
        throw error;
    }
};

export {
    initializeVenueTable,
    insertVenue
};
