// src/components/CalculatorInput.js
"use client";

// A generic component for a single input field in the calculator
const CalculatorInput = ({ field, value, onChange }) => {
  const inputId = `input-${field.name}`; // Unique ID for label association

  // Common input classes
  const inputClasses =
    "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  // Tooltip Span
  const Tooltip = ({ text }) =>
    text ? (
      <span
        className="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
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

  // Render Select Input
  if (field.type === "select") {
    return (
      <div>
        <label htmlFor={inputId} className={labelClasses}>
          {field.label}
          {field.optional && (
            <span className="text-xs text-gray-400"> (Optional)</span>
          )}
          <Tooltip text={field.tooltip} />
        </label>
        <select
          id={inputId}
          name={field.name}
          value={value ?? ""} // Handle null/undefined for controlled component
          onChange={onChange}
          className={`${inputClasses} mt-1`} // Select needs mt-1 for alignment
        >
          {field.options.map((option) => (
            <option
              key={typeof option === "string" ? option : option.value}
              value={typeof option === "string" ? option : option.value}
            >
              {typeof option === "string"
                ? option
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Render Range Input
  if (
    field.type !== "select" &&
    field.min !== undefined &&
    field.max !== undefined
  ) {
    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className={labelClasses}>
          {field.label}
          {field.optional && (
            <span className="text-xs text-gray-400"> (Optional)</span>
          )}
          <Tooltip text={field.tooltip} />
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            id={`${inputId}-range`} // Different id for range slider
            name={field.name}
            min={field.min}
            max={field.max}
            step={field.step}
            value={value ?? field.min} // Default to min if null/undefined
            onChange={onChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-blue-600" // Use accent color
          />
          <div className="flex items-center relative">
            <input
              type="number"
              id={inputId}
              name={field.name}
              value={value ?? ""} // Handle null/undefined for controlled component
              min={field.min}
              max={field.max}
              step={field.step}
              onChange={onChange}
              className={`${inputClasses} w-24 text-right pr-10`} // Added padding for unit
              aria-label={field.label} // Accessibility
            />
            {field.unit && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                {field.unit}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Number or Text Input (Fallback)
  const isNumber = field.type === "number" || field.unit;
  return (
    <div>
      <label htmlFor={inputId} className={labelClasses}>
        {field.label}
        {field.optional && (
          <span className="text-xs text-gray-400"> (Optional)</span>
        )}
        <Tooltip text={field.tooltip} />
      </label>
      <div className="relative mt-1">
        <input
          type={isNumber ? "number" : "text"}
          id={inputId}
          name={field.name}
          value={value ?? ""} // Handle null/undefined for controlled component
          onChange={onChange}
          min={isNumber ? field.min : undefined}
          max={isNumber ? field.max : undefined}
          step={isNumber ? field.step : undefined}
          placeholder={field.placeholder || ""}
          className={`${inputClasses} ${field.unit ? "pr-12" : ""}`} // Add padding if unit exists
          aria-label={field.label} // Accessibility
        />
        {field.unit && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 pointer-events-none">
            {field.unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default CalculatorInput;
