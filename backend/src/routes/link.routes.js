const express = require("express");
const { createShortLink, getAllLinks, deleteLink } = require("../controllers/link.controller");

/**
 * WHY this file only has API routes (no redirect route):
 * /:shortCode is a top-level, un-prefixed route ("GET /abc123", not
 * "GET /api/abc123") so short links stay short. It's mounted directly
 * in app.js instead, keeping this file focused on the "/api/*" surface.
 */
const router = express.Router();

router.post("/shorten", createShortLink);
router.get("/links", getAllLinks);
router.delete("/links/:shortCode", deleteLink);

module.exports = router;
