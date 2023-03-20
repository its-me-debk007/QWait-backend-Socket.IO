const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
 });



io.on("connection", (socket) => {
  console.log("Connected to Socket.IO! \n")

socket.on('join', function(accessToken, store, latitude, longitude) {

    data = {
        "latitude": parseFloat(latitude),
        "longitude": parseFloat(longitude)
    };

    fetch(`http://192.168.137.67:8080/api/v1/join/${store}`, {
        
    method: "POST", // or 'PUT'
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    },
    
    body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((res) => {
        console.log("Success:", res);
        io.emit("queue", res)
    })
    .catch((error) => {
        console.error("Error:", error);
    });
        
    })


  socket.on('leave', function(accessToken, store) {

    fetch(`http://192.168.137.67:8080/api/v1/leave/${store}`, {
    method: "POST", // or 'PUT'
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    },

    })
    .then((response) => response.json())
    .then((res) => {
        console.log("Success:", res);
        io.emit("queue", res)
    })
    .catch((error) => {
        console.error("Error:", error);
    });
})
});

console.log("SOCKET IO SERVER RUNNING");

httpServer.listen(3000);