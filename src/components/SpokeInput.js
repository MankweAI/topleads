// src/components/SpokeInput.js
"use client";

// A simple, beautiful input for the spoke pages.
export default function SpokeInput({ field, value, onChange }) {
  const inputId = `input-${field.name}`;

  const Tooltip = ({ text }) =>
    text ? (
      <span
        className="ml-1 text-[#94a3b8] hover:text-[#64748b] cursor-help"
        title={text}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 inline-block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
    ) : null;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-[#0f172a] mb-2"
      >
        {field.label}
        <Tooltip text={field.tooltip} />
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          id={inputId}
          name={field.name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={field.placeholder || ""}
          className="block w-full px-4 py-3 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5] sm:text-sm"
          aria-label={field.label}
          required
        />
      </div>
    </div>
  );
}
