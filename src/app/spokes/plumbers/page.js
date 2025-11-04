"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  estimateChemicalDosage,
  getBenchmarkParams,
} from "@/lib/calculationEngine";
import CalculatorInput from "@/components/CalculatorInput";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import CollapsibleSection from "@/components/CollapsibleSection";
import Header from "@/components/Header"; // Import Header component
// Import Switch and Label (assuming they exist as placeholders or actual components)
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// --- Configuration ---
const pageConfig = {
  title: "Chemical Treatment for Oil Emulsions: Interactive Dosage Estimator",
  description:
    "Estimate the preliminary coagulant dosage required to break oil-in-water emulsions in industrial wastewater. Adjust parameters and request a review for optimization.",
  calculatorConfig: {
    title: "Coagulant Dosage Estimator",
    description:
      "Enter wastewater characteristics. Jar testing is crucial for accuracy.",
    hiddenFields: {
      conceptFocus: "chemical_dosing",
      contaminant_type: "Low-Density",
    },
    fields: [
      {
        name: "industry",
        label: "Primary Industry",
        type: "select",
        options: [
          { value: "food_beverage", label: "Food & Beverage (General)" },
          { value: "meat_processing", label: "Meat Processing" },
          { value: "dairy_processing", label: "Dairy Processing" },
        ],
        defaultValue: "food_beverage",
        tooltip:
          "Industry affects typical wastewater chemistry and dosage needs.",
      },
      {
        name: "flow_rate_m3_hr",
        label: "Flow Rate",
        unit: "m³/hr",
        min: 1,
        max: 500,
        step: 1,
        defaultValue: 50,
        tooltip: "The volumetric flow rate impacts total chemical consumption.",
      },
      {
        name: "tss_mg_l",
        label: "FOG & TSS Concentration",
        unit: "mg/L",
        min: 100,
        max: 8000,
        step: 100,
        defaultValue: 1500,
        tooltip:
          "Combined concentration of Fats, Oils, Grease, and Suspended Solids influencing coagulant demand.",
      },
      {
        name: "influent_ph",
        label: "Influent pH (Optional)",
        type: "number",
        min: 2,
        max: 12,
        step: 0.1,
        defaultValue: 6.5,
        tooltip:
          "Influent pH significantly impacts coagulant choice and effectiveness. Optimal range often 6-8.",
        optional: true,
      },
    ],
    // Advanced fields section (for consistency, though no inputs yet)
    advancedFields: [
      // Currently no overrides for chemical factors, but structure is here
    ],
  },
  hubLink: {
    href: "/",
    title: "Main Hub",
  },
  relatedSpokes: [
    {
      href: "/spokes/removing-emulsified-oils-from-industrial-wastewater",
      title: "Removing Emulsified Oils from Industrial Wastewater",
    },
    {
      href: "/spokes/how-to-optimize-chemical-dosage-for-daf-systems",
      title: "How to Optimize Chemical Dosage for DAF Systems",
    },
    {
      href: "/spokes/guide-to-flocculants-and-coagulants-for-sedimentation",
      title: "Guide to Flocculants & Coagulants",
    },
  ],
  suppliers: [
    { name: "BASF", url: "https://www.basf.com/za/en.html", type: "Chemicals" },
    {
      name: "AECI Water",
      url: "https://www.water.aeciworld.com/",
      type: "Chemicals & Services",
    },
    { name: "Buckman", url: "https://buckman.com/za/", type: "Chemicals" },
    {
      name: "NCP Chlorchem",
      url: "https://www.ncp.co.za/",
      type: "Chemicals (e.g., Ferric Chloride)",
    },
    {
      name: "Prominent Paints Industrial (Kemklean)",
      url: "https://www.prominentpaints.co.za/industrial/kemklean/",
      type: "Chemicals",
    },
    {
      name: "SNF Floerger",
      url: "https://www.snf.com/",
      type: "Polymers/Flocculants",
    },
  ],
};

