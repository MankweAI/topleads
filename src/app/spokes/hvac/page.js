"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getTroubleshootingTips, // Primary function for this page
  getBenchmarkParams, // Can be used for context if needed
} from "@/lib/calculationEngine";
import CalculatorInput from "@/components/CalculatorInput";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import CollapsibleSection from "@/components/CollapsibleSection";
import Header from "@/components/Header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// --- Removed metadata export ---

// --- Configuration ---
const pageConfig = {
  // SEO Optimized Title used in H1
  title: "Troubleshooting Common Clarifier Problems: Interactive Guide",
  description:
    "Diagnose common issues with your wastewater clarifier, from high effluent solids to sludge management problems. Select the symptom to see potential causes and solutions.",
  calculatorConfig: {
    title: "Clarifier Troubleshooting Assistant",
    description: "Select your industry and the primary problem observed.",
    hiddenFields: {
      conceptFocus: "troubleshooting", // Focus on troubleshooting
      technology_context: "clarifier", // Specific to clarifiers
      // Provide default context (can be overridden if needed by calculation engine)
      flow_rate_m3_hr: 200,
      tss_mg_l: 3000,
    },
    fields: [
      {
        name: "industry",
        label: "Primary Industry (Context)",
        type: "select",
        options: [
          { value: "mining_beneficiation", label: "Mining & Beneficiation" },
          { value: "heavy_industry_metals", label: "Heavy Industry / Metals" },
          {
            value: "aggregate_sand_washing",
            label: "Aggregate / Sand Washing",
          },
          { value: "municipal_primary", label: "Municipal Primary/Secondary" },
          { value: "food_beverage", label: "Food & Beverage (Post-Primary)" }, // Clarifiers used after DAF/Bio
          { value: "general_industrial", label: "General Industrial" },
          { value: "other", label: "Other" },
        ],
        defaultValue: "mining_beneficiation",
        tooltip:
          "Select your industry for context (some issues are more common in certain sectors).",
      },
      {
        name: "problem_type", // Input to specify the problem
        label: "Observed Problem",
        type: "select",
        options: [
          {
            value: "high_tss",
            label: "High TSS in Effluent (Pin Floc / Cloudy)",
          },
          {
            value: "sludge_blanket_high",
            label: "Sludge Blanket Too High / Rising",
          },
          {
            value: "sludge_blanket_low",
            label: "Sludge Blanket Too Low / Rat-holing",
          },
          { value: "floating_sludge", label: "Floating Sludge / Scum Layer" },
          {
            value: "short_circuiting",
            label: "Suspected Short-Circuiting / Uneven Flow",
          },
          { value: "odour_issues", label: "Odour Problems from Clarifier" },
          {
            value: "mechanical_issue",
            label: "Mechanical Issue (Rake, Drive)",
          },
        ],
        defaultValue: "high_tss",
        tooltip: "Select the primary issue you are experiencing.",
      },
      // Potential future addition: Input for current chemical dose or sludge blanket depth
    ],
    // Advanced fields - maybe used later for more detailed inputs
    advancedFields: [],
  },
  hubLink: {
    href: "/",
    title: "Main Hub",
  },
  relatedSpokes: [
    {
      href: "/spokes/clarifier-surface-overflow-rate-sor-calculator",
      title: "Clarifier SOR Calculator", // Relevant to overloading
    },
    {
      href: "/spokes/troubleshooting-high-total-suspended-solids-in-effluent",
      title: "General High TSS Troubleshooting", // Broader context
    },
    {
      href: "/spokes/guide-to-flocculants-and-coagulants-for-sedimentation",
      title: "Guide to Flocculants & Coagulants", // Relevant to chemical dosing issues
    },
  ],
  // Added Clarifier/Thickener Supplier List
  suppliers: [
    {
      name: "Veolia Water Technologies",
      url: "https://www.veolia.co.za/",
      type: "Clarifiers & Services",
    },
    {
      name: "A2V",
      url: "https://www.a2v.co.za/",
      type: "Clarifiers & Services",
    },
    {
      name: "PCI Africa",
      url: "https://pciafrica.com/",
      type: "Clarifiers & Services",
    },
    {
      name: "Xylem",
      url: "https://www.xylem.com/en-za/",
      type: "Clarifiers & Services",
    },
    {
      name: "Cube Consolidating",
      url: "https://cubeconsolidating.com/",
      type: "Clarifiers & Thickeners",
    },
    {
      name: "FLSmidth (EIMCO/Dorr-Oliver)",
      url: "https://www.flsmidth.com/",
      type: "Clarifiers & Thickeners",
    },
    {
      name: "Proxa",
      url: "https://proxa.com/",
      type: "Water Treatment Services",
    }, // Added service provider
    // Add other relevant service/equipment suppliers
  ],
};

