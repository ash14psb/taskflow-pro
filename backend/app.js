const express = require("express");
const cors = require("cors");
const globalErrorHandler = require("./middlewares/errorMiddleware");

// Import Routers
const authRouter = require("./routes/authRoutes");
const taskRouter = require("./routes/taskRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MOUNT ROUTES ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/api/v1/health", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "TaskFlow Pro API is running!" });
});

// --- ERROR HANDLING ---
app.use(globalErrorHandler);

module.exports = app;
