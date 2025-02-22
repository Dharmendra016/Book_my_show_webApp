import pkg from 'pg';

const { Client } = pkg;
const client = new Client({
  user: 'postgres',
  password: 'c9Pu0gzK6jFygSAJ',
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