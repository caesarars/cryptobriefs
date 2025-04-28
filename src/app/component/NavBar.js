// components/Navbar.tsx
'use client'; // <-- Penting karena ada interaksi klik!

import React, { useState } from "react";
import Link from "next/link";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <nav className="navbar navbar-expand-lg px-4 py-3 wrapper_nav_3" style={{backgroundColor:"black", color:"white"}}>
      <div className="container-fluid wrapper_inside d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand fw-bold space-title text-white" style={{ fontSize: '2em' }}>
          Crypto Briefs
        </Link>

        {/* Hamburger toggle button */}
        <button
          className="navbar-toggler text-white"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      {/* Collapse area */}
      <div
        className={`collapse navbar-collapse justify-content-end px-4 ${menuOpen ? 'show' : ''}`}
        id="navbarNav"
        style={{
          borderRadius: '10px',
          marginTop: '0.5rem',
        }}
      >
        <ul className="navbar-nav general-font w-100 text-center">
          <li className="nav-item">
            <Link href="/" className="nav-link text-white">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/airdrops" className="nav-link text-white">
              Airdrops
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/blogs" className="nav-link text-white">
              Blog
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/news" className="nav-link text-white">
              News
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/contact" className="nav-link text-white">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
