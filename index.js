const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let driverLocations = {};

io.on("connection", (socket) => {
  console.log("Driver Connected:", socket.id);

  socket.on("driver-location", (data) => {
    driverLocations[socket.id] = data;
    io.emit("update-location", driverLocations);
  });

  socket.on("disconnect", () => {
    delete driverLocations[socket.id];
    io.emit("update-location", driverLocations);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
