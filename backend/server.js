require("dotenv").config();
const http = require("http"); // Required for Socket.io
const { Server } = require("socket.io"); // Import Socket.io
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// 1. Wrap Express inside a Node HTTP server
const server = http.createServer(app);

// 2. Initialize Socket.io on top of the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

// 3. Listen for real-time WebSocket connections
io.on("connection", (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // When a user opens a specific workspace board, they join a "room"
  socket.on("join_workspace", (workspaceId) => {
    socket.join(workspaceId);
    console.log(`User joined workspace: ${workspaceId}`);
  });

  // When a user drags and drops a task, broadcast it to everyone else in that workspace
  socket.on("task_moved", (data) => {
    // Sends the new task position to everyone EXCEPT the person who moved it
    socket.to(data.workspaceId).emit("update_board", data);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

// 4. Connect to DB and start the HTTP SERVER (not the express app directly)
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(
        `[Server] running in ${process.env.NODE_ENV} mode on port ${PORT}`,
      );
    });
  } catch (error) {
    console.error(`[Server Error]: ${error.message}`);
    process.exit(1);
  }
};

startServer();