// --- Helper Functions ---
const formatCurrency = (value) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const formatNumber = (value, decimals = 1) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return value.toLocaleString("en-ZA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// --- Component ---
export default function ChemicalEmulsionSpoke() {
  const initialFormData = {
    ...pageConfig.calculatorConfig.hiddenFields,
    ...pageConfig.calculatorConfig.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {}),
    // Initialize advanced fields (even if empty now)
    ...pageConfig.calculatorConfig.advancedFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {}),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [benchmarkFactors, setBenchmarkFactors] = useState({});
  const [headerHeight, setHeaderHeight] = useState(60);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false); // State for toggle

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

  useEffect(() => {
    const { flow_rate_m3_hr, tss_mg_l, industry } = formData;

    // Estimate chemical dosage (assuming DAF context for emulsion breaking)
    const chemEstimates = estimateChemicalDosage(
      flow_rate_m3_hr,
      tss_mg_l,
      industry,
      "daf" // Assume pre-treatment for DAF
    );

    // Get benchmark chemical factors for display
    const benchmarks = getBenchmarkParams(industry, "daf"); // Get DAF params which include chem factors
    setBenchmarkFactors({
      base: benchmarks?.chem_dose_base ?? "N/A", // Use ?? for nullish coalescing
      factor: benchmarks?.chem_dose_tss_factor ?? "N/A",
    });

    setResults({
      chemicalDosage: chemEstimates,
      // Create context for lead capture
      reportContext: {
        id: `live-${Date.now()}`,
        ...formData, // include all form data
        calculatedDose_mgL: chemEstimates.dose_mg_l,
        calculatedDaily_kg: chemEstimates.daily_kg,
        calculatedAnnualCost: chemEstimates.annual_cost_zar,
      },
    });
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Include advancedFields in the search
    const allFields = [
      ...pageConfig.calculatorConfig.fields,
      ...pageConfig.calculatorConfig.advancedFields,
    ];
    const fieldConfig = allFields.find((f) => f.name === name);

    let processedValue = value;
    if (type === "number" || type === "range") {
      processedValue = value === "" ? null : Number(value); // Handle clearing optional numbers
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
    advancedFields, // Destructure advancedFields
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
          ctaType="review"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/20 to-black/20"></div>
        </div>
        {/* Content Layer */}
        <div className="relative z-10">
          {/* Header Component */}
          <Header /> {/* Header should manage its own z-index internally */}
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
            {/* Section 2: Calculator and Results Side-by-Side */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
              {/* Calculator Card */}
              <div
                className="bg-gradient-to-br from-white to-green-50 p-6 md:p-8 rounded-xl shadow-xl border border-green-100 sticky"
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
                      value={
                        formData[field.name] ??
                        (field.type === "number" || field.type === "range"
                          ? ""
                          : "")
                      }
                      onChange={handleInputChange}
                    />
                  ))}
                  {/* Advanced Mode Toggle */}
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
                      Advanced Mode (Show Benchmarks)
                    </Label>
                  </div>
                </form>

                {/* Advanced Fields Display Area (Shows Benchmarks) */}
                {isAdvancedMode && (
                  <div className="mt-6 space-y-4 pl-4 border-l-2 border-green-200 ml-2">
                    <p className="text-sm text-brand-steel-dark italic">
                      Benchmarks Used (Industry:{" "}
                      {formData.industry.replace(/_/g, " ")}):
                    </p>
                    <ul className="text-sm text-brand-steel-dark list-disc list-inside">
                      <li>
                        Base Dose ≈ {formatNumber(benchmarkFactors.base, 0)}{" "}
                        mg/L
                      </li>
                      <li>
                        TSS Factor ≈ {formatNumber(benchmarkFactors.factor, 3)}
                      </li>
                    </ul>
                    {/* Add inputs here later if overrides are needed */}
                    {advancedFields.map((field) => (
                      <CalculatorInput
                        key={field.name}
                        field={field}
                        value={formData[field.name] ?? ""}
                        onChange={handleInputChange}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Live Dosage Summary Card */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200">
                <h2 className="text-xl md:text-2xl font-bold text-brand-navy-dark mb-6 text-center">
                  Live Coagulant Dosage Estimate
                </h2>
                {/* Content unchanged */}
                {results && results.chemicalDosage ? (
                  <div className="grid grid-cols-1 gap-4 text-center">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 transition-all duration-300 hover:shadow-md">
                      <p className="text-xs uppercase tracking-wider font-semibold text-yellow-800">
                        Estimated Dose
                      </p>
                      <p className="text-3xl font-extrabold text-yellow-700 mt-1">
                        {formatNumber(results.chemicalDosage.dose_mg_l)} mg/L
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                        Est. Daily Usage
                      </p>
                      <p className="text-3xl font-extrabold text-brand-navy mt-1">
                        {formatNumber(results.chemicalDosage.daily_kg, 2)}{" "}
                        kg/day
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 transition-all duration-300 hover:shadow-md">
                      <p className="text-xs uppercase tracking-wider font-semibold text-green-800">
                        Est. Annual Cost
                      </p>
                      <p className="text-3xl font-extrabold text-green-700 mt-1">
                        {formatCurrency(results.chemicalDosage.annual_cost_zar)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-brand-steel text-center italic py-10">
                    Adjust parameters to see dosage estimates.
                  </p>
                )}
                <p className="text-xs text-gray-500 italic text-center mt-6">
                  Note: This is a preliminary estimate for coagulation only.
                  Flocculant requirements, pH adjustment, and actual costs
                  depend heavily on wastewater chemistry and require jar
                  testing.
                </p>
              </div>
            </section>

            {/* Section 3: Smart Technical Brief */}
            <section className="mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              {/* Content unchanged */}
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-4 border-b pb-3">
                Technical Brief & Next Steps
              </h2>
              <div className="space-y-1">
                <CollapsibleSection title="Mechanism of Emulsion Breaking">
                  {/* ... content ... */}
                  <p>
                    Oil-in-water emulsions, common in food processing,
                    metalworking, and other industries, are stable mixtures
                    where tiny oil droplets are dispersed in water, often
                    stabilized by surfactants or fine particles. Breaking these
                    emulsions is necessary for effective oil removal. This
                    typically involves chemical destabilization using
                    **coagulants**.
                  </p>
                  <ul>
                    <li>
                      <strong>Charge Neutralization:</strong> Many emulsions are
                      stabilized by negative charges on the oil droplets.
                      Cationic coagulants (like Ferric Chloride, Fe³⁺, or
                      Polyaluminium Chloride, PAC, Al³⁺ complexes) neutralize
                      these charges, allowing droplets to approach each other.
                    </li>
                    <li>
                      <strong>Sweep Flocculation:</strong> At higher doses,
                      metal salt coagulants form hydroxide precipitates (e.g.,
                      Fe(OH)₃, Al(OH)₃). These precipitates physically entrap
                      the oil droplets as they settle or are floated.
                    </li>
                    <li>
                      <strong>Bridging (Polymers):</strong> Sometimes, organic
                      polymers are used alongside or instead of metal salts.
                      Long-chain polymers can attach to multiple oil droplets,
                      bridging them together to form larger, more easily
                      separable aggregates.
                    </li>
                  </ul>
                  <p>
                    The choice of chemical and the optimal dose depend heavily
                    on the wastewater&apos;s pH, alkalinity, temperature, the type of
                    oil and emulsifier present, and the desired separation
                    method (e.g., DAF or sedimentation).
                  </p>
                </CollapsibleSection>
                <CollapsibleSection title="Common Coagulants & Considerations">
                  {/* ... content ... */}
                  <p>
                    Several chemicals are commonly used for emulsion breaking:
                  </p>
                  <ul>
                    <li>
                      <strong>Ferric Chloride (FeCl₃):</strong> Effective over a
                      wide pH range (often 5-9), forms dense flocs. Can lower
                      pH, potentially requiring adjustment. Produces
                      reddish-brown sludge.
                    </li>
                    <li>
                      <strong>Polyaluminium Chloride (PAC):</strong> Effective
                      over a broad pH range, often requires lower doses than
                      alum or ferric, works well in cold water. Produces less
                      sludge volume than alum. Can be more expensive.
                    </li>
                    <li>
                      <strong>Aluminium Sulfate (Alum, Al₂(SO₄)₃):</strong>{" "}
                      Works best in a narrower pH range (typically 6-7.5). Can
                      consume alkalinity and lower pH. Produces relatively
                      light, voluminous sludge.
                    </li>
                    <li>
                      <strong>Organic Polymers (Cationic):</strong> Can be very
                      effective, sometimes reducing or eliminating the need for
                      metal salts. Dosage is critical as overdosing can
                      re-stabilize the emulsion. Often used in conjunction with
                      a primary coagulant.
                    </li>
                  </ul>
                  <p>
                    <strong>pH Adjustment:</strong> The effectiveness of metal
                    salt coagulants is highly pH-dependent. Often, pH adjustment
                    (using acid or caustic) is required before or during
                    coagulation to reach the optimal range for the chosen
                    chemical (check manufacturer&apos;s recommendations).
                  </p>
                  {/* Updated Benchmark Display */}
                  <p
                    className={`mt-2 text-sm italic ${
                      isAdvancedMode ? "block" : "hidden"
                    }`}
                  >
                    Estimate based on typical factors for{" "}
                    {formData.industry.replace(/_/g, " ")}: Base Dose ≈{" "}
                    {formatNumber(benchmarkFactors.base, 0)} mg/L + TSS Factor ≈{" "}
                    {formatNumber(benchmarkFactors.factor, 3)}.
                  </p>
                </CollapsibleSection>
                <CollapsibleSection title="Next Steps: Jar Testing is Crucial">
                  {/* ... content ... */}
                  <p>
                    This estimator provides a starting point based on
                    benchmarks. However, **laboratory jar testing is
                    non-negotiable** for accurately determining the best
                    chemical treatment program and avoiding costly operational
                    issues.
                  </p>
                  <ol className="list-decimal list-inside space-y-3 mt-3">
                    <li>
                      <strong>Representative Sampling:</strong> Collect samples
                      that accurately reflect your typical wastewater, including
                      variations during different production cycles or shifts.
                      Consider composite samples over a period.
                    </li>
                    <li>
                      <strong>Screening Chemicals & pH:</strong> Test various
                      coagulants (Ferric, PAC, Alum, specific polymers) at
                      different dosages under controlled conditions (mixing
                      speed, time). Critically, perform these tests across a
                      range of pH values (e.g., pH 5, 6, 7, 8, 9) to identify
                      the optimal pH for each chemical. Observe floc formation
                      speed, size, settling/floating characteristics, and
                      clarity of the supernatant.
                    </li>
                    <li>
                      <strong>Flocculant Addition (If Needed):</strong> After
                      determining the best primary coagulant and optimal pH,
                      test the addition of a suitable flocculant (often anionic
                      or non-ionic polymer for metal salt coagulation) to aid
                      floc growth and separation speed. Test different polymer
                      types and dosages.
                    </li>
                    <li>
                      <strong>Data Analysis & Cost-Performance:</strong>{" "}
                      Evaluate results based on performance (TSS/FOG removal,
                      clarity), chemical cost, required pH adjustment cost,
                      sludge volume produced (impacting disposal costs), and
                      ease of operation (e.g., sensitivity to overdose).
                    </li>
                    <li>
                      <strong>Consultation & Validation:</strong> Discuss your
                      jar test results and project goals with chemical suppliers
                      and process engineers. They can help interpret results,
                      recommend specific product grades, and assist in planning
                      for full-scale implementation, including dosing equipment
                      and mixing design. Use the button below to request an
                      expert review.
                    </li>
                  </ol>
                  <div className="mt-4 text-center">
                    <button
                      onClick={scrollToCTA}
                      className="text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      Need help interpreting results or planning tests? Request
                      a review.
                    </button>
                  </div>
                </CollapsibleSection>
              </div>
            </section>

            {/* Section 4: Call to Action */}
            <section
              id="cta-section"
              className="mt-12 bg-gradient-to-r from-green-700 to-green-900 p-10 rounded-xl shadow-2xl text-center"
            >
              {/* Content unchanged */}
              <h2 className="text-3xl font-bold text-white mb-3">
                Optimize Your Chemical Treatment Strategy
              </h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Get a free review of your estimated chemical needs and discuss
                optimization strategies (including jar testing protocols) with a
                process expert. Submit your details for a no-obligation
                consultation based on the parameters you&apos;ve entered.
              </p>
              {formSubmitted ? (
                <p className="text-white font-bold text-lg p-4 bg-white/20 rounded-md inline-block">
                  Thank You! Your request has been sent. An engineer will be in
                  touch shortly via email.
                </p>
              ) : (
                <button
                  onClick={handleOpenModal}
                  className="bg-white text-green-800 font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  Request Free Chemical Review
                </button>
              )}
            </section>

            {/* Section 5: Related Topics (Moved) */}
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

            {/* Section 6: Supplier Directory (Moved) */}
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
                  Coagulant & Flocculant Suppliers (South Africa)
                </h2>
                <p className="text-sm text-brand-steel text-center mb-6">
                  The following is a list of potential chemical suppliers.
                  Effluentic is independent and does not endorse any specific
                  supplier. Jar testing is recommended to select the best
                  product for your specific wastewater.
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

            {/* Section 7: Safety & Handling (Moved) */}
            <section className="mt-16 max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-8 shadow-md">
              {/* Content unchanged */}
              <h2 className="text-2xl font-bold text-yellow-800 flex items-center justify-center gap-2 border-b border-yellow-300 pb-3 mb-6">
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
                Safety & Handling Best Practices
              </h2>
              <div className="prose prose-sm sm:prose text-yellow-900 max-w-none">
                <p>
                  Working with water treatment chemicals like coagulants (often
                  acidic or corrosive) requires strict adherence to safety
                  protocols:
                </p>
                <ul>
                  <li>
                    <strong>Personal Protective Equipment (PPE):</strong> Always
                    wear appropriate PPE, including chemical-resistant gloves
                    (e.g., nitrile or neoprene), safety goggles or a face
                    shield, and protective clothing (apron or coveralls).
                  </li>
                  <li>
                    <strong>Material Safety Data Sheets (MSDS/SDS):</strong>{" "}
                    Read and understand the SDS for each chemical before
                    handling. It contains crucial information on hazards, first
                    aid, spill procedures, and storage.
                  </li>
                  <li>
                    <strong>Ventilation:</strong> Work in a well-ventilated
                    area, especially when handling concentrated acids, alkalis,
                    or chemicals that may release fumes.
                  </li>
                  <li>
                    <strong>Mixing Order:</strong> When diluting, **always add
                    chemical to water slowly**, never water to concentrated
                    chemical (especially acids), to avoid splattering and
                    excessive heat generation.
                  </li>
                  <li>
                    <strong>Storage:</strong> Store chemicals in designated,
                    cool, dry, well-ventilated areas, away from incompatible
                    materials (refer to SDS). Use secondary containment
                    (bunding) for bulk storage.
                  </li>
                  <li>
                    <strong>Spill Response:</strong> Have appropriate spill kits
                    readily available (e.g., neutralizers for acids/bases,
                    absorbent materials). Know the emergency procedures for your
                    facility.
                  </li>
                  <li>
                    <strong>Eyewash & Safety Shower:</strong> Ensure easy access
                    to functional eyewash stations and safety showers in areas
                    where chemicals are handled.
                  </li>
                </ul>
                <p className="mt-4 italic">
                  Disclaimer: This is general guidance. Always follow specific
                  supplier recommendations and your site&apos;s safety procedures.
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
