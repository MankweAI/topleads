"use client";
import { useEffect, useState } from "react";

// Helper to format numbers robustly
const formatNumber = (value, unit = "") => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  const formatted = value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return `${formatted}${unit ? ` ${unit}` : ""}`;
};

/**
 * A simple bar chart component.
 * @param {object} props
 * @param {Array<object>} props.data - Array of data points, e.g., [{ name: 'You', value: 3.1, color: '#EF4444' }, { name: 'Competitor', value: 4.8, color: '#10B981' }]
 * @param {string} [props.unit] - Optional unit to display (e.g., "Stars", "Rank")
 * @param {boolean} [props.reverse] - Optional, if true, a *lower* bar is better.
 */
const BarChart = ({ data, unit = "", reverse = false }) => {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1) * 1.25; // Get max value, *1.25 for padding, min 1

  const [animatedData, setAnimatedData] = useState(
    data.map((d) => ({ ...d, animatedValue: 0 }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(
        data.map((d) => ({
          ...d,
          animatedValue: maxVal > 0 ? (d.value / maxVal) * 100 : 0,
        }))
      );
    }, 100); // Small delay
    return () => clearTimeout(timer);
  }, [data, maxVal]);

  return (
    <div className="w-full h-48 bg-brand-light-gray p-4 rounded-xl flex flex-col justify-end border border-gray-200">
      <div className="flex items-end justify-around h-full pt-6">
        {animatedData.map((d, index) => {
          // Determine "good" or "bad" color if not provided
          let color = d.color;
          if (!color) {
            if (index === 0)
              color = reverse ? "#10B981" : "#EF4444"; // First bar
            else color = reverse ? "#EF4444" : "#10B981"; // Second bar
          }

          return (
            <div
              key={d.name}
              className="w-1/3 flex flex-col items-center h-full"
            >
              <div className="relative flex flex-col justify-end h-full w-2/3">
                {/* Value label */}
                <span
                  className="absolute bottom-full mb-1 text-xs font-semibold text-brand-navy-dark whitespace-nowrap"
                  style={{ color: color }}
                >
                  {formatNumber(d.value, unit)}
                </span>
                {/* The Bar */}
                <div
                  className="w-full rounded-t-md transition-all duration-1000 ease-out"
                  style={{
                    height: `${d.animatedValue}%`,
                    backgroundColor: color,
                  }}
                ></div>
              </div>
              <p className="text-sm font-medium mt-2 text-brand-steel-dark">
                {d.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
