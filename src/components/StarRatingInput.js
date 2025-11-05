// src/components/StarRatingInput.js
"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

// A custom, clickable star rating component
export default function StarRatingInput({ value, onChange }) {
  const [hoverRating, setHoverRating] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="flex" onMouseLeave={() => setHoverRating(0)}>
        {stars.map((starValue) => (
          <StarIcon
            key={starValue}
            className={`w-12 h-12 cursor-pointer transition-colors ${
              (hoverRating || value) >= starValue
                ? "text-[#dac507]" // tl-leak (orange)
                : "text-[#e2e8f0]" // slate-200
            }`}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
          />
        ))}
      </div>
      <span className="text-4xl font-extrabold text-[#4f46e5] w-32 text-center">
        {value.toFixed(1)} ★
      </span>
    </div>
  );
}

