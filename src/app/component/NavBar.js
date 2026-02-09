'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./NavBar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  // Show skeleton while loading
  if (!mounted) {
    return (
      <nav className="navbar-skeleton">
        <div className="navbar-skeleton-container">
          <div className="skeleton-brand"></div>
          <div className="skeleton-nav-links">
            <div className="skeleton-nav-item"></div>
            <div className="skeleton-nav-item"></div>
            <div className="skeleton-nav-item"></div>
            <div className="skeleton-nav-item"></div>
            <div className="skeleton-nav-item"></div>
            <div className="skeleton-nav-item"></div>
          </div>
        </div>
      </nav>
    );
  }

  // Primary navigation links
  const primaryLinks = [
    ["/", "Home"],
    ["/brief", "Brief"],
    ["/subscribe", "Subscribe"],
    ["/blogs", "Blog"],
    ["/news", "News"],
    ["/airdrops", "Airdrops"],
  ];

  // Dropdown links (More menu)
  const dropdownLinks = [
    ["/about", "About"],
    ["/advertise", "Advertise"],
    ["/contact", "Contact"],
  ];

  return (
    <nav
      className="navbar navbar-expand-lg px-4 py-3 wrapper_nav_3"
      style={{ backgroundColor: "black", color: "white" }}
    >
      <div className="container-fluid wrapper_inside d-flex justify-content-between align-items-center">
        <Link
          href="/"
          className="navbar-brand fw-bold space-title text-white brand-title"
        >
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
        className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
        id="navbarNav"
        style={{ borderRadius: "10px", marginTop: "0.5rem" }}
      >
        <ul className="navbar-nav general-font ms-auto nav-links">
          {/* Primary Links */}
          {primaryLinks.map(([href, label]) => (
            <li key={label} className="nav-item">
              <Link href={href} className="nav-link text-white">
                {label}
              </Link>
            </li>
          ))}

          {/* Dropdown Menu */}
          <li className="nav-item nav-dropdown">
            <button
              className="nav-link text-white nav-dropdown-toggle"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              More <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
            </button>

            {dropdownOpen && (
              <ul className="nav-dropdown-menu">
                {dropdownLinks.map(([href, label]) => (
                  <li key={label}>
                    <Link href={href} className="nav-dropdown-item">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
