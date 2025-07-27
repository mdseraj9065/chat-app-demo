import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
const server = new createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hii, i am root");
  console.log("Hii, i am a root");
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // socket.emit("welcome", `Welcome to the server`);
  socket.broadcast.emit("welcome", `${socket.id} joined the server`);

  socket.on("message", ({message, room}) => {
    console.log(`message = ${message}, room = ${room}`);
    socket.to(room).emit("recieved-message", message);
  })

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  })
});

server.listen(1234, () => {
  console.log("Listen to port 1234");
});
