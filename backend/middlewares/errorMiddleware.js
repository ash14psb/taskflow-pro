const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // In development, we want to see the full stack trace to debug
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // In production, we hide the stack trace
  else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
};

module.exports = globalErrorHandler;
