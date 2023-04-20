const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const port = 3001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("hello");
});

let users = [];
const onConnected = (socket) => {
  users = [...users, socket.id];

  io.emit("online-member", users.length);
  console.log("users", users);

  socket.on("message", (message) => {
    socket.broadcast.emit("emit-messages", message);
  });

  socket.on("disconnect", () => {
    users = users.filter((id) => id !== socket.id);
    io.emit("online-member", users.length);
  });
};

io.on("connection", onConnected);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
