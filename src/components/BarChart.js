"use client";
import { useEffect, useState, useMemo } from "react";

const formatNumber = (value, unit = "") => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  const formatted = value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return `${formatted}${unit ? ` ${unit}` : ""}`;
};

const BarChart = ({ data, unit = "", reverse = false }) => {
  // always run hooks
  const maxVal = useMemo(() => {
    if (!data?.length) return 1;
    const values = data.map((d) => d.value);
    return Math.max(...values, 1) * 1.25;
  }, [data]);

  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    if (!data?.length) return;
    const timer = setTimeout(() => {
      setAnimatedData(
        data.map((d) => ({
          ...d,
          animatedValue: maxVal > 0 ? (d.value / maxVal) * 100 : 0,
        }))
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [data, maxVal]);

  // NOW return null AFTER hooks
  if (!data?.length) return null;

  return (
    <div className="w-full h-48 bg-brand-light-gray p-4 rounded-xl flex flex-col justify-end border border-gray-200">
      <div className="flex items-end justify-around h-full pt-6">
        {animatedData.map((d, index) => {
          let color = d.color;
          if (!color) {
            if (index === 0) color = reverse ? "#10B981" : "#EF4444";
            else color = reverse ? "#EF4444" : "#10B981";
          }

          return (
            <div
              key={d.name}
              className="w-1/3 flex flex-col items-center h-full"
            >
              <div className="relative flex flex-col justify-end h-full w-2/3">
                <span
                  className="absolute bottom-full mb-1 text-xs font-semibold text-brand-navy-dark whitespace-nowrap"
                  style={{ color: color }}
                >
                  {formatNumber(d.value, unit)}
                </span>

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
