import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected : ", socket.id);

  // Handle 'message' event
  socket.on("message", (msg) => {
    // console.log("Received message:", msg);

    // Broadcast the message to all other clients except the sender
    socket.broadcast.emit("message_from_another", {
      id: socket.id,
      message: msg.message,
      username:msg.username
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("disconnected : ", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

server.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
