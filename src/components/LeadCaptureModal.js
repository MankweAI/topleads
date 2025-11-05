// src/components/LeadCaptureModal.js
"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";


// Helper function to capitalize
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default function LeadCaptureModal({
  reportContext, // The full report object (now with user data)
  ctaType,
  conceptFocus,
  onClose,
  onFormSubmit,
}) {
  const [formData, setFormData] = useState({
    name: "",
    company: reportContext?.business_name || "", // Pre-fill company name
    email: "",
    phone: "", // Added phone number
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.phone) {
      setError("Please fill out all required fields.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      // This lead data now sends the *user's answers* as context
      const leadData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        website_url: reportContext?.website_url, // From Step 1
        report_id: reportContext?.id,
        cta_type: ctaType,
        concept_focus: conceptFocus,
        // Send the diagnostic data as context
        context_data: reportContext?.calculated_data,
        context_total_leak: reportContext?.simulated_missed_revenue,
      };

      // We need to update the API route for lead capture.
      // The old one is missing fields.
      // Let's assume we update `api/lead/capture` to accept this.
      const response = await fetch("/api/lead/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(
          responseBody.error || `Submission failed. Status: ${response.status}`
        );
      }

      onFormSubmit(); // This triggers the "Thank You" message
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const { calculated_data: answers, simulated_missed_revenue: totalLeak } =
    reportContext;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 fade-in px-4 py-8 overflow-y-auto">
      <div className="bg-[#ffffff] rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg m-4 relative max-h-full overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-[#94a3b8] hover:text-[#0f172a] text-4xl leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a]">
            Request Your Free Strategy Call
          </h2>
          <p className="text-[#64748b] mt-2 text-base">
            You've found a{" "}
            <span className="font-bold text-[#f97316]">
              {formatCurrency(totalLeak)}/mo
            </span>{" "}
            leak. Let's schedule your 15-min "No-BS" call to plan the fix.
          </p>
        </div>

        {/* Display Context Summary */}
        <div className="mb-6 p-4 border border-[#cffafe] bg-[#cffafe]/50 rounded-lg text-sm space-y-2">
          <h3 className="font-semibold text-[#06b6d4] mb-2">
            Your "Money Leak" Diagnostic:
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-[#64748b]">Business:</span>
            <span className="font-medium text-[#0f172a]">
              {reportContext.business_name}
            </span>
            <span className="text-[#64748b]">Review Score:</span>
            <span className="font-medium text-[#f97316]">
              {answers.trustLeak_rating} ★
            </span>
            <span className="text-[#64748b]">Map Rank:</span>
            <span className="font-medium text-[#f97316]">
              {capitalize(answers.trafficLeak_rank.replace(/_/g, " "))}
            </span>
            <span className="text-[#64748b]">After-Hours:</span>
            <span className="font-medium text-[#f97316]">
              {capitalize(answers.enquiryLeak_method.replace(/_/g, " "))}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[#0f172a] mb-2"
            >
              Full Name <span className="text-[#f97316]">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="block w-full px-4 py-3 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#0f172a] mb-2"
            >
              Email Address <span className="text-[#f97316]">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="block w-full px-4 py-3 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-[#0f172a] mb-2"
            >
              Phone Number <span className="text-[#f97316]">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="block w-full px-4 py-3 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
            />
          </div>

          {error && (
            <p
              id="email-error"
              className="text-[#ef4444] text-sm mt-2 text-center"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-[#84cc16] text-[#0f172a] font-bold py-4 px-4 rounded-lg text-lg hover:bg-[#a3e635] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#84cc16] disabled:bg-[#94a3b8] mt-6"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
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
              "Submit Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
