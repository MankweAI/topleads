"use client";
import { useEffect, useState } from "react";

// Helper to format currency robustly
const formatCurrency = (value) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const BarChart = ({ data }) => {
  // Ensure data exists and values are numbers, default to 0 if not
  const capex =
    typeof data?.capexMax === "number" && !isNaN(data.capexMax)
      ? data.capexMax
      : 0;
  const opex =
    typeof data?.opexAnnual === "number" && !isNaN(data.opexAnnual)
      ? data.opexAnnual
      : 0;

  // Calculate maxVal safely, ensuring it's not zero unless both capex and opex are zero
  const maxVal = Math.max(capex, opex, 1) * 1.25; // Use Math.max(..., 1) to avoid division by zero if both are 0

  const [animatedCapex, setAnimatedCapex] = useState(0);
  const [animatedOpex, setAnimatedOpex] = useState(0);

  const capexPercentage = maxVal > 0 ? (capex / maxVal) * 100 : 0;
  const opexPercentage = maxVal > 0 ? (opex / maxVal) * 100 : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCapex(capexPercentage);
      setAnimatedOpex(opexPercentage);
    }, 100); // Small delay for smooth start
    return () => clearTimeout(timer);
  }, [capexPercentage, opexPercentage]); // Rerun animation if data changes

  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl shadow-md flex flex-col justify-end border border-gray-100">
      <h3 className="text-center text-lg font-semibold text-brand-navy-dark mb-4">
        Budget CAPEX vs Annual OPEX
      </h3>

      <div className="flex items-end justify-around h-full pt-6">
        {" "}
        {/* Added padding top */}
        {/* CAPEX Bar */}
        <div className="w-1/4 flex flex-col items-center h-full">
          <div className="relative flex flex-col justify-end h-full w-full">
            <div
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out"
              style={{ height: `${animatedCapex}%` }}
            ></div>
            {/* Value label above the bar */}
            <span className="absolute bottom-full mb-2 text-xs font-semibold text-blue-700 whitespace-nowrap">
              {formatCurrency(capex)}
            </span>
          </div>
          <p className="text-sm font-medium mt-3 text-brand-steel-dark">
            CAPEX
          </p>
        </div>
        {/* OPEX Bar */}
        <div className="w-1/4 flex flex-col items-center h-full">
          <div className="relative flex flex-col justify-end h-full w-full">
            <div
              className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-1000 ease-out"
              style={{ height: `${animatedOpex}%` }}
            ></div>
            <span className="absolute bottom-full mb-2 text-xs font-semibold text-green-700 whitespace-nowrap">
              {formatCurrency(opex)}
            </span>
          </div>
          <p className="text-sm font-medium mt-3 text-brand-steel-dark">OPEX</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-4 text-xs text-brand-steel-dark">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span>Budget CAPEX</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span>Annual OPEX</span>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
