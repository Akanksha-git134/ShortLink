const mongoose = require("mongoose");

/**
 * The Link schema is the single source of truth for what a "shortened URL"
 * is in this system. Keeping it minimal on purpose — this is a URL
 * shortener, not a link-management platform, so we resist adding fields
 * like "tags" or "userId" that nothing in the spec asked for.
 */
const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, "Original URL is required"],
    trim: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true, // enforced at the DB level, not just in application code
    index: true, // this field is looked up on every redirect — index it
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Link", linkSchema);
