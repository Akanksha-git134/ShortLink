import { Link2 } from "lucide-react";

/**
 * WHY it's this simple: the spec calls for a Navbar, not a nav menu. A
 * single brand mark plus a live status badge is all this product needs —
 * adding nav links to pages that don't exist would be building for a
 * future the spec never asked for.
 */
function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a className="brand" href="#top">
          <span className="brand__icon">
            <Link2 size={18} aria-hidden="true" />
          </span>
          ShortLink
        </a>
      </div>
    </header>
  );
}

export default Navbar;
