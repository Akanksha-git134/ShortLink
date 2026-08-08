const Link = require("../models/Link");
const generateShortCode = require("../utils/generateShortCode");

/**
 * POST /api/shorten
 * WHY this shape: validate -> check for collision -> save -> respond.
 * Each step can fail independently and each failure gets a clear,
 * specific error instead of one generic 500.
 */
async function createShortLink(req, res, next) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "A 'url' field is required." });
    }

    try {
      new URL(url); // throws if not a valid absolute URL
    } catch {
      return res.status(400).json({ message: "Please provide a valid URL (include http:// or https://)." });
    }

    // Regenerate on the rare chance of a collision instead of trusting
    // randomness blindly — cheap insurance, given shortCode is unique.
    let shortCode;
    let exists = true;
    while (exists) {
      shortCode = generateShortCode();
      exists = await Link.exists({ shortCode });
    }

    const link = await Link.create({ originalUrl: url, shortCode });

    return res.status(201).json({ shortCode: link.shortCode });
  } catch (error) {
    next(error); // hand off to the centralized error handler
  }
}

/**
 * GET /:shortCode
 * Finds the original URL, increments the click count, redirects.
 * WHY findOneAndUpdate: it finds AND increments in a single atomic DB
 * operation, so two simultaneous clicks can't race and lose a count.
 */
async function redirectToOriginal(req, res, next) {
  try {
    const { shortCode } = req.params;

    const link = await Link.findOneAndUpdate(
      { shortCode },
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({ message: "Short link not found." });
    }

    return res.redirect(link.originalUrl);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/links
 * Returns all links, newest first, for the History section.
 */
async function getAllLinks(req, res, next) {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    return res.status(200).json(links);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/links/:shortCode
 * Removes a single link — lets you clean up test links without going
 * into MongoDB Atlas manually.
 */
async function deleteLink(req, res, next) {
  try {
    const { shortCode } = req.params;
    const deleted = await Link.findOneAndDelete({ shortCode });

    if (!deleted) {
      return res.status(404).json({ message: "Short link not found." });
    }

    return res.status(200).json({ message: "Link deleted." });
  } catch (error) {
    next(error);
  }
}

module.exports = { createShortLink, redirectToOriginal, getAllLinks, deleteLink };
