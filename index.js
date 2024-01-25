const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(express.static("public"));

app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomID) => {
    socket.join(roomID);
    socket.to(roomID).emit("user-connected", socket.id);
    socket.on("disconnect", () => {
      socket.to(roomID).emit("user-disconnected", socket.id);
    });
  });

  socket.on("offer", (offer, userId, roomID) => {
    socket.to(roomID).emit("offer", offer, socket.id);
  });

  socket.on("answer", (answer, userId, roomID) => {
    socket.to(roomID).emit("answer", answer, socket.id);
  });

  socket.on("ice-candidate", (candidate, userId, roomID) => {
    socket.to(roomID).emit("ice-candidate", candidate, socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
