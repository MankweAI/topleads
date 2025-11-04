"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// A generic component for a single input field in the calculator
const CalculatorInput = ({ field, value, onChange }) => {
  // Determine input type based on min/max/step or options
  const isRange =
    field.type !== "select" &&
    field.min !== undefined &&
    field.max !== undefined;
  const isNumber = field.type !== "select" && !isRange && field.unit; // Assume number if unit exists but not range
  const isText =
    field.type !== "select" && !isRange && !isNumber && !field.options; // Default to text

  if (field.type === "select") {
    return (
      <div key={field.name}>
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {field.label} {field.tooltip && <span title={field.tooltip}>ℹ️</span>}
        </label>
        <select
          id={field.name}
          name={field.name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-4 py-3 bg-brand-light-gray border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-navy focus:border-brand-navy"
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

  if (isRange) {
    return (
      <div className="space-y-4">
        <div className="has-tooltip">
          {field.tooltip && (
            <span className="tooltip rounded shadow-lg p-2 bg-gray-800 text-white -mt-8">
              {field.tooltip}
            </span>
          )}
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            id={field.name}
            name={field.name}
            min={field.min}
            max={field.max}
            step={field.step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex items-center">
            <input
              type="number"
              name={field.name}
              value={value}
              min={field.min}
              max={field.max}
              step={field.step}
              onChange={onChange}
              className="w-24 font-mono text-right bg-brand-light-gray border border-gray-300 rounded-md px-2 py-1"
            />
            {field.unit && (
              <span className="ml-2 text-brand-steel">{field.unit}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for simple number or text input
  return (
    <div key={field.name}>
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {field.label} {field.tooltip && <span title={field.tooltip}>ℹ️</span>}
      </label>
      <div className="flex items-center">
        <input
          type={isNumber ? "number" : "text"}
          id={field.name}
          name={field.name}
          value={value}
          onChange={onChange}
          min={isNumber ? field.min : undefined}
          max={isNumber ? field.max : undefined}
          step={isNumber ? field.step : undefined}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {field.unit && (
          <span className="ml-2 text-brand-steel">{field.unit}</span>
        )}
      </div>
    </div>
  );
};

// The main template for all spoke pages
export default function SpokePage({
  title,
  description,
  videoPlaceholder,
  calculatorConfig,
  hubLink,
  relatedSpokes,
}) {
  const router = useRouter();

  // Initialize form state from the calculator config, including hidden fields
  const initialFormData = {
    ...calculatorConfig.hiddenFields, // Start with hidden fields
    ...calculatorConfig.fields.reduce((acc, field) => {
      // Only add if field.name exists and is not already in hiddenFields
      if (
        field.name &&
        !calculatorConfig.hiddenFields.hasOwnProperty(field.name)
      ) {
        acc[field.name] = field.defaultValue;
      }
      return acc;
    }, {}),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const fieldConfig = calculatorConfig.fields.find((f) => f.name === name);

    let processedValue = value;

    // Handle numeric inputs, respecting min/max if defined
    if (type === "number" || (type === "range" && fieldConfig)) {
      processedValue = Number(value);
      if (
        fieldConfig &&
        fieldConfig.max !== undefined &&
        processedValue > fieldConfig.max
      ) {
        processedValue = fieldConfig.max;
      }
      if (
        fieldConfig &&
        fieldConfig.min !== undefined &&
        processedValue < fieldConfig.min
      ) {
        processedValue = fieldConfig.min;
      }
    }
    // For select and text, use the value directly
    else if (type === "select-one" || type === "text") {
      processedValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    console.log("Submitting form data:", formData); // Log data before sending
    try {
      // Construct the final data object, ensuring numeric types where appropriate
      const submissionData = { ...formData }; // Includes hidden fields now

      // Ensure fields expected to be numbers are numbers
      calculatorConfig.fields.forEach((field) => {
        if (field.name && submissionData.hasOwnProperty(field.name)) {
          // Check if it should be numeric (e.g., has min/max/step or unit, but isn't select)
          const isPotentiallyNumeric =
            (field.min !== undefined || field.unit) && field.type !== "select";
          if (
            isPotentiallyNumeric &&
            typeof submissionData[field.name] !== "number"
          ) {
            const numVal = Number(submissionData[field.name]);
            if (!isNaN(numVal)) {
              submissionData[field.name] = numVal;
            } else {
              console.warn(`Could not convert field ${field.name} to number.`);
              // Optionally handle this error case - maybe delete the field or set to null
              // delete submissionData[field.name];
            }
          }
        }
      });

      // Also ensure known numeric hidden fields are numbers if they exist
      const numericHiddenFields = ["flow_rate_m3_hr", "tss_mg_l", "cod_mg_l"];
      numericHiddenFields.forEach((fieldName) => {
        if (
          submissionData.hasOwnProperty(fieldName) &&
          typeof submissionData[fieldName] !== "number"
        ) {
          const numVal = Number(submissionData[fieldName]);
          if (!isNaN(numVal)) {
            submissionData[fieldName] = numVal;
          } else {
            console.warn(
              `Could not convert hidden field ${fieldName} to number.`
            );
            // delete submissionData[fieldName];
          }
        }
      });

      console.log("Processed submission data:", submissionData); // Log processed data

      const response = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData), // Send combined data
      });

      const responseBody = await response.json(); // Read response body regardless of status

      if (!response.ok) {
        console.error("API Error Response:", responseBody);
        throw new Error(
          responseBody.error ||
            `Failed to generate report. Status: ${response.status}`
        );
      }
      console.log("API Success Response:", responseBody);
      router.push(`/report/${responseBody.reportId}`);
    } catch (err) {
      console.error("Submit Error:", err);
      setError(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
    // Don't set isLoading false here if navigation is successful
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl fade-in">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">
          {title}
        </h1>
        <p className="mt-4 text-lg text-brand-steel max-w-2xl mx-auto">
          {description}
        </p>
        <div className="mt-8 aspect-video bg-gray-800 rounded-lg shadow-xl flex items-center justify-center text-white mx-auto max-w-3xl border-4 border-white">
          <p className="font-mono">{videoPlaceholder}</p>
        </div>
      </section>

      {calculatorConfig?.fields?.length > 0 && ( // Only show calculator if fields exist
        <section className="mt-16">
          <div className="bg-brand-off-white p-8 md:p-10 rounded-lg shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-navy mb-2">
              {calculatorConfig.title}
            </h2>
            <p className="text-brand-steel mb-8">
              {calculatorConfig.description}
            </p>
            <form onSubmit={handleSubmit} className="space-y-8">
              {calculatorConfig.fields.map((field) =>
                // Render CalculatorInput only if field.name is defined
                field.name ? (
                  <CalculatorInput
                    key={field.name}
                    field={field}
                    // Use || '' to prevent uncontrolled component warning for text/select
                    value={
                      formData[field.name] ??
                      (field.type === "select" ||
                      typeof field.defaultValue === "string"
                        ? ""
                        : 0)
                    }
                    onChange={handleInputChange}
                  />
                ) : null
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-[#0A2540] text-white font-bold py-4 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy disabled:bg-brand-steel transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Report...
                  </>
                ) : (
                  "Generate Report"
                )}
              </button>
              {error && (
                <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
              )}
            </form>
          </div>
        </section>
      )}

      {(relatedSpokes?.length > 0 || hubLink) && ( // Only show section if needed
        <section className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-brand-navy mb-4">
            Related Topics
          </h3>
          <div className="space-y-3">
            {relatedSpokes?.map((spoke) => (
              <Link
                href={spoke.href}
                key={spoke.href}
                className="block p-4 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-500 transition-colors duration-200"
              >
                <p className="font-semibold text-brand-navy">{spoke.title}</p>
              </Link>
            ))}
            {hubLink && (
              <Link
                href={hubLink.href}
                className="block p-4 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors duration-200 mt-6"
              >
                <p className="font-semibold text-brand-steel-dark">
                  ← Back to {hubLink.title}
                </p>
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
