"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import ReportSkeleton from "@/components/ReportSkeleton";
import BarChart from "@/components/BarChart";
import DoughnutChart from "@/components/DoughnutChart"; // New chart
// Import new icons
import {
  MapPinIcon,
  StarIcon,
  CodeBracketIcon,
  PhoneXMarkIcon,
  CurrencyRandIcon,
} from "@heroicons/react/24/solid";

// Helper to format currency
const formatCurrency = (value) => {
  if (typeof value !== "number") return "N/A";
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

// Helper function to capitalize
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default function ReportPage() {
  const params = useParams();
  const { id } = params;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // State to manage which leak tab is active
  const [activeTab, setActiveTab] = useState("meo_leak");

  useEffect(() => {
    if (!id) {
      setError("No report ID found.");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Report not found.");

        setReport(data);
        // Set the active tab based on the "biggestProblem"
        switch (data.biggest_problem) {
          case "bad_reviews":
            setActiveTab("trust_leak");
            break;
          case "competitors_winning":
            setActiveTab("meo_leak");
            break;
          case "not_enough_calls":
            setActiveTab("enquiry_leak");
            break;
          default:
            setActiveTab("meo_leak");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleOpenModal = (type) => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSuccess = () => {
    setFormSubmitted(true);
    handleCloseModal();
  };

  if (loading) {
    return <ReportSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-brand-steel">No report data found.</p>
      </div>
    );
  }

  // --- Prepare Data for Charts ---
  const reviewChartData = [
    {
      name: "Your Score",
      value: report.simulated_review_score,
      color: "#EF4444", // brand-danger
    },
    {
      name: "Competitor",
      value: report.simulated_competitor_score,
      color: "#10B981", // brand-success
    },
  ];

  const meoChartData = [
    {
      name: "Competitor",
      value: report.simulated_competitor_meo_rank,
      color: "#10B981",
    },
    {
      name: "You",
      value: report.simulated_meo_rank,
      color: "#EF4444",
    },
  ];

  // Data for the Doughnut chart (simulated)
  const missedRevenue = report.simulated_missed_revenue || 20000;
  const capturedRevenue = missedRevenue * 0.4; // Just a simulation
  const revenueChartData = {
    total: missedRevenue + capturedRevenue,
    leaked: missedRevenue,
    captured: capturedRevenue,
  };

  // --- Tab Content ---
  const tabContent = {
    meo_leak: {
      icon: MapPinIcon,
      title: "Map Leak (MEO)",
      chart: <BarChart data={meoChartData} unit="Rank" reverse={true} />,
      commentary: (
        <>
          <h4 className="font-semibold text-brand-navy-dark">
            What this means:
          </h4>
          <p>
            Your business is ranked{" "}
            <strong className="text-brand-danger">
              #{report.simulated_meo_rank}
            </strong>{" "}
            in Google Maps for your main suburb. Your top competitor is{" "}
            <strong className="text-brand-success">#1</strong>.
          </p>
          <p>
            **The "No-BS" Truth:** If you are not in the top 3 (the "Map Pack"),
            you are invisible. 90% of customers choose a business from the Map
            Pack. This is your biggest and most expensive leak.
          </p>
          <h4 className="font-semibold text-brand-navy-dark mt-4">
            How to fix it:
          </h4>
          <p>
            This is fixed with Map Engine Optimization (MEO) - a sustained
            effort of building citations, getting suburb-specific reviews, and
            optimizing your Google Business Profile.
          </p>
        </>
      ),
    },
    trust_leak: {
      icon: StarIcon,
      title: "Trust Leak (Reviews)",
      chart: <BarChart data={reviewChartData} unit="Stars" />,
      commentary: (
        <>
          <h4 className="font-semibold text-brand-navy-dark">
            What this means:
          </h4>
          <p>
            Your average review score is{" "}
            <strong className="text-brand-danger">
              {report.simulated_review_score} stars
            </strong>
            . Your top competitor has{" "}
            <strong className="text-brand-success">
              {report.simulated_competitor_score} stars
            </strong>
            .
          </p>
          <p>
            **The "No-BS" Truth:** Customers won't call a {report.industry} with
            a 3-star rating. Even if they find you, they will choose your
            competitor because they seem safer and more trustworthy.
          </p>
          <h4 className="font-semibold text-brand-navy-dark mt-4">
            How to fix it:
          </h4>
          <p>
            This is fixed with an automated Review Collection system. After
            every job, your customer automatically gets a single link to leave a
            5-star review, building your score on autopilot.
          </p>
        </>
      ),
    },
    seo_leak: {
      icon: CodeBracketIcon,
      title: "Site Leak (SEO)",
      chart: null, // No chart, just text
      commentary: (
        <>
          <h4 className="font-semibold text-brand-navy-dark">
            What this means:
          </h4>
          <p>
            We ran a basic technical check on{" "}
            <span className="font-mono text-brand-info">
              {report.website_url}
            </span>
            .
          </p>
          <ul className="list-disc list-outside pl-5 space-y-2 mt-2">
            {report.simulated_has_title ? (
              <li className="text-brand-success">
                <strong>Page Title:</strong> Found! This is great.
              </li>
            ) : (
              <li className="text-brand-danger">
                <strong>Page Title:</strong>{" "}
                <span className="font-bold">CRITICAL LEAK!</span> Your homepage
                is missing a {`<title>`} tag. Google doesn't know what your page
                is about.
              </li>
            )}
            <li className="text-brand-warning">
              <strong>Meta Description:</strong> Missing. This is the text that
              sells your business on the Google search results page.
            </li>
          </ul>
          <h4 className="font-semibold text-brand-navy-dark mt-4">
            How to fix it:
          </h4>
          <p>
            This requires basic on-page Search Engine Optimization (SEO). Your
            website code must be updated to tell Google exactly who you are,
            what you do, and where you operate.
          </p>
        </>
      ),
    },
    enquiry_leak: {
      icon: PhoneXMarkIcon,
      title: "Enquiry Leak (Calls)",
      chart: null, // No chart, just text
      commentary: (
        <>
          <h4 className="font-semibold text-brand-navy-dark">
            What this means:
          </h4>
          <p>
            Our simulation estimates your website is leaking{" "}
            <strong className="text-brand-danger">
              ~{report.simulated_missed_calls} enquiries
            </strong>{" "}
            per month.
          </p>
          <p>
            **The "No-BS" Truth:** This happens when a customer visits your site
            after hours or while you're on a job. They don't want to leave a
            voicemail or fill out a form. They just close the page and call your
            competitor.
          </p>
          <h4 className="font-semibold text-brand-navy-dark mt-4">
            How to fix it:
          </h4>
          <p>
            This is fixed with an automated Chatbot. It instantly engages the
            visitor 24/7, answers basic questions, and—most importantly—
            <strong>
              captures their name, phone number, and job details
            </strong>{" "}
            for you to follow up on.
          </p>
        </>
      ),
    },
  };

  const activeTabData = tabContent[activeTab];

  return (
    <>
      {isModalOpen && (
        <LeadCaptureModal
          reportContext={report} // Pass the full report object
          ctaType="review" // 'review' is the CTA type
          conceptFocus={report.concept_focus} // Pass the industry/focus
          onClose={handleCloseModal}
          onFormSubmit={handleFormSuccess}
        />
      )}
      <div className="bg-brand-light-gray min-h-screen fade-in">
        {/* Header - This is the report title, not the main site header */}
        <header className="bg-brand-off-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl font-bold text-brand-navy-dark">
              "Money Leak" Report
            </h1>
            <p className="text-sm text-brand-steel mt-1 font-mono">
              For: {report.business_name}
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Summary */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-brand-off-white p-6 rounded-lg shadow card-hover card-border-info">
                <h2 className="text-xl font-bold text-brand-navy-dark border-b-2 border-brand-light-gray pb-2 mb-4">
                  Audit Inputs
                </h2>
                <ul className="divide-y divide-gray-200">
                  <li className="flex justify-between items-center py-3">
                    <strong className="text-brand-steel-dark">
                      Business Name:
                    </strong>
                    <span className="font-medium text-brand-navy-dark text-right">
                      {report.business_name}
                    </span>
                  </li>
                  <li className="flex justify-between items-center py-3">
                    <strong className="text-brand-steel-dark">Website:</strong>
                    <span className="font-medium text-brand-navy-dark truncate text-right">
                      {report.website_url}
                    </span>
                  </li>
                  <li className="flex justify-between items-center py-3">
                    <strong className="text-brand-steel-dark">Suburb:</strong>
                    <span className="font-medium text-brand-navy-dark text-right">
                      {report.suburb}
                    </span>
                  </li>
                  <li className="flex justify-between items-center py-3">
                    <strong className="text-brand-steel-dark">Industry:</strong>
                    <span className="font-medium text-brand-navy-dark text-right">
                      {capitalize(report.industry)}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-brand-off-white p-6 rounded-lg shadow card-hover card-border-warning">
                <h2 className="text-xl font-bold text-brand-navy-dark border-b-2 border-brand-light-gray pb-2 mb-4">
                  Simulated Missed Revenue
                </h2>
                <DoughnutChart data={revenueChartData} />
                <p className="text-center text-brand-steel-dark mt-4">
                  Your leaks could be costing you over{" "}
                  <strong className="text-brand-danger">
                    {formatCurrency(report.simulated_missed_revenue)}
                  </strong>{" "}
                  per month.
                </p>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-2 bg-brand-off-white p-6 rounded-lg shadow card-hover">
              {/* Tabs */}
              <div className="flex border-b-2 border-brand-light-gray mb-6">
                {Object.keys(tabContent).map((key) => {
                  const tab = tabContent[key];
                  const isActive = activeTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex items-center gap-2 py-2 px-4 text-sm sm:text-lg font-semibold transition-colors duration-300 ${
                        isActive
                          ? "border-b-2 border-brand-info text-brand-info"
                          : "text-brand-steel hover:text-brand-navy-light"
                      }`}
                    >
                      <tab.icon
                        className={`h-5 w-5 ${
                          isActive ? "text-brand-info" : "text-brand-steel"
                        }`}
                      />
                      <span>{tab.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Content */}
              <div className="fade-in">
                {activeTabData.chart && (
                  <div className="mb-6">{activeTabData.chart}</div>
                )}
                <div className="prose prose-sm sm:prose-base max-w-none text-brand-steel-dark leading-relaxed space-y-4">
                  {activeTabData.commentary}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div
            id="cta-section"
            className="mt-10 bg-brand-off-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            {formSubmitted ? (
              <div
                className="bg-green-100 border-l-4 border-brand-action-green text-green-700 p-6 rounded-lg shadow-md text-center"
                role="alert"
              >
                <h3 className="font-bold text-xl mb-2">Request Sent!</h3>
                <p>
                  Thank you. An expert will review your report and be in touch
                  shortly to schedule your "No-BS" strategy call.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-brand-navy-dark mb-3">
                  Ready to Fix These Leaks?
                </h2>
                <p className="text-brand-steel-dark mb-8 max-w-2xl mx-auto">
                  This report is just the start. The next step is a free,
                  15-minute "No-BS" strategy call to discuss a step-by-step
                  plan. No sales pitch, just value.
                </p>
                <button
                  onClick={handleOpenModal}
                  className="bg-brand-info text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Request My Free Strategy Call
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
