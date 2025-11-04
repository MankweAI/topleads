"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CalculatorInput from "@/components/CalculatorInput";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import CollapsibleSection from "@/components/CollapsibleSection";
import Header from "@/components/Header";
import { FireIcon } from "@heroicons/react/24/outline"; // Changed icon

// --- Configuration for this Spoke ---
const pageConfig = {
  industry: "hvac",
  title: "For HVAC Specialists: Stop Leaking R25,000/Month",
  description:
    "Your HVAC company is losing high-value install jobs to competitors. Our 'No-BS' audit finds the 3 leaks in your online presence (Maps, Reviews, and Missed Enquiries) in under 30 seconds.",
  videoPlaceholder: "AI Specialist Video: 3 Leaks Costing HVAC Companies Money",
  calculatorConfig: {
    title: "Find Your Leaks - Instant Audit",
    description:
      "Enter your details to generate your free, instant leak report.",
    hiddenFields: {
      conceptFocus: "hvac_industry",
      industry: "hvac",
    },
    fields: [
      {
        name: "businessName",
        label: "Your Business Name",
        type: "text",
        placeholder: "e.g., Jono's Aircon",
        tooltip: "The name of your HVAC business.",
      },
      {
        name: "websiteUrl",
        label: "Your Website URL",
        type: "text",
        placeholder: "e.g., jonosair.co.za",
        tooltip: "Your business website address.",
      },
      {
        name: "suburb",
        label: "Your Main Suburb",
        type: "text",
        placeholder: "e.g., Pretoria East",
        tooltip:
          "The main suburb you serve. This helps check your map ranking.",
      },
      {
        name: "biggestProblem",
        label: "What's your biggest problem?",
        type: "select",
        options: [
          { value: "not_enough_calls", label: "Not enough install leads" },
          {
            value: "bad_reviews",
            label: "Bad or old reviews are hurting me",
          },
          {
            value: "competitors_winning",
            label: "Competitors show up, but I don't",
          },
          { value: "other", label: "Other / Not sure" },
        ],
        defaultValue: "not_enough_calls",
        tooltip: "This helps us personalize your report.",
      },
    ],
  },
  hubLink: {
    href: "/",
    title: "Main Hub",
  },
};

// --- Component ---
export default function HVACSpoke() {
  const router = useRouter();
  const initialFormData = {
    ...pageConfig.calculatorConfig.hiddenFields,
    ...pageConfig.calculatorConfig.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {}),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [headerHeight, setHeaderHeight] = useState(60);

  useEffect(() => {
    const timer = setTimeout(() => {
      const headerElement = document.querySelector("header");
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple frontend validation
    if (!formData.businessName || !formData.websiteUrl || !formData.suburb) {
      setError("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", responseBody);
        throw new Error(
          responseBody.error ||
            `Failed to generate report. Status: ${response.status}`
        );
      }

      router.push(`/report/${responseBody.reportId}`);
    } catch (err) {
      console.error("Submit Error:", err);
      setError(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const { title, description, videoPlaceholder, calculatorConfig, hubLink } =
    pageConfig;
  const {
    title: calculatorTitle,
    description: calculatorDescription,
    fields,
  } = calculatorConfig;

  return (
    <div className="fade-in relative">
      {/* Hero / Video Section */}
      <section className="text-center bg-brand-navy-dark pt-16 pb-12">
        <div
          className="container mx-auto px-4 py-8 md:py-12 max-w-4xl"
          style={{ paddingTop: `${headerHeight + 32}px` }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
          <p className="mt-4 text-lg text-brand-steel-light max-w-2xl mx-auto">
            {description}
          </p>
          <div className="mt-8 aspect-video bg-gray-800 rounded-lg shadow-xl flex items-center justify-center text-white mx-auto max-w-3xl border-4 border-brand-navy-light">
            <p className="font-mono">{videoPlaceholder}</p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="mt-[-4rem] relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-brand-off-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-brand-navy-dark mb-2 text-center">
              {calculatorTitle}
            </h2>
            <p className="text-brand-steel mb-8 text-center">
              {calculatorDescription}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map((field) => (
                <CalculatorInput
                  key={field.name}
                  field={field}
                  value={formData[field.name] ?? ""}
                  onChange={handleInputChange}
                />
              ))}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-brand-action-green text-brand-navy-dark font-bold py-4 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy disabled:bg-brand-steel transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-navy-dark"
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
                  "Generate My Free Leak Report"
                )}
              </button>
              {error && (
                <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Hub Link Section */}
      {hubLink && (
        <section className="mt-16 max-w-2xl mx-auto text-center">
          <Link
            href={hubLink.href}
            className="inline-block px-6 py-3 rounded-lg bg-gray-100 border border-gray-200 text-brand-steel-dark font-semibold hover:bg-gray-200 transition-colors"
          >
            ← Back to {hubLink.title}
          </Link>
        </section>
      )}
    </div>
  );
}
