import { Check, Copy, ExternalLink } from "lucide-react";
import { buildShortUrl } from "../utils/validators";

/**
 * WHY this is its own component instead of inline in Home: it has its own
 * small piece of transient UI state (copiedCode) and a distinct visual
 * treatment (the accent-colored card). Splitting it out keeps Home
 * readable as "the page that composes sections," not "the page that also
 * manages copy-button animations."
 */
function ResultCard({ link, onCopy, copiedCode }) {
  if (!link) return null;

  const shortUrl = buildShortUrl(link.shortCode);
  const isCopied = copiedCode === link.shortCode;

  return (
    <div className="result-card">
      <span className="result-card__link">{shortUrl}</span>
      <div className="result-card__actions">
        <button
          className={`btn btn-ghost ${isCopied ? "btn-ghost--copied" : ""}`}
          onClick={() => onCopy(link.shortCode)}
        >
          {isCopied ? (
            <>
              <Check size={15} aria-hidden="true" /> Copied
            </>
          ) : (
            <>
              <Copy size={15} aria-hidden="true" /> Copy
            </>
          )}
        </button>
        <a className="btn btn-ghost" href={shortUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={15} aria-hidden="true" /> Open
        </a>
      </div>
    </div>
  );
}

export default ResultCard;
