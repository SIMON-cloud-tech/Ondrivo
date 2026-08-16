// ──────────────────────────────────────────────────────────────
//  src/Components/Loader.jsx
//  Ondrivo — Logo Pulse Loader
// ──────────────────────────────────────────────────────────────

import '../css/Loader.css';

const Loader = () => {
  return (
    <div className="loader-wrapper">
      {/* ── Logo Image with Pulse Ring ── */}
      <div className="loader-logo">
        <img
          src="/ondrivo_logo.png"  // ← Replace with your logo path
          alt="Ondrivo Logo"
          className="loader-logo-image"
        />
        <div className="loader-pulse-ring"></div>
      </div>

      {/* ── Brand Name ── */}
      <h1 className="loader-brand">Ondrivo</h1>

      {/* ── Tagline ── */}
      <p className="loader-tagline">Websites built to last, not to disappear.</p>

      {/* ── Pulsing Dots ── */}
      <div className="loader-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default Loader;