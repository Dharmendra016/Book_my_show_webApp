import pkg from 'pg';
import dotenv from "dotenv";
dotenv.config();

const { Client } = pkg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }  // 🔥 Important for Render → Supabase
  });
  

const dbConnect = async ()=>{
    try {
        await client.connect();
        return console.log('Successfully connected to pgDB');
    } catch (error) {
        console.log(error.message);
    }
}

export {dbConnect, client};