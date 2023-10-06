const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const cors = require("cors");

app.use(express.json());
app.use(cors());

// console.log(questions[0]);

const users = [];

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join_room", (user) => {
    socket.join(user.room);
    console.log("joined room", user.nickname);
    users.push(user);

    console.log(user);
    console.log(`${user.nickname} joined room ${user.room}`);

    socket.to(user.room).emit("joined", `${user.nickname} joined the chat`);
    socket.emit("welcome", `welcome to the chat ${user.nickname}`);

    io.to(user.room).emit("usersdata", users);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001);