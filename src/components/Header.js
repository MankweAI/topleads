"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Define Topleads hubs (our industries)
const hubs = [
  {
    name: "Plumbers",
    href: "/spokes/plumbers",
  },
  {
    name: "HVAC",
    href: "/spokes/hvac",
  },
  {
    name: "Roofers",
    href: "/spokes/roofers",
  },
  {
    name: "Electricians",
    href: "/spokes/electricians",
  },
];

// Simple SVG Logo for "TOPLEADS"
function TopleadsLogo() {
  return (
    <svg
      width="140"
      height="40"
      viewBox="0 0 140 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="140" height="40" rx="8" fill="transparent" />
      <text
        x="70"
        y="25"
        fontFamily="var(--font-geist-sans)"
        fontSize="20"
        fill="white"
        textAnchor="middle"
        fontWeight="600"
        letterSpacing="0.05em"
      >
        TOPLEADS
      </text>
    </svg>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-navy-dark/90 backdrop-blur-md shadow-lg"
          : "bg-brand-navy-dark/70 shadow-none"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <TopleadsLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {hubs.map((hub) => (
              <Link
                key={hub.name}
                href={hub.href}
                className="text-md text-gray-200 hover:text-white transition-colors"
              >
                {hub.name}
              </Link>
            ))}
            <Link
              href="/#cta" // Placeholder link
              className="bg-brand-action-green text-brand-navy-dark font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all"
            >
              About Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16m-7 6h7"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 space-y-2 bg-brand-navy-dark/90 backdrop-blur-sm rounded-md p-4">
            {hubs.map((hub) => (
              <Link
                href={hub.href}
                key={hub.name}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {hub.name}
              </Link>
            ))}
            <Link
              href="/#cta" // Placeholder
              className="w-full text-left bg-brand-action-green text-brand-navy-dark font-bold py-3 px-4 rounded-lg mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
