"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  calculateClarifierSizing,
  estimateChemicalDosage, // For flocculant estimation
  estimateSludgeProduction, // For clarifier sludge estimation
  getBenchmarkParams,
} from "@/lib/calculationEngine";
import CalculatorInput from "@/components/CalculatorInput";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import CollapsibleSection from "@/components/CollapsibleSection";
import Header from "@/components/Header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// --- Configuration ---
const pageConfig = {
  // SEO Optimized Title
  title: "Clarifier SOR Calculator: Interactive Sizing Workbench",
  description:
    "Instantly calculate the required surface area for a gravity clarifier using the Surface Overflow Rate (SOR) method. Adjust parameters, see live results, and request an engineering review.",
  calculatorConfig: {
    title: "Clarifier Sizing Workbench (SOR Method)",
    description: "Enter your process flow rate. Results update automatically.",
    hiddenFields: {
      conceptFocus: "clarifier_sizing", // Focus on clarifier sizing
      contaminant_type: "High-Density", // SOR method primarily for settleable solids
    },
    fields: [
      {
        name: "industry",
        label: "Primary Industry",
        type: "select",
        // Options relevant to High-Density / Clarifier applications
        options: [
          { value: "mining_beneficiation", label: "Mining & Beneficiation" },
          { value: "heavy_industry_metals", label: "Heavy Industry / Metals" },
          { value: "aggregate_sand_washing", label: "Aggregate / Sand Washing" },
          { value: "municipal_primary", label: "Municipal Primary" }, // Added Municipal
          { value: "general_industrial", label: "General Industrial" },
        ],
        defaultValue: "mining_beneficiation",
        tooltip: "Select the industry to adjust the typical SOR benchmark.",
      },
      {
        name: "flow_rate_m3_hr",
        label: "Process Flow Rate",
        unit: "m³/hr",
        min: 10,
        max: 10000, // Wider range for clarifiers
        step: 10,
        defaultValue: 250,
        tooltip: "The volumetric flow rate determines area via SOR.",
      },
      // TSS is not directly needed for SOR calc, but useful context for sludge/chem
       {
        name: "tss_mg_l",
        label: "Influent TSS (Optional)",
        unit: "mg/L",
        min: 100,
        max: 20000,
        step: 100,
        defaultValue: 6000, // Default higher for typical clarifier apps
        tooltip: "Influent Total Suspended Solids concentration (used for sludge/chemical estimates).",
        optional: true,
      },
    ],
    // Fields for Advanced Mode (SOR Override)
    advancedFields: [
      {
        name: "override_sor",
        label: "Override SOR",
        unit: "m³/m²/day",
        type: "number",
        min: 5,
        max: 60, // Typical range
        step: 1,
        defaultValue: null, // Default to null, calculation engine will use benchmark
        tooltip: "Override the default Surface Overflow Rate benchmark based on settling tests or specific design criteria.",
      },
    ],
  },
  hubLink: {
    href: "/",
    title: "Main Hub",
  },
  relatedSpokes: [
    {
      href: "/spokes/how-to-size-a-clarifier-for-mining-wastewater",
      title: "How to Size a Clarifier for Mining Wastewater",
    },
    {
      href: "/spokes/common-operational-problems-with-wastewater-clarifiers",
      title: "Common Problems with Clarifiers",
    },
    {
      href: "/spokes/thickener-design-for-mining-and-heavy-metals-industry",
      title: "Thickener Design for the Mining Industry",
    },
     {
      href: "/spokes/guide-to-flocculants-and-coagulants-for-sedimentation", // Chem relevant
      title: "Guide to Flocculants & Coagulants",
    },
  ],
   // Added Clarifier/Thickener Supplier List
  suppliers: [
     { name: "Veolia Water Technologies", url: "https://www.veolia.co.za/", type: "Clarifiers & DAF" },
     { name: "A2V", url: "https://www.a2v.co.za/", type: "Clarifiers & DAF" },
     { name: "PCI Africa", url: "https://pciafrica.com/", type: "Clarifiers & DAF" },
     { name: "Xylem", url: "https://www.xylem.com/en-za/", type: "Clarifiers & DAF" },
     { name: "Cube Consolidating", url: "https://cubeconsolidating.com/", type: "Clarifiers & Thickeners" },
     { name: "FLSmidth (EIMCO/Dorr-Oliver)", url: "https://www.flsmidth.com/", type: "Clarifiers & Thickeners" },
     // Add other relevant suppliers
  ]
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
export default function ClarifierSORSpoke() {
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
  const [results, setResults] = useState(null);
  const [operationalEstimates, setOperationalEstimates] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [benchmarkParams, setBenchmarkParams] = useState({});
  const [headerHeight, setHeaderHeight] = useState(60);

  // Effect to calculate header height
  useEffect(() => {
     const timer = setTimeout(() => {
        const headerElement = document.querySelector('header');
        if (headerElement) {
            setHeaderHeight(headerElement.offsetHeight);
        }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const {
      flow_rate_m3_hr,
      tss_mg_l, // Optional, used for sludge/chem
      industry,
      override_sor,
    } = formData;

    // Get benchmark SOR for display
    setBenchmarkParams(getBenchmarkParams(industry, "clarifier"));

    // Calculate core Clarifier sizing using SOR
    const clarifierResults = calculateClarifierSizing(
      flow_rate_m3_hr,
      industry,
      override_sor ?? undefined // Pass override if provided
    );

    // Calculate operational estimates (if TSS is provided)
    const chemEstimates = tss_mg_l ? estimateChemicalDosage(
      flow_rate_m3_hr,
      tss_mg_l,
      industry,
      "clarifier" // Specify clarifier context (likely flocculant)
    ) : { daily_kg: 0 }; // Default if no TSS

    const sludgeEstimates = tss_mg_l ? estimateSludgeProduction(
      flow_rate_m3_hr,
      tss_mg_l,
      industry,
      "clarifier" // Specify clarifier context
    ) : { daily_dry_solids_kg: 0 }; // Default if no TSS

    // Calculate Cost per kL
    const annualVolumeM3 = flow_rate_m3_hr * 24 * 365;
    const costPerKl =
      annualVolumeM3 > 0 && clarifierResults.opex_annual_zar > 0
        ? clarifierResults.opex_annual_zar / (annualVolumeM3 / 1000)
        : 0;

    setResults({
      clarifierSpecs: clarifierResults,
      reportContext: {
        id: `live-${Date.now()}`,
        ...formData, // include all form data including override
        calculatedArea: clarifierResults.surface_area_m2,
        calculatedCapexMin: clarifierResults.capex_min_zar,
        calculatedCapexMax: clarifierResults.capex_max_zar,
        calculatedOpex: clarifierResults.opex_annual_zar,
      },
    });

    setOperationalEstimates({
      costPerKl,
      dailySludgeKg: sludgeEstimates.daily_dry_solids_kg,
      dailyChemKg: chemEstimates.daily_kg, // Flocculant estimate
    });
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const allFields = [
      ...pageConfig.calculatorConfig.fields,
      ...pageConfig.calculatorConfig.advancedFields,
    ];
    const fieldConfig = allFields.find((f) => f.name === name);

    let processedValue = value;
    if (type === "number" || type === "range") {
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
    advancedFields,
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
            {/* Section 2: Calculator and Results Side-by-Side */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
              {/* Calculator Card */}
              <div
                className="bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 rounded-xl shadow-xl border border-gray-200 sticky" // Adjusted gradient and border
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
                      Advanced Mode (Override SOR Benchmark)
                    </Label>
                  </div>
                </form>

                {/* Advanced Fields */}
                {isAdvancedMode && (
                  <div className="mt-6 space-y-6 pl-4 border-l-2 border-gray-300 ml-2">
                    <p className="text-sm text-brand-steel-dark italic">
                      Current Benchmark SOR (Industry:{" "}
                      {formData.industry.replace(/_/g, " ")}): ≈{" "}
                      {formatNumber(benchmarkParams?.sor, 1)} m³/m²/day
                    </p>
                    <div className="grid grid-cols-1">
                      {" "}
                      {/* Single column for SOR override */}
                      {advancedFields.map((field) => (
                        <CalculatorInput
                          key={field.name}
                          field={field}
                          value={formData[field.name] ?? ""}
                          onChange={handleInputChange}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Design Summary Card */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200">
                <h2 className="text-xl md:text-2xl font-bold text-brand-navy-dark mb-6 text-center">
                  Live Clarifier Design Summary
                </h2>
                {results ? (
                  <div className="space-y-6">
                    {/* Key Sizing & Cost Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-6 text-center border-b pb-6 mb-6 border-gray-100">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wider font-semibold text-blue-800">
                          Required Area (SOR)
                        </p>
                        <p className="text-3xl font-extrabold text-blue-600 mt-1">
                          {formatNumber(results.clarifierSpecs.surface_area_m2)}{" "}
                          m²
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                          Budget CAPEX
                        </p>
                        <p className="text-lg font-bold text-brand-navy mt-1">
                          {formatCurrency(results.clarifierSpecs.capex_min_zar)}
                          <span className="text-brand-steel"> – </span>
                          {formatCurrency(results.clarifierSpecs.capex_max_zar)}
                        </p>
                        <p className="text-xs text-gray-400">(Class 4 ±40%)</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wider font-semibold text-green-800">
                          Est. Annual OPEX
                        </p>
                        <p className="text-3xl font-extrabold text-green-600 mt-1">
                          {formatCurrency(
                            results.clarifierSpecs.opex_annual_zar
                          )}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wider font-semibold text-green-800">
                          Est. Cost per kL
                        </p>
                        <p className="text-3xl font-extrabold text-green-600 mt-1">
                          {formatCurrency(operationalEstimates.costPerKl)}
                        </p>
                      </div>
                    </div>

                    {/* Operational Estimates */}
                    <h3 className="text-lg font-semibold text-brand-navy-dark text-center mb-4">
                      Operational Estimates (Requires TSS Input)
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-center">
                      <div
                        className={`p-4 rounded-lg ${
                          formData.tss_mg_l > 0
                            ? "bg-gray-50"
                            : "bg-gray-100 opacity-60"
                        }`}
                      >
                        <p
                          className={`text-xs uppercase tracking-wider font-semibold ${
                            formData.tss_mg_l > 0
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          Est. Daily Sludge (Dry)
                        </p>
                        <p
                          className={`text-xl font-bold mt-1 ${
                            formData.tss_mg_l > 0
                              ? "text-brand-navy"
                              : "text-gray-500"
                          }`}
                        >
                          {formData.tss_mg_l > 0
                            ? `${formatNumber(
                                operationalEstimates.dailySludgeKg
                              )} kg/day`
                            : "N/A*"}
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-lg ${
                          formData.tss_mg_l > 0
                            ? "bg-gray-50"
                            : "bg-gray-100 opacity-60"
                        }`}
                      >
                        <p
                          className={`text-xs uppercase tracking-wider font-semibold ${
                            formData.tss_mg_l > 0
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          Est. Daily Flocculant
                        </p>
                        <p
                          className={`text-xl font-bold mt-1 ${
                            formData.tss_mg_l > 0
                              ? "text-brand-navy"
                              : "text-gray-500"
                          }`}
                        >
                          {formData.tss_mg_l > 0
                            ? `${formatNumber(
                                operationalEstimates.dailyChemKg
                              )} kg/day`
                            : "N/A*"}
                        </p>
                      </div>
                      {formData.tss_mg_l <= 0 && (
                        <p className="col-span-2 text-xs text-gray-500 italic text-center mt-2">
                          *Enter Influent TSS in the calculator to enable these
                          estimates.
                        </p>
                      )}
                    </div>
                    {formData.override_sor && (
                      <p className="text-sm text-blue-700 italic mt-4 text-center">
                        Note: Calculations based on your overridden SOR value.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-brand-steel text-center italic py-10">
                    Adjust parameters in the workbench to see your live design
                    summary.
                  </p>
                )}
              </div>
            </section>

            {/* Section 3: Smart Technical Brief */}
            <section className="mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-4 border-b pb-3">
                Technical Brief & Next Steps
              </h2>
              <div className="space-y-1">
                <CollapsibleSection title="Clarifier Sizing: The SOR Method">
                  <p>
                    Gravity clarifiers separate settleable suspended solids from
                    water based on Stoke&apos;s Law. The **Surface Overflow Rate
                    (SOR)** is the primary parameter for sizing the clarifier&apos;s
                    surface area. It represents the upward velocity of the water
                    leaving the clarifier over the weirs.
                  </p>
                  <p>
                    **Concept:** For a particle to settle, its settling velocity
                    must be greater than the upward velocity (SOR) of the water.
                    Therefore, the clarifier area must be large enough to ensure
                    the SOR is lower than the settling velocity of the smallest
                    particle you aim to capture.
                  </p>
                  <p>
                    **Calculation:**
                    <br />
                    <code>
                      Required Area (m²) = Flow Rate (m³/day) / SOR (m³/m²/day)
                    </code>
                    <br />
                    <em>
                      (Note: Flow rate is converted from m³/hr to m³/day for the
                      calculation)
                    </em>
                  </p>
                  <p>
                    Typical SOR values vary significantly by application and
                    particle characteristics. Higher SORs mean smaller
                    footprints but risk poorer effluent quality if particles
                    settle too slowly. Lower SORs provide more conservative
                    designs.
                  </p>
                </CollapsibleSection>

                <CollapsibleSection title="Industry Benchmarks & SOR Selection">
                  <p>
                    The appropriate SOR depends heavily on the industry and the
                    nature of the suspended solids. Settling tests (e.g.,
                    cylinder tests) are the best way to determine site-specific
                    settling velocities and thus the design SOR. However,
                    typical benchmark ranges exist:
                  </p>
                  <ul>
                    <li>
                      <strong>Mining & Aggregates:</strong> Often handle dense,
                      inorganic solids. SORs can range from 10-45 m³/m²/day (or
                      a rise rate of 0.4 - 1.9 m/hr). Lower values are used for
                      finer particles or when high clarity is needed for water
                      reuse. Thickeners often prioritize underflow density over
                      overflow clarity and may use solids flux loading instead
                      of SOR.
                    </li>
                    <li>
                      <strong>Municipal Primary Clarification:</strong>{" "}
                      Typically 20-50 m³/m²/day.
                    </li>
                    <li>
                      <strong>Industrial (General Settleable Solids):</strong>{" "}
                      Highly variable, 15-40 m³/m²/day is a common starting
                      range, but depends entirely on particle settling
                      characteristics.
                    </li>
                  </ul>
                  <p className="mt-2 text-sm italic">
                    Benchmark Used for {formData.industry.replace(/_/g, " ")}: ≈{" "}
                    {formatNumber(benchmarkParams?.sor, 1)} m³/m²/day.
                    {isAdvancedMode
                      ? " You are currently overriding this value."
                      : " Use 'Advanced Mode' to override if you have specific settling data."}
                  </p>
                </CollapsibleSection>

                <CollapsibleSection title="From Pre-Feasibility to Pilot: Next Steps">
                  <p>
                    This SOR calculator provides a preliminary area estimate.
                    For a robust clarifier design, follow these steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 mt-3">
                    <li>
                      <strong>
                        Influent Characterization & Settling Tests:
                      </strong>{" "}
                      This is the most critical step. Conduct laboratory
                      settling tests (column or cylinder tests) on
                      representative wastewater samples. These tests determine
                      the actual settling velocity of your suspended solids
                      under different conditions (e.g., with and without
                      flocculant addition). This data directly informs the
                      design SOR. Also analyze TSS, particle size distribution,
                      and density.
                    </li>
                    <li>
                      <strong>Chemical Optimization (Jar Tests):</strong> If
                      chemical addition (coagulation/flocculation) is needed to
                      enhance settling (common for finer particles), perform jar
                      tests to select the best chemicals (often anionic polymers
                      for bridging in sedimentation) and optimal dosages.
                      Evaluate floc settling speed and clarity.
                    </li>
                    <li>
                      <strong>Detailed Design Considerations:</strong> Beyond
                      surface area, consider:
                      <ul className="list-disc list-inside ml-4">
                        <li>
                          **Detention Time:** Ensures sufficient time for
                          settling (typically 2-4 hours). Calculated as `Tank
                          Volume / Flow Rate`.
                        </li>
                        <li>
                          **Tank Depth:** Affects volume and sludge storage
                          capacity (typically 3-5m).
                        </li>
                        <li>
                          **Inlet Design:** Crucial for distributing flow evenly
                          and minimizing turbulence (e.g., center feed well).
                        </li>
                        <li>
                          **Outlet Weir Design:** Weir loading rate (flow per
                          meter of weir) affects effluent quality (typically
                          &lt; 180 m³/day/m).
                        </li>

                        <li>
                          **Sludge Removal Mechanism:** Rake type, torque
                          requirements (especially for heavy mining solids), and
                          underflow pumping system.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Pilot Testing (If Warranted):</strong> For very
                      large-scale projects or uncertain settling behaviour, a
                      pilot-scale clarifier test can provide valuable
                      operational data.
                    </li>
                    <li>
                      <strong>Obtain Formal Quotations & Refine Budget:</strong>{" "}
                      Use detailed specs for firm quotes. Clarifier costs vary
                      widely based on diameter, materials (steel vs. concrete),
                      drive mechanism, and site conditions.
                    </li>
                    <li>
                      <strong>
                        Validate Your Project with an Expert Review:
                      </strong>{" "}
                      Discuss your settling test data and preliminary design
                      with consultants or experienced suppliers. Use the button
                      below to request this review.
                    </li>
                  </ol>
                  <div className="mt-4 text-center">
                    <button
                      onClick={scrollToCTA}
                      className="text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      Ready for an expert review? Click here.
                    </button>
                  </div>
                </CollapsibleSection>
              </div>
            </section>

            {/* Section 4: Call to Action */}
            <section
              id="cta-section"
              className="mt-12 bg-gradient-to-r from-gray-700 to-gray-900 p-10 rounded-xl shadow-2xl text-center" // Adjusted color for Clarifier theme
            >
              <h2 className="text-3xl font-bold text-white mb-3">
                Validate Your Clarifier Design with an Expert
              </h2>
              <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
                Get a free, no-obligation review of your preliminary sizing
                (based on SOR) and cost estimates from an experienced process
                engineer. Submit your details for a consultation based on the
                parameters you&apos;ve entered.
              </p>
              {formSubmitted ? (
                <p className="text-green-300 font-bold text-lg p-4 bg-green-900/50 rounded-md inline-block">
                  Thank You! Your request has been sent. An engineer will be in
                  touch shortly via email.
                </p>
              ) : (
                <button
                  onClick={handleOpenModal}
                  className="bg-white text-gray-800 font-bold py-4 px-10 rounded-lg text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg" // Adjusted button colors
                >
                  Request Free Engineer Review
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
                  Clarifier & Thickener Suppliers (South Africa){" "}
                  {/* Updated Title */}
                </h2>
                <p className="text-sm text-brand-steel text-center mb-6">
                  The following is a list of potential equipment suppliers.
                  Effluentic is independent and does not endorse any specific
                  supplier. Obtain formal quotations based on your specific
                  project requirements and settling test results.
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
