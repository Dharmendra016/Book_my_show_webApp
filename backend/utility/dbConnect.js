import pkg from 'pg';
import "dotenv/config";

const { Client } = pkg;

const client = new Client({
	user: process.env.PG_NAME,
	password: process.env.PG_PASSWORD,
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	database: process.env.DB_NAME,
});

const dbConnection = async () => {
    try {
        console.log("Hello");
        await client.connect();
        
        console.log("successfully connection to database !!");

    } catch (error) {
        console.log(error.message);
        console.log("Failed to connect to database");
    }
}

export default dbConnection; 