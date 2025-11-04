// This file is well-structured. I will correct the styling to use the new `brand-info` for focus rings.
"use client";

// A generic component for a single input field in the calculator
const CalculatorInput = ({ field, value, onChange }) => {
  const inputId = `input-${field.name}`;

  // Use brand-info for focus rings
  const inputClasses =
    "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-info focus:border-brand-info sm:text-sm disabled:bg-gray-100";
  const labelClasses = "block text-sm font-medium text-brand-steel-dark mb-1";

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
          value={value ?? ""}
          onChange={onChange}
          className={`${inputClasses} mt-1 bg-brand-light-gray`}
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
            id={`${inputId}-range`}
            name={field.name}
            min={field.min}
            max={field.max}
            step={field.step}
            value={value ?? field.min}
            onChange={onChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-brand-navy" // Use brand-navy
          />
          <div className="flex items-center relative">
            <input
              type="number"
              id={inputId}
              name={field.name}
              value={value ?? ""}
              min={field.min}
              max={field.max}
              step={field.step}
              onChange={onChange}
              className={`${inputClasses} w-24 text-right pr-10 bg-brand-light-gray`}
              aria-label={field.label}
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

  // Fallback for Text and Number inputs
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
          value={value ?? ""}
          onChange={onChange}
          min={isNumber ? field.min : undefined}
          max={isNumber ? field.max : undefined}
          step={isNumber ? field.step : undefined}
          placeholder={field.placeholder || ""}
          className={`${inputClasses} bg-brand-light-gray ${
            field.unit ? "pr-12" : ""
          }`}
          aria-label={field.label}
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
