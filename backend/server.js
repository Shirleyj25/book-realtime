const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let books = [];

io.on("connection", (socket) => {
  console.log("User connected");

  socket.emit("books", books);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/books", (req, res) => {
  res.json(books);
});

app.post("/books", (req, res) => {
  const book = {
    id: Date.now(),
    title: req.body.title,
    author: req.body.author,
  };

  books.push(book);

  io.emit("newBook", book);

  res.json(book);
});

// server.js
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port 5000");
});