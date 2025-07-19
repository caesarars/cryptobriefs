'use client'
import { useEffect, useState } from 'react';
import "./HeroSection.css";
import Link from "next/link";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="wrapper_section_hero p-5">
      <section className="text-white py-5">
        <div className="container text-center">
          <h4 className="display-6 fw-bold mb-4">
            Your Friendly Guide to the Crypto Space
          </h4>
          <p className="lead mb-4 subheadline glow-hover">
            Explore the world of crypto with easy-to-follow news, tips, and guides made for everyone.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/blogs" className="btn btn-glow btn-lg">
              Start Reading
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;
