'use client'
import Link from "next/link";
import { useEffect, useState } from 'react';
import "./HeroSection.css";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="wrapper_section_hero p-5">
      <section className="text-white py-5">
        <div className="container text-center">
          <h1 className="display-6 fw-bold mb-3 hero-title">
            Understand Crypto in 60 Seconds a Day
          </h1>
          <p className="lead mb-4 subheadline glow-hover hero-subtitle">
            Sentiment, top movers, and one clear takeaway—without the noise.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap mb-3">
            <Link href="/brief" className="btn btn-glow btn-lg">
              Read today’s brief
            </Link>
            <Link href="/subscribe" className="btn btn-outline-light btn-lg btn-ghost">
              Join the newsletter
            </Link>
          </div>

          <div className="hero-trust container mt-4">
            <div className="row g-3 justify-content-center">
              <div className="col-12 col-md-4">
                <div className="hero-trust-card">
                  <div className="hero-trust-top">
                    <span className="hero-trust-icon">01</span>
                    <div className="hero-trust-title">Fast</div>
                  </div>
                  <div className="hero-trust-text">A quick daily read you can finish in a minute.</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="hero-trust-card">
                  <div className="hero-trust-top">
                    <span className="hero-trust-icon">02</span>
                    <div className="hero-trust-title">Signal & context</div>
                  </div>
                  <div className="hero-trust-text">Sentiment + movers + why it matters.</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="hero-trust-card">
                  <div className="hero-trust-top">
                    <span className="hero-trust-icon">03</span>
                    <div className="hero-trust-title">No shilling</div>
                  </div>
                  <div className="hero-trust-text">Curated insights. No hype, no spam.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;
