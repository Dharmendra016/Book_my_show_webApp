import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {dbConnect} from "./utility/dbConnect.js"
import userRoutes from "./routes/userRoutes.js"
import { authentication } from "./middlewares/auth.js";
import eventRoutes from "./routes/eventRoutes.js"
import venueRoutes from "./routes/venueRoutes.js"
import seatRoutes from "./routes/seatRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import { initializeBookingTable } from "./models/bookingSchema.js";
import { initializeEventTable } from "./models/eventSchema.js";
import { initializeSeatTable } from "./models/seatSchema.js";
import { initializeUserTable } from "./models/userSchema.js";
import { initializeVenueTable } from "./models/venueSchema.js";

import path from "path";
const app = express();

const PORT = process.env.PORT || 8000;

const __dirname = path.resolve();
app.use(cors({
  origin: [
    "https://book-my-show-webapp-1.onrender.com",
    "http://localhost:3000",
    "https://book-my-show-webapp.vercel.app",
    "http://localhost:5173",
    "https://book-my-show-web-app.vercel.app"
  ],
  methods: "GET, POST, PUT, DELETE",
  credentials: true, // Important for cookies and sessions
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//db connectio 
dbConnect();
//api
app.use("/",userRoutes);
app.use("/",eventRoutes);
app.use("/",venueRoutes);
app.use("/",seatRoutes);
app.use("/",bookingRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

// table initialization
const initializeTables = async () => {
  await initializeBookingTable();
  await initializeEventTable();
  await initializeSeatTable(); 
  await initializeUserTable(); 
  await initializeVenueTable(); 
}


try {
  initializeTables();
} catch (error) {
  console.log(error); 
}


app.get("/", authentication,(req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
