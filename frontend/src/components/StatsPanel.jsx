import { BarChart3, Link2, Trophy } from "lucide-react";
import { buildShortUrl } from "../utils/validators";

/**
 * WHY stats are derived here via plain reduce()s instead of a separate
 * backend endpoint: the frontend already has the full links array (from
 * GET /api/links) in memory. Adding a /api/stats endpoint would mean
 * maintaining two sources of truth for numbers we can compute for free.
 */
function StatsPanel({ links }) {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, l) => sum + l.clickCount, 0);
  const mostClicked = links.reduce(
    (best, l) => (!best || l.clickCount > best.clickCount ? l : best),
    null
  );

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-card__icon">
          <Link2 size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="stat-card__label">Total links</p>
          <p className="stat-card__value">{totalLinks}</p>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-card__icon">
          <BarChart3 size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="stat-card__label">Total clicks</p>
          <p className="stat-card__value">{totalClicks}</p>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-card__icon">
          <Trophy size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="stat-card__label">Most clicked</p>
          {mostClicked && mostClicked.clickCount > 0 ? (
            <p className="stat-card__value stat-card__value--link">
              {buildShortUrl(mostClicked.shortCode)}
            </p>
          ) : (
            <p className="stat-card__value stat-card__value--muted">None yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
