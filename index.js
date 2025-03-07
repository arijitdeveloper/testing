const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

let driverLocation = {}; // Store driver locations

io.on("connection", (socket) => {
    console.log(`✅ Client Connected: ${socket.id}`);

    // Receive location from driver
    socket.on("send-location", (data) => {
        console.log("📍 Driver Location:", data);
        driverLocation[data.id] = { lat: data.lat, lon: data.lon };
        io.emit("update-location", driverLocation); // Send to company
    });

    socket.on("disconnect", () => {
        console.log(`❌ Client Disconnected: ${socket.id}`);
    });
});

server.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});
