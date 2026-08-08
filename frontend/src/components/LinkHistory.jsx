import { Link2 } from "lucide-react";
import LinkCard from "./LinkCard.jsx";

function LinkHistory({ links = [], loading, onCopy, copiedCode, onDelete }) {
  if (loading) {
    return <p className="section__desc">Loading your links…</p>;
  }

  if (links.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">
          <Link2 size={20} aria-hidden="true" />
        </span>
        <p className="empty-state__title">No links yet</p>
        <p className="empty-state__desc">Shorten your first URL above to see it show up here.</p>
      </div>
    );
  }

  return (
    <div className="history-grid">
      {links.map((link) => (
        <LinkCard key={link.shortCode} link={link} onCopy={onCopy} copiedCode={copiedCode} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default LinkHistory;