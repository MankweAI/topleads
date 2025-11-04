"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  WrenchScrewdriverIcon,
  FireIcon,
  HomeModernIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";

// Define Topleads hubs (for the nav)
const hubs = [
  { name: "Plumbers", href: "/spokes/plumbers", icon: WrenchScrewdriverIcon },
  { name: "HVAC", href: "/spokes/hvac", icon: FireIcon },
  { name: "Roofers", href: "/spokes/roofers", icon: HomeModernIcon },
  { name: "Electricians", href: "/spokes/electricians", icon: BoltIcon },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simple SVG Logo for "TOPLEADS" in white
  const Logo = () => (
    <Link href="/" className="flex items-center">
      <span className="text-2xl font-extrabold text-[#ffffff] tracking-wider">
        TOPLEADS
      </span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {hubs.map((hub) => (
              <Link
                key={hub.name}
                href={hub.href}
                className="flex items-center gap-1 text-md font-medium text-[#94a3b8] hover:text-[#84cc16] transition-colors"
              >
                <hub.icon className="h-5 w-5" />
                <span>{hub.name}</span>
              </Link>
            ))}
            <Link
              href="/#hero-funnel" // Links to homepage hero
              className="bg-[#84cc16] text-[#0f172a] font-bold py-2 px-5 rounded-full hover:bg-[#a3e635] transition-all transform hover:scale-105"
            >
              Run New Audit
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#94a3b8] hover:text-[#ffffff]"
              aria-label="Toggle menu"
            >
              <svg
                className="h-7 w-7"
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
                      ? "M6 18L18 6M6 6l12 12" // X icon
                      : "M4 6h16M4 12h16m-7 6h7" // Hamburger icon
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 space-y-2 rounded-md p-4 bg-[#0f172a] border-t border-[#64748b]/20">
            {hubs.map((hub) => (
              <Link
                href={hub.href}
                key={hub.name}
                className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-[#94a3b8] hover:text-[#84cc16] hover:bg-[#64748b]/10 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <hub.icon className="h-6 w-6" />
                <span>{hub.name}</span>
              </Link>
            ))}
            <Link
              href="/#hero-funnel"
              className="block w-full text-center bg-[#84cc16] text-[#0f172a] font-bold py-3 px-4 rounded-lg mt-4 hover:bg-[#a3e635] transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Run New Audit
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
