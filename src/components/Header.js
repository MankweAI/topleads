"use client";

import { useState, useEffect } from "react"; // Import useEffect
import Link from "next/link";
import Image from "next/image"; 

// Define hubs data *before* the component function
const hubs = [
  // ... (keep the full hubs array definition as before)
  {
    name: "FOG Treatment",
    spokes: [
      {
        href: "/spokes/how-to-treat-high-fat-wastewater",
        title: "How to Treat High-Fat Wastewater",
      },
      {
        href: "/spokes/removing-emulsified-oils-from-industrial-wastewater",
        title: "Removing Emulsified Oils",
      },
      {
        href: "/spokes/guide-to-dissolved-air-flotation-for-fog-removal",
        title: "Guide to DAF for FOG Removal",
      },
      {
        href: "/spokes/chemical-treatment-options-for-breaking-oil-emulsions",
        title: "Chemical Treatment for Emulsions",
      },
      {
        href: "/spokes/daf-vs-oil-water-separators-for-fog",
        title: "DAF vs. Oil-Water Separators",
      },
    ],
  },
  {
    name: "Solids Removal",
    spokes: [
      {
        href: "/spokes/treating-high-density-vs-low-density-suspended-solids",
        title: "High-Density vs. Low-Density Solids",
      },
      {
        href: "/spokes/how-to-size-a-clarifier-for-mining-wastewater",
        title: "Sizing a Clarifier for Mining",
      },
      {
        href: "/spokes/using-a-daf-system-for-low-density-solids-removal",
        title: "DAF for Low-Density Solids",
      },
      {
        href: "/spokes/lamella-clarifiers-vs-conventional-clarifiers",
        title: "Lamella vs. Conventional Clarifiers",
      },
      {
        href: "/spokes/troubleshooting-high-total-suspended-solids-in-effluent",
        title: "Troubleshooting High TSS",
      },
    ],
  },
  {
    name: "DAF Design",
    spokes: [
      {
        href: "/spokes/daf-sizing-calculator-and-key-design-parameters",
        title: "DAF Sizing Calculator",
      },
      {
        href: "/spokes/how-does-a-dissolved-air-flotation-system-work",
        title: "How Does a DAF System Work?",
      },
      {
        href: "/spokes/daf-system-costs-capex-and-opex-breakdown",
        title: "DAF System Costs",
      },
      {
        href: "/spokes/daf-vs-clarifier-which-is-right-for-your-application",
        title: "DAF vs. Clarifier",
      },
      {
        href: "/spokes/how-to-optimize-chemical-dosage-for-daf-systems",
        title: "Optimize DAF Chemical Dosage",
      },
    ],
  },
  {
    name: "Clarifiers",
    spokes: [
      {
        href: "/spokes/clarifier-surface-overflow-rate-sor-calculator",
        title: "Clarifier SOR Calculator",
      },
      {
        href: "/spokes/thickener-design-for-mining-and-heavy-metals-industry",
        title: "Thickener Design for Mining",
      },
      {
        href: "/spokes/guide-to-flocculants-and-coagulants-for-sedimentation",
        title: "Guide to Flocculants & Coagulants",
      },
      {
        href: "/spokes/common-operational-problems-with-wastewater-clarifiers",
        title: "Common Clarifier Problems",
      },
      {
        href: "/spokes/the-pros-and-cons-of-lamella-clarifier-designs",
        title: "Pros & Cons of Lamella Clarifiers",
      },
    ],
  },
  {
    name: "Case Studies",
    spokes: [
      {
        href: "/spokes/guide-to-wastewater-treatment-in-the-meat-processing-industry",
        title: "Meat Processing Guide",
      },
      {
        href: "/spokes/dairy-processing-wastewater-challenges-and-solutions",
        title: "Dairy Processing Guide",
      },
      {
        href: "/spokes/key-considerations-for-food-and-beverage-wastewater-treatment",
        title: "Food & Beverage Guide",
      },
      {
        href: "/spokes/water-management-and-treatment-in-mining-and-beneficiation",
        title: "Water Management in Mining",
      },
      {
        href: "/spokes/south-african-effluent-discharge-regulations-for-industrial-sites",
        title: "SA Effluent Regulations",
      },
    ],
  },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // State to track scroll

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10); // Set true if scrolled more than 10px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup listener
  }, []);

  const scrollToHubs = () => {
    const hubsSection = document.getElementById("hubs");
    if (hubsSection) {
      hubsSection.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    // Updated header classes: transparent background, white text, sticky, transition, conditional background/shadow on scroll
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md shadow-lg"
          : "bg-transparent shadow-none"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* ✅ Logo replaced with image */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/image/logo.png"
              alt="Effluentic Logo"
              width={150}
              height={40}
              className="rounded-lg" // optional style
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {hubs.map((hub) => (
              <div key={hub.name} className="relative group">
                <button className=" text-md text-gray-200 hover:text-white transition-colors">
                  {hub.name}
                </button>
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    {hub.spokes.map((spoke) => (
                      <Link
                        href={spoke.href}
                        key={spoke.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {spoke.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={scrollToHubs}
              className="bg-brand-action-green text-brand-navy-dark font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all"
            >
              Explore Calculators
            </button>
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
          <div className="lg:hidden mt-4 space-y-2 bg-black/80 backdrop-blur-sm rounded-md p-4">
            {hubs.map((hub) => (
              <div key={hub.name} className="border-b border-gray-600 py-2">
                <p className="font-bold text-white px-4">{hub.name}</p>
                {hub.spokes.map((spoke) => (
                  <Link
                    href={spoke.href}
                    key={spoke.href}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {spoke.title}
                  </Link>
                ))}
              </div>
            ))}
            <button
              onClick={scrollToHubs}
              className="w-full text-left bg-brand-action-green text-brand-navy-dark font-bold py-3 px-4 rounded-lg mt-4"
            >
              Explore Calculators
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
