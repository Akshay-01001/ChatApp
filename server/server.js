import express from 'express'
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", ({ roomName, username }) => {
    socket.join(roomName);
    console.log(`${username} joined room: ${roomName}`);
    io.to(roomName).emit("room-message", {
      username: "System",
      message: `${username} has joined the room.`,
    });
  });

  socket.on("message", ({ roomName, username, message }) => {
    socket.to(roomName).emit("recv-msg", { username, message });
  });

  socket.on("leave-room", ({ roomName, username }) => {
    socket.leave(roomName);
    console.log(`${username} left room: ${roomName}`);
    io.to(roomName).emit("room-message", {
      username: "System",
      message: `${username} has left the room.`,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
