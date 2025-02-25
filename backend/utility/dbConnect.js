// import pkg from 'pg';
// import dotenv from "dotenv";
// dotenv.config();

// const { Client } = pkg;
// const client = new Client({
//   user: 'postgres_kguw_user',
//   password: process.env.PASS_SUPA,
//   host: 'dpg-cuuo5slds78s73b2368g-a',
//   port: 5432,
//   database: 'postgres_kguw',
// })

// const dbConnect = async ()=>{
//     try {
//         await client.connect();
//         return console.log('Successfully connected to pgDB');
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// export {dbConnect, client};

import pkg from 'pg';
import dotenv from "dotenv";
dotenv.config();

const { Client } = pkg;

// PostgreSQL connection with Render
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // 🔥 Required for Render PostgreSQL
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("✅ Successfully connected to PostgreSQL on Render");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  }
};

export { dbConnect, client };
