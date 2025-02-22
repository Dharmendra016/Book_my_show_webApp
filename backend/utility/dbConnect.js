import pkg from 'pg';
import dotenv from "dotenv";

dotenv.config(); // Load environment variables
const { Client } = pkg;
const client = new Client({
  user: 'postgres',
  password: process.env.PASS_SUPA,
  host: 'db.qlruphidgwrlqeuaithg.supabase.co',
  port: 5432,
  database: 'postgres',
})

const dbConnect = async ()=>{
    try {
        await client.connect();
        return console.log('Successfully connected to pgDB');
    } catch (error) {
        console.log(error.message);
    }
}

export {dbConnect, client};