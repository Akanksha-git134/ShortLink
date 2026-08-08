import { useCallback, useState } from "react";

/**
 * WHY a custom hook and not a component: toast state (the list, adding,
 * auto-dismissing, removing) is reusable logic with no markup of its own.
 * That's exactly what a hook is for — the <Toast> component only renders.
 */
export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, tone = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}
