// ──────────────────────────────────────────────────────────────
//  src/components/Navbar.jsx
//  Ondrivo — Main Navigation Component
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiPhone, FiMail } from 'react-icons/fi';
import '../css/Navbar.css';

// ── Navigation menu items ──
const MENU_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Case Studies', path: '/proofs' },
  { label: 'Projects', path: '/projects' },
  {label: 'Services', path: '/services' },
  { label: 'Blog', path: '/blogs' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  // ── State: mobile menu open/closed ──
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Handlers ──
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          TOP CONTACT BAR — Phone & Email
          ═══════════════════════════════════════════════ */}
      <div className="top-bar">
        <div className="top-bar-container">
          <a href="tel:+254703433014" className="top-bar-link">
            <FiPhone size={14} />
            <span>+254 703 433 014</span>
          </a>
          <a href="mailto:simonmbithi143@gmail.com" className="top-bar-link">
            <FiMail size={14} />
            <span>simonmbithi143@gmail.com</span>
          </a>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MAIN NAVBAR
          ═══════════════════════════════════════════════ */}
      <nav className="navbar">
        <div className="navbar-container">

          {/* ── LEFT: Brand Name (desktop only) ── */}
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            Ondrivo
          </Link>

          {/* ── CENTER: Logo Image (visible on all screens) ── */}
          <div className="navbar-logo">
            <img
              src="/ondrivo_logo.png" 
              alt="Ondrivo Logo"
              className="logo-image"
            />
          </div>

          {/* ── RIGHT: Desktop Menu ── */}
          <ul className="nav-menu">
            {MENU_ITEMS.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── RIGHT END: Hamburger (Mobile) ── */}
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* ═══════════════════════════════════════════════
            MOBILE DROPDOWN MENU (Slide‑in)
            ═══════════════════════════════════════════════ */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-nav-menu">
            {MENU_ITEMS.map((item) => (
              <li key={item.path} className="mobile-nav-item">
                <Link
                  to={item.path}
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;