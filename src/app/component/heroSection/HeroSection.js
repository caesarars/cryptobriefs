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
          <h4 className="display-6 fw-bold mb-4">
            Understand Crypto in 60 Seconds a Day
          </h4>
          <p className="lead mb-4 subheadline glow-hover">
            News sentiment, trends, and insights—without the noise.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/blogs" className="btn btn-glow btn-lg">
              Get Today’s Crypto Brief
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;
