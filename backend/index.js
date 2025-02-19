import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {dbConnection} from "./utility/dbConnect.js"
import userRoutes from "./routes/userRoutes.js"
import { authentication } from "./middlewares/auth.js";
import eventRoutes from "./routes/eventRoutes.js"
import venueRoutes from "./routes/venueRoutes.js"
import seatRoutes from "./routes/seatRoutes.js"

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//db connectio 
dbConnection()


//api
app.use("/",userRoutes);
app.use("/",eventRoutes);
app.use("/",venueRoutes);
app.use("/",seatRoutes);

app.get("/", authentication,(req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
