'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  if (!mounted) return null; // ⛔ Hindari render sebelum hydration selesai

  return (
    <nav className="navbar navbar-expand-lg px-4 py-3 wrapper_nav_3" style={{ backgroundColor: "black", color: "white" }}>
      <div className="container-fluid wrapper_inside d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand fw-bold space-title text-white" style={{ fontSize: '2em' }}>
          Crypto Briefs
        </Link>

        <button
          className="navbar-toggler text-white"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
      </div>

      <div
        className={`collapse navbar-collapse justify-content-end px-4 ${menuOpen ? 'show' : ''}`}
        id="navbarNav"
        style={{ borderRadius: '10px', marginTop: '0.5rem' }}
      >
        <ul className="navbar-nav general-font w-100 text-center">
          {[
            ['/', 'Home'],
            ['/airdrops', 'Airdrops'],
            ['/blogs', 'Blog'],
            ['/news', 'News'],
            ['/contact', 'Contact'],
          ].map(([href, label]) => (
            <li key={label} className="nav-item">
              <Link href={href} className="nav-link text-white">{label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
