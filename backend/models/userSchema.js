import { client } from "../utility/dbConnect.js";


const userModel = `
    CREATE TYPE role_enum AS ENUM ('admin', 'user');

    CREATE TABLE IF NOT EXISTS "User"(
        UserId SERIAL PRIMARY KEY,
        Name VARCHAR(50) NOT NULL,
        Email VARCHAR(50) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,
        PhoneNo VARCHAR(15),
        Role role_enum DEFAULT 'user',
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;


const userInput = `
    INSERT INTO "User"(Name, Email, Password, PhoneNo, Role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
`;


const initializeUserTable = async () => {
    try {
        await client.query(userModel);
        console.log("Successfully created the User table or it already exists.");
    } catch (error) {
        console.error("Error creating User table:", error.message);
    }
};

const insertUser = async ({ Name, Email, Password, PhoneNo, Role }) => {
    try {
        const result = await client.query(userInput, [Name, Email, Password, PhoneNo, Role]);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting user:", error.message);
    }
};

export {
    initializeUserTable,
    insertUser
};
