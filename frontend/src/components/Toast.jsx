import { AlertCircle, Check, X } from "lucide-react";

/**
 * WHY aria-live="polite" on the wrapper: screen readers announce new
 * toasts as they appear without interrupting whatever the user is
 * currently doing — the right level of urgency for "link copied", wrong
 * for something like a security warning (which would need "assertive").
 */
function ToastStack({ toasts, dismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.tone}`} role="status">
          {t.tone === "error" ? (
            <AlertCircle size={16} aria-hidden="true" />
          ) : (
            <Check size={16} aria-hidden="true" />
          )}
          <span>{t.message}</span>
          <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
