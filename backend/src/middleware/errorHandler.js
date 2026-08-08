/**
 * Centralized error handler — the last piece of middleware in the chain.
 * WHY: without this, every controller needs its own try/catch and its own
 * opinion on status codes. With this, controllers just call next(error)
 * and this one place decides how errors look to the client.
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server.";

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