// --- Helper Functions ---
// (formatCurrency and formatNumber can be removed if not used, but kept for consistency)
const formatCurrency = (value) => {
  // ... (implementation unchanged)
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};
const formatNumber = (value, decimals = 1) => {
  // ... (implementation unchanged)
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return value.toLocaleString("en-ZA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// --- Component ---
export default function ClarifierTroubleshootingSpoke() {
  const initialFormData = {
    ...pageConfig.calculatorConfig.hiddenFields,
    ...pageConfig.calculatorConfig.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {}),
    ...pageConfig.calculatorConfig.advancedFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {}),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState({ troubleshootingTips: [] }); // Store tips here
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false); // Keep for consistency
  // const [benchmarkParams, setBenchmarkParams] = useState({}); // Not directly used here
  const [headerHeight, setHeaderHeight] = useState(60);

  // Effect to calculate header height
  useEffect(() => {
    const timer = setTimeout(() => {
      const headerElement = document.querySelector("header");
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Effect to get troubleshooting tips when formData changes
  useEffect(() => {
    const { problem_type } = formData;
    const tips = getTroubleshootingTips(
      problem_type,
      "clarifier", // Hardcoded technology context
      formData // Pass all form data as potential details
    );

    setResults({
      troubleshootingTips: tips,
      // Create context for lead capture
      reportContext: {
        id: `live-${Date.now()}`,
        ...formData, // include selected problem, industry etc.
        // No specific calculated values for this spoke
      },
    });
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Include advancedFields if they exist
    const allFields = [
      ...pageConfig.calculatorConfig.fields,
      ...pageConfig.calculatorConfig.advancedFields,
    ];
    const fieldConfig = allFields.find((f) => f.name === name);

    let processedValue = value;
    if (type === "number" || type === "range") {
      // Handle potential future number inputs
      processedValue = value === "" ? null : Number(value);
      if (processedValue !== null && fieldConfig) {
        if (fieldConfig.max !== undefined && processedValue > fieldConfig.max)
          processedValue = fieldConfig.max;
        if (fieldConfig.min !== undefined && processedValue < fieldConfig.min)
          processedValue = fieldConfig.min;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    setFormSubmitted(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleFormSuccess = () => {
    setFormSubmitted(true);
    handleCloseModal();
  };

  const { title, description, hubLink, relatedSpokes, suppliers } = pageConfig;
  const {
    title: calculatorTitle,
    description: calculatorDescription,
    fields,
    advancedFields, // Though empty, keep for structure
  } = pageConfig.calculatorConfig;

  const scrollToCTA = () => {
    document
      .getElementById("cta-section")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      {isModalOpen && results && (
        <LeadCaptureModal
          reportContext={results.reportContext}
          ctaType="review" // Use 'review' for troubleshooting context
          conceptFocus={formData.conceptFocus}
          onClose={handleCloseModal}
          onFormSubmit={handleFormSuccess}
        />
      )}
      {/* Page wrapper */}
      <div className="fade-in relative">
        {/* Background Video Layer */}
        <div className="absolute top-0 left-0 w-full h-[450px] md:h-[400px] overflow-hidden z-0">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/video/wastewater.mp4"
            autoPlay
            loop
            muted
            playsInline
          ></video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/50"></div>
        </div>
        {/* Content Layer */}
        <div className="relative z-10">
          {/* Header Component */}
          <Header />
          {/* Hero Text Section */}
          <section
            className="text-center flex items-center justify-center mb-12"
            style={{ minHeight: "300px", paddingTop: `${headerHeight}px` }}
          >
            <div className="px-4 container mx-auto max-w-4xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                {title}
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto drop-shadow">
                {description}
              </p>
            </div>
          </section>
          {/* Main content container */}
          <div className="container mx-auto px-4 pb-8 md:pb-12 max-w-6xl">
            {/* Section 2: Diagnostic Input and Results Side-by-Side */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
              {/* Diagnostic Input Card */}
              <div
                className="bg-gradient-to-br from-white to-red-50 p-6 md:p-8 rounded-xl shadow-xl border border-red-100 sticky" // Red theme for troubleshooting
                style={{ top: `${headerHeight + 24}px` }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-brand-navy-dark mb-2 text-center">
                  {calculatorTitle}
                </h2>
                <p className="text-brand-steel text-sm md:text-base mb-6 text-center">
                  {calculatorDescription}
                </p>
                <form className="space-y-6">
                  {fields.map((field) => (
                    <CalculatorInput
                      key={field.name}
                      field={field}
                      value={formData[field.name] ?? ""}
                      onChange={handleInputChange}
                    />
                  ))}
                  {/* Advanced Mode Toggle - Placeholder */}
                  {/*
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 mt-4">
                    <Switch
                      id="advanced-mode"
                      checked={isAdvancedMode}
                      onCheckedChange={setIsAdvancedMode}
                    />
                    <Label
                      htmlFor="advanced-mode"
                      className="text-brand-steel cursor-pointer"
                    >
                      Advanced Troubleshooting Input (Future)
                    </Label>
                  </div>
                   */}
                </form>
              </div>

              {/* Live Troubleshooting Tips Card */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200">
                <h2 className="text-xl md:text-2xl font-bold text-brand-navy-dark mb-6 text-center">
                  Potential Causes & Solutions for: <br />{" "}
                  <span className="text-red-600">
                    {formData.problem_type.replace(/_/g, " ")}
                  </span>
                </h2>
                {results && results.troubleshootingTips.length > 0 ? (
                  <ul className="space-y-4 list-disc list-inside text-brand-steel-dark">
                    {results.troubleshootingTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-brand-steel text-center italic py-10">
                    Select a problem above to see potential causes and
                    solutions.
                  </p>
                )}
                <p className="text-xs text-gray-500 italic text-center mt-6">
                  Note: These are common suggestions. Effective troubleshooting
                  requires a systematic approach and understanding of your
                  specific plant design and operation. Consider requesting
                  expert assistance.
                </p>
              </div>
            </section>

            {/* Section 3: Smart Technical Brief */}
            <section className="mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-4 border-b pb-3">
                Clarifier Fundamentals & Troubleshooting Approach
              </h2>
              <div className="space-y-1">
                <CollapsibleSection title="Understanding Clarifier Zones & Function">
                  <p>
                    A conventional clarifier relies on gravity to separate
                    solids from liquid. Understanding its functional zones is
                    key to troubleshooting:
                  </p>
                  <ul>
                    <li>
                      <strong>Inlet Zone/Feedwell:</strong> Dissipates influent
                      energy and distributes flow evenly to prevent
                      short-circuiting and floc shear. Issues here (blockages,
                      incorrect design) cause poor performance downstream.
                    </li>
                    <li>
                      <strong>Settling Zone:</strong> The largest volume, where
                      quiescent conditions allow solids to settle under gravity.
                      Factors affecting settling include particle size/density,
                      water temperature (viscosity), and hydraulic loading
                      (SOR).
                    </li>
                    <li>
                      <strong>Sludge Zone:</strong> Bottom conical section where
                      settled solids collect. Includes the rake mechanism to
                      move sludge towards the underflow outlet. Sludge blanket
                      depth is a critical parameter.
                    </li>
                    <li>
                      <strong>Outlet Zone/Weir:</strong> Collects clarified
                      water. Weir design and leveling are important to ensure
                      even flow withdrawal and prevent solids carryover. Weir
                      loading rate is a key design parameter.
                    </li>
                  </ul>
                </CollapsibleSection>

                <CollapsibleSection title="Key Operational Parameters to Monitor">
                  <p>Regular monitoring helps identify problems early:</p>
                  <ul>
                    <li>
                      <strong>Effluent Turbidity/TSS:</strong> The most direct
                      measure of performance. Increases indicate settling
                      issues, overloading, or chemical imbalances.
                    </li>
                    <li>
                      <strong>Sludge Blanket Depth:</strong> Measured using a
                      core sampler (&apos;sludge judge&apos;) or electronic probe. Too
                      high indicates insufficient sludge withdrawal; too low can
                      lead to &apos;rat-holing&apos; and thin underflow. Target depth
                      varies by design.
                    </li>
                    <li>
                      <strong>Chemical Dosage (if applicable):</strong> Ensure
                      correct coagulant/flocculant type, dose rate, mixing
                      energy, and pH. Check pump calibration and chemical stock
                      levels.
                    </li>
                    <li>
                      <strong>Rake Torque:</strong> Monitors the load on the
                      sludge rake mechanism. High torque can indicate excessive
                      sludge accumulation, scaling, or mechanical issues. Low
                      torque might suggest insufficient sludge.
                    </li>
                    <li>
                      <strong>Flow Rate:</strong> Ensure the clarifier isn&apos;t
                      hydraulically overloaded beyond its design SOR. Check flow
                      meters.
                    </li>
                    <li>
                      <strong>Visual Observations:</strong> Look for floating
                      solids/scum, uneven weir flow, excessive turbulence in the
                      feedwell, or unusual sludge appearance.
                    </li>
                  </ul>
                </CollapsibleSection>

                <CollapsibleSection title="Systematic Troubleshooting Approach">
                  <p>When problems arise, follow a logical process:</p>
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>
                      <strong>Define the Problem Clearly:</strong> What specific
                      symptom are you observing (e.g., cloudy effluent, rising
                      blanket)? When did it start?
                    </li>
                    <li>
                      <strong>Check Operating Data:</strong> Review trends in
                      flow rate, effluent quality, chemical dosing, sludge
                      blanket depth, and torque readings leading up to the
                      problem.
                    </li>
                    <li>
                      <strong>Inspect Equipment:</strong> Visually inspect the
                      feedwell, weirs, rake mechanism (if possible safely), and
                      sludge pumps for obvious issues (blockages, damage, uneven
                      flow).
                    </li>
                    <li>
                      <strong>Verify Chemical Program:</strong> If chemicals are
                      used, double-check dosages, pump operation, mixing, and
                      chemical quality. Consider performing a quick jar test.
                    </li>
                    <li>
                      <strong>Assess Hydraulic Loading:</strong> Is the flow
                      rate significantly higher than the design SOR? Check for
                      upstream process changes.
                    </li>
                    <li>
                      <strong>Evaluate Sludge Withdrawal:</strong> Is the
                      underflow rate appropriate for the solids load? Adjust
                      pump speed or duration as needed based on blanket depth.
                    </li>
                    <li>
                      <strong>Consider Influent Changes:</strong> Have there
                      been upstream process changes affecting wastewater
                      characteristics (TSS, pH, temperature, new chemicals)?
                    </li>
                    <li>
                      <strong>Consult Documentation & Experts:</strong> Refer to
                      the clarifier&apos;s operating manual. If the problem persists,
                      seek advice from experienced operators, process engineers,
                      or equipment suppliers using the button below.
                    </li>
                  </ol>
                  <div className="mt-4 text-center">
                    <button
                      onClick={scrollToCTA}
                      className="text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      Need expert troubleshooting assistance? Request a review.
                    </button>
                  </div>
                </CollapsibleSection>
              </div>
            </section>

            {/* Section 4: Call to Action */}
            <section
              id="cta-section"
              className="mt-12 bg-gradient-to-r from-red-700 to-red-900 p-10 rounded-xl shadow-2xl text-center" // Red theme for troubleshooting
            >
              <h2 className="text-3xl font-bold text-white mb-3">
                Need Help Solving Your Clarifier Issue?
              </h2>
              <p className="text-red-100 mb-8 max-w-2xl mx-auto">
                Get a free consultation with a wastewater process expert to
                discuss the specific problem you&apos;re facing (
                {formData.problem_type.replace(/_/g, " ")}). Submit your
                details, and we&apos;ll connect you for targeted troubleshooting
                support.
              </p>
              {formSubmitted ? (
                <p className="text-white font-bold text-lg p-4 bg-white/20 rounded-md inline-block">
                  Thank You! Your request has been sent. An expert will be in
                  touch shortly via email.
                </p>
              ) : (
                <button
                  onClick={handleOpenModal}
                  className="bg-white text-red-800 font-bold py-4 px-10 rounded-lg text-lg hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg" // Adjusted button colors
                >
                  Request Troubleshooting Assistance
                </button>
              )}
            </section>

            {/* Section 5: Related Topics */}
            {(relatedSpokes?.length > 0 || hubLink) && (
              <section className="mt-16 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-brand-navy mb-4 text-center">
                  Explore Related Topics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedSpokes?.map((spoke) => (
                    <Link
                      href={spoke.href}
                      key={spoke.href}
                      className="block p-5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md hover:border-blue-300 transition-all duration-200"
                    >
                      <p className="font-semibold text-brand-navy text-center">
                        {spoke.title}
                      </p>
                    </Link>
                  ))}
                </div>
                {hubLink && (
                  <div className="text-center mt-8">
                    <Link
                      href={hubLink.href}
                      className="inline-block px-6 py-3 rounded-lg bg-gray-100 border border-gray-200 text-brand-steel-dark font-semibold hover:bg-gray-200 transition-colors"
                    >
                      ← Back to {hubLink.title}
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Section 6: Supplier Directory */}
            {suppliers && suppliers.length > 0 && (
              <section className="mt-16 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-brand-navy-dark flex items-center justify-center gap-2 border-b border-gray-200 pb-3 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Clarifier Suppliers & Service Providers (SA){" "}
                  {/* Updated Title */}
                </h2>
                <p className="text-sm text-brand-steel text-center mb-6">
                  List of potential equipment suppliers and service companies
                  who may assist with clarifier issues. Effluentic is
                  independent.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suppliers.map((supplier) => (
                    <a
                      href={supplier.url}
                      key={supplier.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-blue-500 transition-all duration-200"
                    >
                      <span className="font-semibold text-brand-navy">
                        {supplier.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({supplier.type})
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Section 7: Safety & Handling */}
            <section className="mt-16 max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold text-yellow-800 flex items-center justify-center gap-2 border-b border-yellow-300 pb-3 mb-6">
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Clarifier & Chemical Safety Considerations
              </h2>
              <div className="prose prose-sm sm:prose text-yellow-900 max-w-none">
                {/* Content unchanged */}
                <p>
                  Operating clarifiers, especially large units and those
                  involving chemical dosing, requires attention to safety:
                </p>
                <ul>
                  <li>
                    <strong>Chemical Handling (Flocculants/Coagulants):</strong>{" "}
                    Although often less acutely hazardous than strong
                    acids/bases, flocculants (especially powders) can create
                    slip hazards when wet. Always follow SDS guidelines for PPE
                    (gloves, eye protection, dust masks for powders). Ensure
                    proper storage and spill containment.
                  </li>
                  <li>
                    <strong>Rotating Equipment:</strong> Clarifier rake drives
                    are powerful mechanisms. Always use LOTO procedures before
                    any maintenance on the drive or internal components. Ensure
                    drive guards are in place.
                  </li>
                  <li>
                    <strong>Working at Height:</strong> Accessing drive
                    platforms, weirs, or feed wells often involves working at
                    height. Ensure proper fall protection (harnesses, railings)
                    is used.
                  </li>
                  <li>
                    <strong>Confined Spaces:</strong> Clarifier tanks (when
                    empty) are confined spaces. Entry requires permits,
                    atmospheric testing, ventilation, and trained personnel with
                    rescue plans. Beware of potential sludge decomposition gases
                    (H₂S).
                  </li>
                  <li>
                    <strong>Slips, Trips, and Falls:</strong> Walkways around
                    clarifiers can be wet or slippery. Maintain good
                    housekeeping and use non-slip grating or surfaces where
                    possible.
                  </li>
                  <li>
                    <strong>Electrical Safety:</strong> Ensure motors, control
                    panels, and sensors are properly grounded and protected from
                    weather/water ingress.
                  </li>
                  <li>
                    <strong>Emergency Preparedness:</strong> Know locations of
                    emergency stops for rake drives and pumps. Ensure access to
                    eyewash stations if chemicals are handled nearby.
                  </li>
                </ul>
                <p className="mt-4 italic">
                  Disclaimer: This provides general safety points. Always follow
                  detailed site-specific safety procedures, risk assessments,
                  and regulatory requirements.
                </p>
              </div>
            </section>
          </div>{" "}
          {/* End main content container */}
        </div>{" "}
        {/* End content layer */}
      </div>{" "}
      {/* End page wrapper */}
    </>
  );
}
