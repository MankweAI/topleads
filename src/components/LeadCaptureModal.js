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
  reportContext, // The full report object
  ctaType,
  conceptFocus,
  onClose,
  onFormSubmit,
}) {
  const [formData, setFormData] = useState({
    name: "",
    company: reportContext?.business_name || "", // Pre-fill company name
    email: "",
    project_notes: "",
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
      const leadData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        project_notes: formData.project_notes,
        report_id: reportContext?.id,
        cta_type: ctaType,
        concept_focus: conceptFocus,
        // Pass Topleads-specific context
        context_industry: reportContext?.industry,
        context_calc_capex_max: reportContext?.simulated_missed_revenue, // Re-using field for "missed revenue"
        context_calc_opex: reportContext?.simulated_missed_calls, // Re-using field for "missed calls"
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

      onFormSubmit(); // This triggers the "Thank You" message on the report page
    } catch (err) {
      console.error("Lead Capture Submit Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalTitle = "Request Your Free Strategy Call";
  const modalSubtext =
    "An expert will review your 'Money Leak' report and follow up via email to schedule your 15-minute 'No-BS' strategy call.";
  const buttonText = "Submit Request";

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
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy-dark">
            {modalTitle}
          </h2>
          <p className="text-brand-steel mt-2 text-sm sm:text-base">
            {modalSubtext}
          </p>
        </div>

        {/* Display Context Summary */}
        <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg text-sm space-y-2">
          <h3 className="font-semibold text-blue-800 mb-2">
            Your "Money Leak" Report Summary:
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-gray-600">Business:</span>
            <span className="font-medium text-gray-900">
              {reportContext.business_name}
            </span>
            <span className="text-gray-600">Industry:</span>
            <span className="font-medium text-gray-900">
              {capitalize(reportContext.industry)}
            </span>
            <span className="text-gray-600">Map Rank:</span>
            <span className="font-medium text-brand-danger">
              #{reportContext.simulated_meo_rank}
            </span>
            <span className="text-gray-600">Review Score:</span>
            <span className="font-medium text-brand-danger">
              {reportContext.simulated_review_score} ★
            </span>
            <span className="text-gray-600">Missed Revenue:</span>
            <span className="font-medium text-brand-danger">
              {formatCurrency(reportContext.simulated_missed_revenue)}/mo
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-brand-steel-dark"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-info focus:border-brand-info sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-brand-steel-dark"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-info focus:border-brand-info sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brand-steel-dark"
            >
              Email Address <span className="text-brand-danger">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-info focus:border-brand-info sm:text-sm"
              aria-describedby="email-error"
            />
          </div>

          <div>
            <label
              htmlFor="project_notes"
              className="block text-sm font-medium text-brand-steel-dark"
            >
              What's your biggest challenge right now? (Optional)
            </label>
            <textarea
              name="project_notes"
              id="project_notes"
              rows="3"
              value={formData.project_notes}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-info focus:border-brand-info sm:text-sm"
              placeholder="E.g., 'I get calls but they aren't the right customers', 'My competitors are everywhere', 'I need more high-value install jobs'..."
            ></textarea>
          </div>

          {error && (
            <p
              id="email-error"
              className="text-brand-danger text-sm mt-2 text-center"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-brand-info text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-brand-steel transition-colors mt-6"
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
