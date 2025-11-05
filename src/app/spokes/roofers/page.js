"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SpokeInput from "@/components/SpokeInput";
import Header from "@/components/Header";
import { HomeModernIcon } from "@heroicons/react/24/solid";

// --- Simplified Configuration ---
const pageConfig = {
  industry: "roofers",
  title: "Roofer's Money-Leak Audit",
  Icon: HomeModernIcon,
  conceptFocus: "roofers_industry",
  fields: [
    {
      name: "businessName",
      label: "Your Business Name",
      type: "text",
      placeholder: "e.g., Jono's Roofing",
      tooltip: "The name of your roofing business.",
    },
    {
      name: "websiteUrl",
      label: "Your Website URL",
      type: "text",
      placeholder: "e.g., jonosroofing.co.za",
      tooltip: "Your business website address.",
    },
    {
      name: "suburb",
      label: "Your Main Suburb",
      type: "text",
      placeholder: "e.g., Roodepoort",
      tooltip: "The main suburb you serve. This helps check your map ranking.",
    },
  ],
};

// --- New Spoke Page Component ---
export default function RoofersSpoke() {
  const router = useRouter();

  const initialFormData = {
    ...pageConfig.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {}),
    industry: pageConfig.industry,
    conceptFocus: pageConfig.conceptFocus,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.businessName || !formData.websiteUrl || !formData.suburb) {
      setError("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("businessName", formData.businessName);
      params.append("websiteUrl", formData.websiteUrl);
      params.append("suburb", formData.suburb);
      params.append("industry", formData.industry);
      params.append("conceptFocus", formData.conceptFocus);

      router.push(`/report?${params.toString()}`);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const { title, Icon, fields } = pageConfig;

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9]">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-[#ffffff] p-8 md:p-10 rounded-xl shadow-2xl border border-[#e2e8f0] animate-fade-in-up">
            <div className="text-center mb-8">
              <Icon className="w-16 h-16 text-[#4f46e5] mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">
                {title}
              </h1>
              <p className="text-[#64748b] mt-2">
                <span className="font-semibold">Step 1:</span> Tell us who you
                are.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map((field) => (
                <SpokeInput
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                />
              ))}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-[#84cc16] text-[#0f172a] font-bold py-4 px-4 rounded-lg text-lg hover:bg-[#a3e635] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#84cc16] disabled:bg-[#94a3b8]"
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
                    Processing...
                  </>
                ) : (
                  "Next: Diagnose My Leaks →"
                )}
              </button>
              {error && (
                <p className="text-[#ef4444] text-sm mt-4 text-center">
                  {error}
                </p>
              )}
            </form>
          </div>
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-[#64748b] hover:text-[#0f172a]"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
