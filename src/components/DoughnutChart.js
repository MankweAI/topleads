// src/components/DoughnutChart.js
"use client";
import React from "react";

// Helper to format currency
const formatCurrency = (value) => {
  if (typeof value !== "number") return "N/A";
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const InteractiveDoughnut = ({ data }) => {
  const { total, leaked, captured } = data;
  if (!total || total === 0) return null;

  const leakedPercent = (leaked / total) * 100;
  const capturedPercent = (captured / total) * 100;

  // SVG parameters
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const strokeWidth = 25;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke-dasharray values
  const capturedDash = (capturedPercent / 100) * circumference;
  const leakedDash = (leakedPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center font-sans">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#e2e8f0" // slate-200
            strokeWidth={strokeWidth}
          />
          {/* Captured Revenue (Green) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#84cc16" // tl-action
            strokeWidth={strokeWidth}
            strokeDasharray={`${capturedDash} ${circumference}`}
            transform={`rotate(-90 ${center} ${center})`}
            strokeLinecap="round"
          />
          {/* Leaked Revenue (Orange) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f97316" // tl-leak
            strokeWidth={strokeWidth}
            strokeDasharray={`${leakedDash} ${circumference}`}
            transform={`rotate(${
              -90 + capturedPercent * 3.6
            } ${center} ${center})`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-[#64748b]">Leaked Revenue</span>
          <span className="text-3xl font-bold text-[#f97316]">
            {formatCurrency(leaked)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 mt-4 text-sm w-full max-w-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f97316]"></span>
            <span className="text-[#0f172a]">Leaked (Your Data)</span>
          </div>
          <span className="font-semibold text-[#f97316]">
            {formatCurrency(leaked)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#84cc16]"></span>
            <span className="text-[#0f172a]">Captured (Simulated)</span>
          </div>
          <span className="font-semibold text-[#84cc16]">
            {formatCurrency(captured)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDoughnut;
