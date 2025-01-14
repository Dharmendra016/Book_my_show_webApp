import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config"
import express from "express"

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 8000; 

const io = new Server(httpServer,{});

io.on("connection", (socketId) => {
    console.log(`user get connected: ${socketId}`);
})

httpServer.listen(PORT , () => {
    console.log(`Server started at port: ${PORT}`);
})
export {app, io};