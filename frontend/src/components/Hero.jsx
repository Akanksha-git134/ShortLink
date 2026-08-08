import { MousePointerClick } from "lucide-react";

function Hero() {
  return (
    <div className="hero__content">
      <span className="hero__eyebrow">
        <MousePointerClick size={13} aria-hidden="true" /> Free &amp; instant
      </span>
      <h1 className="hero__title">
        Shorten links. <em>Track every click.</em>
      </h1>
      <p className="hero__subtitle">
        Paste a long URL, get a short one back in seconds, and watch clicks
        roll in — no account required.
      </p>
    </div>
  );
}

export default Hero;
