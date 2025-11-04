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

const DoughnutChart = ({ data }) => {
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
            stroke="var(--tw-color-gray-200)"
            strokeWidth={strokeWidth}
          />
          {/* Captured Revenue (Green) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--tw-color-brand-success)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${capturedDash} ${circumference}`}
            transform={`rotate(-90 ${center} ${center})`}
            strokeLinecap="round"
          />
          {/* Leaked Revenue (Red) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--tw-color-brand-danger)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${leakedDash} ${circumference}`}
            transform={`rotate(${
              -90 + capturedPercent * 3.6
            } ${center} ${center})`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-brand-steel">Leaked Revenue</span>
          <span className="text-3xl font-bold text-brand-danger">
            {formatCurrency(leaked)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 mt-4 text-sm w-full max-w-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-danger"></span>
            <span className="text-brand-steel-dark">Leaked (Simulated)</span>
          </div>
          <span className="font-semibold text-brand-danger">
            {formatCurrency(leaked)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-success"></span>
            <span className="text-brand-steel-dark">Captured (Simulated)</span>
          </div>
          <span className="font-semibold text-brand-success">
            {formatCurrency(captured)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;

