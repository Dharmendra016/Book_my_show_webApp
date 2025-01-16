import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnection from "./utility/dbConnect.js"
 
const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser());


//db connectio 
dbConnection()

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
