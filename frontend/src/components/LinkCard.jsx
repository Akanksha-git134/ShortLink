import { Check, Clock, Copy, ExternalLink, MousePointerClick, Trash2 } from "lucide-react";
import { buildShortUrl, formatDate, truncateMiddle } from "../utils/validators";

function LinkCard({ link, onCopy, copiedCode, onDelete }) {
  const shortUrl = buildShortUrl(link.shortCode);
  const isCopied = copiedCode === link.shortCode;

  return (
    <article className="link-card">
      <p className="link-card__original" title={link.originalUrl}>
        {truncateMiddle(link.originalUrl)}
      </p>
      <p className="link-card__short">{shortUrl}</p>

      <div className="link-card__meta">
        <span className="badge">
          <MousePointerClick size={12} aria-hidden="true" />
          {link.clickCount} {link.clickCount === 1 ? "click" : "clicks"}
        </span>
        <span className="link-card__date">
          <Clock size={12} aria-hidden="true" /> {formatDate(link.createdAt)}
        </span>
      </div>

      <div className="link-card__actions">
        <button
          className={`btn btn-ghost ${isCopied ? "btn-ghost--copied" : ""}`}
          onClick={() => onCopy(link.shortCode)}
          aria-label={`Copy short link for ${link.originalUrl}`}
        >
          {isCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {isCopied ? "Copied" : "Copy"}
        </button>
        
          <a className="btn btn-ghost"
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open original link for ${link.originalUrl}`}
        >
          <ExternalLink size={14} aria-hidden="true" /> Open
        </a>
        <button
          className="btn btn-ghost btn-ghost--danger"
          onClick={() => {
            if (window.confirm("Delete this short link? This can't be undone.")) {
              onDelete(link.shortCode);
            }
          }}
          aria-label={`Delete short link for ${link.originalUrl}`}
        >
          <Trash2 size={14} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default LinkCard;