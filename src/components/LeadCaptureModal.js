"use client";

import { useState } from "react";

// Helper to format currency
const formatCurrency = (value) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

// Helper to format numbers
const formatNumber = (value, decimals = 1) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return value.toLocaleString("en-ZA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export default function LeadCaptureModal({
  reportContext, // Changed from reportId to reportContext object
  ctaType,
  conceptFocus,
  onClose,
  onFormSubmit,
}) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    project_notes: "", // Added project notes field
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Email address is required.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      // Prepare lead data including the context and notes
      const leadData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        project_notes: formData.project_notes,
        report_id: reportContext?.id || "live-session", // Use context ID or placeholder
        cta_type: ctaType,
        concept_focus: conceptFocus,
        // Include key context parameters directly in the lead data for easy viewing
        context_industry: reportContext?.industry,
        context_flow_rate: reportContext?.flow_rate_m3_hr,
        context_tss: reportContext?.tss_mg_l,
        context_calc_area: reportContext?.calculatedArea,
        context_calc_capex_max: reportContext?.calculatedCapexMax,
        context_calc_opex: reportContext?.calculatedOpex,
      };

      const response = await fetch("/api/lead/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        console.error("Lead Capture API Error:", responseBody);
        throw new Error(
          responseBody.error || `Submission failed. Status: ${response.status}`
        );
      }

      onFormSubmit();
    } catch (err) {
      console.error("Lead Capture Submit Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine modal content based on CTA type (only 'review' now)
  const isReview = ctaType === "review";
  const modalTitle = "Request Your Free Engineering Review";
  const modalSubtext = `An engineer will review your preliminary DAF design (based on the parameters below) and follow up via email to discuss your specific project needs.`;
  const buttonText = "Submit Request for Review";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 fade-in px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg m-4 relative max-h-full overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {modalTitle}
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            {modalSubtext}
          </p>
        </div>

        {/* Display Context Summary */}
        {reportContext && (
          <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg text-sm space-y-2">
            <h3 className="font-semibold text-blue-800 mb-2">
              Your Preliminary Design Summary:
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-gray-600">Industry:</span>
              <span className="font-medium text-gray-900">
                {reportContext.industry?.replace(/_/g, " ") || "N/A"}
              </span>
              <span className="text-gray-600">Flow Rate:</span>
              <span className="font-medium text-gray-900">
                {formatNumber(reportContext.flow_rate_m3_hr)} m³/hr
              </span>
              <span className="text-gray-600">FOG & TSS:</span>
              <span className="font-medium text-gray-900">
                {formatNumber(reportContext.tss_mg_l, 0)} mg/L
              </span>
              <span className="text-gray-600">Calculated Area:</span>
              <span className="font-medium text-gray-900">
                {formatNumber(reportContext.calculatedArea)} m²
              </span>
              <span className="text-gray-600">Budget CAPEX Max:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(reportContext.calculatedCapexMax)}
              </span>
              <span className="text-gray-600">Est. Annual OPEX:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(reportContext.calculatedOpex)}
              </span>
            </div>
            {/* Display override info if used */}
            {(reportContext.override_hlr || reportContext.override_slr) && (
              <p className="text-xs text-blue-700 italic mt-2">
                Note: Calculation based on your overridden HLR/SLR values.
              </p>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Company
            </label>
            <input
              type="text"
              name="company"
              id="company"
              autoComplete="organization"
              value={formData.company}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-describedby="email-error"
            />
          </div>

          {/* Project Notes Field */}
          <div>
            <label
              htmlFor="project_notes"
              className="block text-sm font-medium text-gray-700"
            >
              Project Notes / Specific Questions (Optional)
            </label>
            <textarea
              name="project_notes"
              id="project_notes"
              rows="3"
              value={formData.project_notes}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="E.g., Specific site constraints, target effluent quality, existing treatment steps..."
            ></textarea>
          </div>

          {error && (
            <p
              id="email-error"
              className="text-red-500 text-sm mt-2 text-center"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors mt-6"
          >
            {isLoading ? (
              <>
                {/* SVG Loader */}
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /* ... */
                ></svg>
                Submitting Request...
              </>
            ) : (
              buttonText
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
