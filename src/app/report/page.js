// src/app/report/page.js
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import InteractiveDoughnut from "@/components/DoughnutChart";
import {
  MagnifyingGlassIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

// Helper to format currency
const formatCurrency = (value) => {
  if (typeof value !== "number") return "N/A";
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

// --- This is the new main component ---
function ReportDiagnostic() {
  const searchParams = useSearchParams();

  // --- Step 1 Data (from URL) ---
  const [reportData, setReportData] = useState({
    business_name: searchParams.get("businessName") || "Your Business",
    website_url: searchParams.get("websiteUrl") || "",
    suburb: searchParams.get("suburb") || "Your Suburb",
    industry: searchParams.get("industry") || "Your Industry",
    concept_focus: searchParams.get("conceptFocus") || "general",
  });

  // Funnel State
  const [stage, setStage] = useState("diagnosing"); // diagnosing -> submitting -> results
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");

  // --- Step 2: Diagnostic Inputs ---
  const [trustLeak, setTrustLeak] = useState(3.5); // Review Score (1-5)
  const [trafficLeak, setTrafficLeak] = useState("page_2_plus"); // 'top3', 'page1', 'page_2_plus', 'unknown'
  const [enquiryLeak, setEnquiryLeak] = useState("form_only"); // 'chatbot', 'form_only', 'nothing'

  // --- Live Leak Calculation ---
  const {
    trustLeakScore,
    trafficLeakScore,
    enquiryLeakScore,
    totalLeakedRevenue,
  } = useMemo(() => {
    let trustLeakScore = (5.0 - trustLeak) * 4000;

    let trafficLeakScore = 0;
    if (trafficLeak === "page1") trafficLeakScore = 7000;
    if (trafficLeak === "page_2_plus") trafficLeakScore = 15000;
    if (trafficLeak === "unknown") trafficLeakScore = 10000;

    let enquiryLeakScore = 0;
    if (enquiryLeak === "form_only") enquiryLeakScore = 3000;
    if (enquiryLeak === "nothing") enquiryLeakScore = 8000;

    let totalLeakedRevenue =
      trustLeakScore + trafficLeakScore + enquiryLeakScore;

    return {
      trustLeakScore,
      trafficLeakScore,
      enquiryLeakScore,
      totalLeakedRevenue,
    };
  }, [trustLeak, trafficLeak, enquiryLeak]);

  // This replaces the "fetchReport" logic, as data is now from the URL
  useEffect(() => {
    if (!searchParams.get("businessName")) {
      setError("No report data found in URL. Please start again.");
    }
  }, [searchParams]);

  // Handle final submission of "Step 2"
  const handleDiagnosticSubmit = async (e) => {
    e.preventDefault();
    setStage("submitting");
    setError("");

    // This is the complete report object we will send to the "lead/capture" API
    const finalReport = {
      ...reportData,
      calculated_data: {
        trustLeak_rating: trustLeak,
        trafficLeak_rank: trafficLeak,
        enquiryLeak_method: enquiryLeak,
      },
      simulated_missed_revenue: totalLeakedRevenue, // This is our final score
    };

    try {
      // We no longer call "report/update". We call "lead/capture" *IF* the user
      // fills out the modal. This button just reveals the final report.
      // We store the final report in state.
      setReportData(finalReport);
      setStage("results"); // Move to the results view
    } catch (err) {
      console.error("Submit Error:", err);
      setError(err.message || "An unexpected error occurred.");
      setStage("diagnosing"); // Go back
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleFormSuccess = () => {
    setFormSubmitted(true);
    handleCloseModal();
  };

  if (error) {
    return (
      <div className="bg-[#f1f5f9] min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p className="text-[#ef4444] text-xl p-8">Error: {error}</p>
        </div>
      </div>
    );
  }

  // The "Payoff" / Final CTA
  if (stage === "results") {
    const chartData = {
      total: totalLeakedRevenue + totalLeakedRevenue * 0.4, // simulated "captured"
      leaked: totalLeakedRevenue,
      captured: totalLeakedRevenue * 0.4, // simulated "captured"
    };

    return (
      <>
        {isModalOpen && (
          <LeadCaptureModal
            reportContext={reportData} // Pass the complete, final report object
            ctaType="Strategy Call"
            conceptFocus={reportData.concept_focus}
            onClose={handleCloseModal}
            onFormSubmit={handleFormSuccess}
          />
        )}
        <div className="bg-[#f1f5f9] min-h-screen">
          <Header />
          <main className="container mx-auto max-w-4xl py-12 px-4 animate-fade-in-up">
            {formSubmitted ? (
              // Thank You Message
              <div className="bg-[#ffffff] p-10 rounded-xl shadow-2xl text-center border border-[#e2e8f0]">
                <CheckCircleIcon className="w-20 h-20 text-[#84cc16] mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-[#0f172a] mb-3">
                  Request Sent!
                </h2>
                <p className="text-lg text-[#64748b] max-w-lg mx-auto">
                  Thank you. An expert will review your report and be in touch
                  shortly to schedule your 15-minute "No-BS" strategy call.
                </p>
              </div>
            ) : (
              // Final Report & CTA
              <div className="bg-[#ffffff] p-10 rounded-xl shadow-2xl text-center border border-[#e2e8f0]">
                <h1 className="text-3xl font-bold text-[#0f172a]">
                  Your Total Simulated Leak:
                </h1>
                <div className="my-8 text-7xl font-extrabold text-[#f97316]">
                  {formatCurrency(totalLeakedRevenue)}
                  <span className="text-4xl text-[#64748b]"> /month</span>
                </div>

                <div className="max-w-md mx-auto my-10">
                  <InteractiveDoughnut data={chartData} />
                </div>

                <h2 className="text-3xl font-bold text-[#0f172a] mb-3">
                  Ready to Fix These Leaks?
                </h2>
                <p className="text-lg text-[#64748b] mb-8 max-w-2xl mx-auto">
                  This report is based on your data. The next step is a free,
                  15-minute strategy call to build a step-by-step plan.
                </p>
                <button
                  onClick={handleOpenModal}
                  className="font-bold py-4 px-12 rounded-lg shadow-lg text-[#0f172a] bg-[#84cc16] hover:bg-[#a3e635] transition-all duration-200 text-xl transform hover:scale-105"
                >
                  Request My Free Strategy Call
                </button>
              </div>
            )}
          </main>
        </div>
      </>
    );
  }

  // --- Default View: Step 2 Diagnostic ---
  return (
    <div className="bg-[#f1f5f9] min-h-screen">
      <Header />
      <main className="container mx-auto max-w-4xl py-12 px-4">
        {/* Sticky Header with Live Total */}
        <div className="sticky top-[72px] z-30 bg-[#f1f5f9]/80 backdrop-blur-md rounded-b-xl -mx-4 px-4 py-4 mb-8 shadow-sm">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">
                Report for:{" "}
                <span className="text-[#4f46e5]">
                  {reportData.business_name}
                </span>
              </h1>
              <p className="text-[#64748b] mt-1">
                <span className="font-semibold">Step 2:</span> Help us diagnose
                your leaks.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <span className="text-sm font-semibold text-[#64748b] uppercase">
                Total Leaked Revenue
              </span>
              <div className="text-4xl font-extrabold text-[#f97316]">
                {formatCurrency(totalLeakedRevenue)}
                <span className="text-2xl text-[#64748b]"> /mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Interactive Form --- */}
        <form
          onSubmit={handleDiagnosticSubmit}
          className="space-y-8 animate-fade-in-up"
        >
          {/* --- Question 1: Trust Leak --- */}
          <div className="bg-[#ffffff] p-8 rounded-xl shadow-xl border border-[#e2e8f0]">
            <div className="flex items-start gap-4">
              <StarIcon className="w-10 h-10 text-[#f97316] flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-[#0f172a]">
                  The Trust Leak (Reviews)
                </h2>
                <p className="text-lg text-[#64748b] mt-1">
                  What is your *actual* Google Review rating?
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={trustLeak}
                onChange={(e) => setTrustLeak(parseFloat(e.target.value))}
                className="w-full h-3 bg-[#e2e8f0] rounded-full appearance-none cursor-pointer accent-[#4f46e5]"
              />
              <span className="text-4xl font-extrabold text-[#4f46e5] w-32 text-center">
                {trustLeak.toFixed(1)} ★
              </span>
            </div>
          </div>

          {/* --- Question 2: Traffic Leak --- */}
          <div className="bg-[#ffffff] p-8 rounded-xl shadow-xl border border-[#e2e8f0]">
            <div className="flex items-start gap-4">
              <MagnifyingGlassIcon className="w-10 h-10 text-[#f97316] flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-[#0f172a]">
                  The Traffic Leak (Map Rank)
                </h2>
                <p className="text-lg text-[#64748b] mt-1">
                  When you Google "{reportData.industry} in {reportData.suburb}
                  ", where do you show up?
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTrafficLeak("top3")}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  trafficLeak === "top3"
                    ? "bg-[#84cc16]/20 border-[#84cc16]"
                    : "bg-[#f1f5f9] border-transparent hover:bg-[#e2e8f0]"
                }`}
              >
                <span className="font-bold text-[#0f172a]">
                  Top 3 "Map Pack"
                </span>
                <br />
                <span className="text-sm text-[#64748b]">
                  Customers see me first.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTrafficLeak("page1")}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  trafficLeak === "page1"
                    ? "bg-[#f97316]/20 border-[#f97316]"
                    : "bg-[#f1f5f9] border-transparent hover:bg-[#e2e8f0]"
                }`}
              >
                <span className="font-bold text-[#0f172a]">
                  Page 1 (Below Maps)
                </span>
                <br />
                <span className="text-sm text-[#64748b]">
                  Customers have to scroll to find me.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTrafficLeak("page_2_plus")}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  trafficLeak === "page_2_plus"
                    ? "bg-[#f97316]/20 border-[#f97316]"
                    : "bg-[#f1f5f9] border-transparent hover:bg-[#e2e8f0]"
                }`}
              >
                <span className="font-bold text-[#0f172a]">
                  Page 2 or Lower
                </span>
                <br />
                <span className="text-sm text-[#64748b]">
                  Basically invisible.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTrafficLeak("unknown")}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  trafficLeak === "unknown"
                    ? "bg-[#f97316]/20 border-[#f97316]"
                    : "bg-[#f1f5f9] border-transparent hover:bg-[#e2e8f0]"
                }`}
              >
                <span className="font-bold text-[#0f172a]">I Don't Know</span>
                <br />
                <span className="text-sm text-[#64748b]">
                  This is a leak in itself.
                </span>
              </button>
            </div>
          </div>

          {/* --- Question 3: Enquiry Leak (Updated as per our discussion) --- */}
          <div className="bg-[#ffffff] p-8 rounded-xl shadow-xl border border-[#e2e8f0]">
            <div className="flex items-start gap-4">
              <ChatBubbleBottomCenterTextIcon className="w-10 h-10 text-[#f97316] flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-[#0f172a]">
                  The Enquiry Leak (24/7 Leads)
                </h2>
                <p className="text-lg text-[#64748b] mt-1">
                  After 5 PM, how does your site handle a new customer?
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => setEnquiryLeak("chatbot")}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  enquiryLeak === "chatbot"
                    ? "bg-[#84cc16]/20 border-[#84cc16]"
                    : "bg-[#f1f5f9] border-transparent hover:bg-[#e2e8f0]"
                }`}
              >
                <span className="font-bold text-[#0f172a]">24/7 Chatbot</span>
                <br />
                <span className="text-sm text-[#64748b]">
                  It answers questions and books jobs automatically.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setEnquiryLeak("form_only")}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  enquiryLeak === "form_only"
                    ? "bg-[#f97316]/20 border-[#f97316]"
                    : "bg-[#f1f5f9] border-transparent hover:bg-[#e2e8f0]"
                }`}
              >
                <span className="font-bold text-[#0f172a]">
                  Just a Contact Form
                </span>
                <br />
                <span className="text-sm text-[#64748b]">
                  Customers fill it out and wait... or call a competitor.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setEnquiryLeak("nothing")}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  enquiryLeak === "nothing"
                    ? "bg-[#f97316]/20 border-[#f97316]"
                    : "bg-[#f1f5f9] border-transparent hover:bg-[#e2e8f0]"
                }`}
              >
                <span className="font-bold text-[#0f172a]">
                  Nothing (Just a Phone Number)
                </span>
                <br />
                <span className="text-sm text-[#64748b]">
                  You are leaking all after-hours leads.
                </span>
              </button>
            </div>
          </div>

          {/* --- Submit Button --- */}
          <div className="text-center">
            <button
              type="submit"
              disabled={stage === "submitting"}
              className="w-full max-w-md flex items-center justify-center mx-auto bg-[#84cc16] text-[#0f172a] font-bold py-4 px-4 rounded-lg text-lg hover:bg-[#a3e635] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#84cc16] disabled:bg-[#94a3b8]"
            >
              {stage === "submitting" ? (
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
                  Calculating...
                </>
              ) : (
                "Calculate & See My Full Report →"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// --- We must wrap the component in Suspense for useSearchParams to work ---
export default function ReportPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#f1f5f9] min-h-screen">
          <Header />
          {/* You could place a dedicated <LoadingSkeleton /> here */}
          <div className="flex justify-center items-center h-[80vh]">
            <svg
              className="animate-spin h-10 w-10 text-[#4f46e5]"
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
          </div>
        </div>
      }
    >
      <ReportDiagnostic />
    </Suspense>
  );
}
