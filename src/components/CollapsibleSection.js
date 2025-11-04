// src/components/CollapsibleSection.js
"use client";

import { useState } from "react";

export default function CollapsibleSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-brand-navy-dark hover:text-blue-600 focus:outline-none transition-colors"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {/* Improved Chevron Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {/* Smooth transition for content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-screen mt-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-brand-steel-dark prose prose-sm sm:prose-base max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
