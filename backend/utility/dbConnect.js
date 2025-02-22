import pkg from 'pg';
import "dotenv/config";

const { Client } = pkg;
const client = new Client({
  user: 'postgres',
  password: process.env.PG_PASSWORD,
  host: 'db.qlruphidgwrlqeuaithg.supabase.co',
  port: 6543,
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