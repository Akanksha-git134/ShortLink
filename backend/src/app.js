const express = require("express");
const cors = require("cors");
const linkRoutes = require("./routes/link.routes");
const { redirectToOriginal } = require("./controllers/link.controller");
const errorHandler = require("./middleware/errorHandler");

/**
 * WHY app.js is separate from server.js: app.js only configures Express
 * (middleware + routes). It never calls app.listen(). That means we could
 * import `app` into a test file and hit it with supertest without ever
 * opening a real network port — a clean separation worth mentioning.
 */
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", linkRoutes);

// Top-level so short links read as "yourdomain.com/abc123", not "/api/abc123"
app.get("/:shortCode", redirectToOriginal);

app.use(errorHandler); // must be registered last

module.exports = app;
