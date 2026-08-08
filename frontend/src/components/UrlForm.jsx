import { useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { isValidUrl } from "../utils/validators";

/**
 * WHY this component owns its own input/error/loading state instead of
 * lifting it all to Home: the *typing and validating* of a URL is this
 * form's own concern. It only calls up to the parent (via onShorten) once
 * it has a URL it's confident is valid — Home only ever deals with
 * finished results, not half-typed input.
 */
function UrlForm({ onShorten }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = value.trim();
    if (!trimmed) {
      setError("Enter a URL to shorten.");
      inputRef.current?.focus();
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError("Enter a valid URL starting with http:// or https://");
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      await onShorten(trimmed);
      setValue("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="shorten-form" onSubmit={handleSubmit} noValidate>
      <div className="shorten-form__field">
        <label className="shorten-form__label" htmlFor="url-input">
          Long URL
        </label>
        <input
          ref={inputRef}
          id="url-input"
          type="text"
          inputMode="url"
          className="shorten-form__input"
          placeholder="https://example.com/a/very/long/path"
          value={value}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "url-error" : undefined}
          disabled={loading}
        />
        {error && (
          <p className="field-error" id="url-error" role="alert">
            <AlertCircle size={14} aria-hidden="true" /> {error}
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Shortening…" : "Shorten URL"}
      </button>
    </form>
  );
}

export default UrlForm;
