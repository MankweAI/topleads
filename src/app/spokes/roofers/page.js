"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  calculateDafSizing,
  estimateChemicalDosage,
  estimateSludgeProduction,
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
  title:
    "DAF Sizing Calculator & Key Design Parameters | Interactive Workbench",
  description:
    "Instantly size a Dissolved Air Flotation (DAF) unit based on HLR and SLR. Adjust parameters like flow rate and TSS, see live results, and request an expert design review.",
  calculatorConfig: {
    title: "DAF Sizing Workbench",
    description:
      "Enter your wastewater parameters. Results update automatically.",
    hiddenFields: {
      conceptFocus: "daf_sizing", // Explicit DAF sizing focus
      contaminant_type: "Low-Density", // Assumed context for DAF focus
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
          // Add other relevant low-density industries if applicable
        ],
        defaultValue: "food_beverage",
        tooltip: "Select the industry to adjust HLR and SLR benchmarks.",
      },
      {
        name: "flow_rate_m3_hr",
        label: "Flow Rate",
        unit: "m³/hr",
        min: 1,
        max: 500,
        step: 1,
        defaultValue: 50,
        tooltip: "The volumetric flow rate (determines area via HLR).",
      },
      {
        name: "tss_mg_l",
        label: "Suspended Solids (TSS/FOG)",
        unit: "mg/L",
        min: 100,
        max: 8000,
        step: 100,
        defaultValue: 1200,
        tooltip:
          "Total Suspended Solids - including FOG (determines area via SLR).",
      },
      // Optional input for savings calculation
      {
        name: "municipal_cost_per_kl",
        label: "Current Municipal Cost (Optional)",
        unit: "ZAR/kL",
        type: "number",
        min: 0,
        step: 0.1,
        defaultValue: 15,
        tooltip:
          "Enter your current cost per 1000L for discharge to estimate savings.",
        optional: true,
      },
    ],
    // Fields for Advanced Mode
    advancedFields: [
      {
        name: "override_hlr",
        label: "Override HLR",
        unit: "m/hr",
        type: "number",
        min: 1,
        max: 20,
        step: 0.1,
        defaultValue: null,
        tooltip: "Override the default Hydraulic Loading Rate benchmark.",
      },
      {
        name: "override_slr",
        label: "Override SLR",
        unit: "kg/m²/hr",
        type: "number",
        min: 1,
        max: 40,
        step: 0.1,
        defaultValue: null,
        tooltip: "Override the default Solids Loading Rate benchmark.",
      },
    ],
  },
  hubLink: {
    href: "/",
    title: "Main Hub",
  },
  relatedSpokes: [
    {
      href: "/spokes/how-does-a-dissolved-air-flotation-system-work",
      title: "How Does a DAF System Work?",
    },
    {
      href: "/spokes/daf-system-costs-capex-and-opex-breakdown",
      title: "DAF System Costs: CAPEX & OPEX",
    },
    {
      href: "/spokes/how-to-treat-high-fat-wastewater", // FOG is a major application
      title: "How to Treat High-FOG Wastewater",
    },
    {
      href: "/spokes/daf-vs-clarifier-which-is-right-for-your-application",
      title: "DAF vs. Clarifier Comparison",
    },
  ],
  // Added DAF Supplier List
  suppliers: [
    {
      name: "Veolia Water Technologies",
      url: "https://www.veolia.co.za/",
      type: "DAF & Clarifiers",
    },
    { name: "A2V", url: "https://www.a2v.co.za/", type: "DAF & Clarifiers" },
    {
      name: "PCI Africa",
      url: "https://pciafrica.com/",
      type: "DAF & Clarifiers",
    },
    {
      name: "Xylem",
      url: "https://www.xylem.com/en-za/",
      type: "DAF & Clarifiers",
    },
    {
      name: "SIGMADAF",
      url: "https://www.sigmadaf.com/",
      type: "DAF Specialist",
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
export default function DafSizingSpoke() {
  // Renamed component function
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
      const headerElement = document.querySelector("header");
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const {
      flow_rate_m3_hr,
      tss_mg_l,
      industry,
      override_hlr,
      override_slr,
      municipal_cost_per_kl,
    } = formData;

    setBenchmarkParams(getBenchmarkParams(industry, "daf"));

    const dafResults = calculateDafSizing(
      flow_rate_m3_hr,
      tss_mg_l,
      industry,
      override_hlr ?? undefined,
      override_slr ?? undefined
    );

    const chemEstimates = estimateChemicalDosage(
      flow_rate_m3_hr,
      tss_mg_l,
      industry,
      "daf"
    );
    const sludgeEstimates = estimateSludgeProduction(
      flow_rate_m3_hr,
      tss_mg_l,
      industry,
      "daf"
    );

    const annualVolumeM3 = flow_rate_m3_hr * 24 * 365;
    const costPerKl =
      annualVolumeM3 > 0 && dafResults.opex_annual_zar > 0
        ? dafResults.opex_annual_zar / (annualVolumeM3 / 1000)
        : 0;
    const currentAnnualCost =
      municipal_cost_per_kl > 0
        ? (annualVolumeM3 / 1000) * municipal_cost_per_kl
        : 0;
    const estimatedSavings =
      currentAnnualCost > 0 && currentAnnualCost > dafResults.opex_annual_zar
        ? currentAnnualCost - dafResults.opex_annual_zar
        : 0;

    setResults({
      dafSpecs: dafResults,
      reportContext: {
        id: `live-${Date.now()}`,
        ...formData,
        calculatedArea: dafResults.surface_area_m2,
        calculatedCapexMin: dafResults.capex_min_zar,
        calculatedCapexMax: dafResults.capex_max_zar,
        calculatedOpex: dafResults.opex_annual_zar,
      },
    });

    setOperationalEstimates({
      costPerKl,
      estimatedSavings,
      dailySludgeKg: sludgeEstimates.daily_dry_solids_kg,
      dailyChemKg: chemEstimates.daily_kg,
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
                className="bg-gradient-to-br from-white to-blue-50 p-6 md:p-8 rounded-xl shadow-xl border border-blue-100 sticky" // Blue theme for DAF sizing
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
                      Advanced Mode (Override Benchmarks)
                    </Label>
                  </div>
                </form>

                {/* Advanced Fields */}
                {isAdvancedMode && (
                  <div className="mt-6 space-y-6 pl-4 border-l-2 border-blue-200 ml-2">
                    <p className="text-sm text-brand-steel-dark italic">
                      Current Benchmarks (Industry:{" "}
                      {formData.industry.replace(/_/g, " ")}): HLR ≈{" "}
                      {formatNumber(benchmarkParams?.hlr, 1)} m/hr, SLR ≈{" "}
                      {formatNumber(benchmarkParams?.slr, 1)} kg/m²/hr
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                  Live Design Summary
                </h2>
                {results ? (
                  <div className="space-y-6">
                    {/* Key Sizing & Cost Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-6 text-center border-b pb-6 mb-6 border-gray-100">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wider font-semibold text-blue-800">
                          Required DAF Area
                        </p>
                        <p className="text-3xl font-extrabold text-blue-600 mt-1">
                          {formatNumber(results.dafSpecs.surface_area_m2)} m²
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                          Budget CAPEX
                        </p>
                        <p className="text-lg font-bold text-brand-navy mt-1">
                          {formatCurrency(results.dafSpecs.capex_min_zar)}
                          <span className="text-brand-steel"> – </span>
                          {formatCurrency(results.dafSpecs.capex_max_zar)}
                        </p>
                        <p className="text-xs text-gray-400">(Class 4 ±40%)</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wider font-semibold text-green-800">
                          Est. Annual OPEX
                        </p>
                        <p className="text-3xl font-extrabold text-green-600 mt-1">
                          {formatCurrency(results.dafSpecs.opex_annual_zar)}
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
                      Operational Estimates
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-center">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                          Est. Daily Sludge (Dry)
                        </p>
                        <p className="text-xl font-bold text-brand-navy mt-1">
                          {formatNumber(operationalEstimates.dailySludgeKg)}{" "}
                          kg/day
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                          Est. Daily Coagulant
                        </p>
                        <p className="text-xl font-bold text-brand-navy mt-1">
                          {formatNumber(operationalEstimates.dailyChemKg)}{" "}
                          kg/day
                        </p>
                      </div>
                      {formData.municipal_cost_per_kl > 0 &&
                        operationalEstimates.estimatedSavings > 0 && (
                          <div className="p-4 bg-yellow-50 rounded-lg col-span-2">
                            <p className="text-xs uppercase tracking-wider font-semibold text-yellow-800">
                              Est. Annual Savings*
                            </p>
                            <p className="text-xl font-bold text-yellow-700 mt-1">
                              {formatCurrency(
                                operationalEstimates.estimatedSavings
                              )}
                            </p>
                            <p className="text-xs text-yellow-600 italic mt-1">
                              *vs. Current Municipal Cost
                            </p>
                          </div>
                        )}
                    </div>
                    {(formData.override_hlr || formData.override_slr) && (
                      <p className="text-sm text-blue-700 italic mt-4 text-center">
                        Note: Calculations based on your overridden HLR/SLR
                        values.
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
                {/* Re-using sections from previous DAF spoke */}
                <CollapsibleSection title="Key DAF Design Principles">
                  <p>
                    Dissolved Air Flotation (DAF) is a highly effective primary
                    treatment technology, particularly for wastewaters
                    containing low-density suspended solids, fats, oils, and
                    grease (FOG). Its operation relies on several key
                    principles:
                  </p>
                  <ul>
                    <li>
                      <strong>Microbubble Generation:</strong> A recycle stream
                      of clarified effluent is pressurized (4-6 bar) and
                      saturated with air. Upon release into the main DAF tank at
                      atmospheric pressure, dissolved air comes out of solution
                      as microscopic bubbles (typically 40-80 µm).
                    </li>
                    <li>
                      <strong>Particle Collision & Attachment:</strong> These
                      tiny bubbles collide with and attach to suspended
                      particles (often pre-conditioned with
                      coagulants/flocculants) in the influent wastewater within
                      a contact zone.
                    </li>
                    <li>
                      <strong>Flotation:</strong> The bubble-particle aggregates
                      have a lower overall density than water, causing them to
                      rise rapidly to the surface, forming a concentrated sludge
                      layer known as &apos;float&apos;.
                    </li>
                    <li>
                      <strong>Sludge Removal:</strong> A mechanical surface
                      skimmer (e.g., chain-and-flight or rotating scoop)
                      continuously removes the float for further treatment or
                      disposal.
                    </li>
                    <li>
                      <strong>Clarified Effluent Withdrawal:</strong> Clean
                      water is typically withdrawn from the bottom of the DAF
                      tank via an adjustable weir or outlet structure.
                    </li>
                  </ul>
                  <p>
                    Effective DAF operation requires careful control of air
                    saturation, recycle rate, chemical dosing (if used), and
                    hydraulic/solids loading rates.
                  </p>
                </CollapsibleSection>

                <CollapsibleSection title="Understanding HLR and SLR (Key Parameters)">
                  <p>
                    DAF unit sizing is primarily determined by the larger of two
                    areas calculated from:
                  </p>
                  <ul>
                    <li>
                      <strong>Hydraulic Loading Rate (HLR):</strong> The total
                      volumetric flow (influent + recycle) per unit of effective
                      flotation area (m³/m²/hr or m/hr). It dictates the
                      physical size needed to handle the water volume and allow
                      sufficient time for bubble-particle contact and rise.
                      Typical HLRs range from 3 to 15 m/hr, depending on the
                      application and solids concentration.{" "}
                      <strong>
                        Benchmark Used: {formatNumber(benchmarkParams?.hlr, 1)}{" "}
                        m/hr
                      </strong>
                      <br />
                      <code>
                        Area_HLR = (Influent Flow * (1 + Recycle Ratio)) / HLR
                      </code>
                    </li>
                    <li>
                      <strong>Solids Loading Rate (SLR):</strong> The mass of
                      solids (TSS & FOG) applied per unit of effective flotation
                      area per hour (kg/m²/hr). This is often the limiting
                      factor for high-concentration streams (e.g., &gt; 1000 mg/L
                      TSS/FOG) and prevents overloading the unit&apos;s capacity to
                      float material effectively. Typical SLRs range from 5 to
                      20 kg/m²/hr, but can be higher for specific, heavy-duty
                      applications.{" "}
                      <strong>
                        Benchmark Used: {formatNumber(benchmarkParams?.slr, 1)}{" "}
                        kg/m²/hr
                      </strong>
                      <br />
                      <code>
                        Area_SLR = (Influent Flow * TSS) / (SLR * 1000)
                      </code>
                    </li>
                  </ul>
                  {/* Updated Benchmark Display logic */}
                  <p
                    className={`mt-2 text-sm italic ${
                      isAdvancedMode ? "block" : "hidden"
                    }`}
                  >
                    You are overriding default benchmarks. Using HLR:{" "}
                    {formData.override_hlr ?? "N/A"} m/hr, SLR:{" "}
                    {formData.override_slr ?? "N/A"} kg/m²/hr.
                  </p>
                  <p
                    className={`mt-2 text-sm italic ${
                      !isAdvancedMode ? "block" : "hidden"
                    }`}
                  >
                    Use &apos;Advanced Mode&apos; in the workbench above to override these
                    benchmarks if you have specific data or design criteria.
                  </p>
                </CollapsibleSection>

                <CollapsibleSection title="From Pre-Feasibility to Pilot: Next Steps">
                  {/* Content is identical to the High-FOG spoke's next steps */}
                  <p>
                    This interactive tool provides a crucial first-pass
                    assessment. To move your DAF project forward, consider these
                    next steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 mt-3">
                    <li>
                      <strong>Comprehensive Influent Characterization:</strong>{" "}
                      Obtain thorough lab analyses of your wastewater across
                      production cycles. Key parameters: Flow rates (avg/peak),
                      TSS, FOG (total/free), COD (total/soluble), BOD, pH,
                      temperature, nutrients.
                    </li>
                    <li>
                      <strong>
                        Bench-Scale Treatability Studies (Jar Tests):
                      </strong>{" "}
                      Essential for chemical optimisation (coagulant/flocculant
                      selection, dosage, pH). This directly impacts performance
                      and OPEX.
                    </li>
                    <li>
                      <strong>Pilot Testing (Highly Recommended):</strong> An
                      on-site pilot DAF trial validates design parameters (HLR,
                      SLR, A/S, chemicals) under real conditions, especially for
                      complex streams.
                    </li>
                    <li>
                      <strong>Detailed Engineering Design & Layout:</strong>{" "}
                      Develop PFDs, P&IDs, specs, and layout considering
                      upstream screening, pH correction, chemical systems,
                      sludge handling (skimming, dewatering, disposal), pumps,
                      automation, and safety.
                    </li>
                    <li>
                      <strong>Obtain Formal Quotations & Refine Budget:</strong>{" "}
                      Use detailed specs for firm quotes from suppliers. Refine
                      CAPEX/OPEX based on supplier data and installation costs.
                    </li>
                    <li>
                      <strong>
                        Validate Your Project with an Expert Review:
                      </strong>{" "}
                      Discuss your study and design with consultants or
                      experienced suppliers before final investment. Use the
                      button below to request this review.
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
              className="mt-12 bg-gradient-to-r from-blue-700 to-blue-900 p-10 rounded-xl shadow-2xl text-center"
            >
              {/* Content unchanged from High-FOG spoke */}
              <h2 className="text-3xl font-bold text-white mb-3">
                Validate Your DAF Design with an Expert
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Get a free, no-obligation review of your preliminary sizing and
                cost estimates from an experienced process engineer. Submit your
                details, and we&apos;ll connect you for a consultation based on the
                parameters you&apos;ve entered.
              </p>
              {formSubmitted ? (
                <p className="text-green-300 font-bold text-lg p-4 bg-green-900/50 rounded-md inline-block">
                  Thank You! Your request has been submitted. An engineer will
                  be in touch shortly via email.
                </p>
              ) : (
                <button
                  onClick={handleOpenModal}
                  className="bg-brand-action-green text-brand-navy-dark font-bold py-4 px-10 rounded-lg text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
                >
                  Request Free Engineer Review
                </button>
              )}
            </section>

            {/* Section 5: Related Topics */}
            {(relatedSpokes?.length > 0 || hubLink) && (
              <section className="mt-16 max-w-4xl mx-auto">
                {/* Structure unchanged */}
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
                {/* Title updated */}
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
                  DAF Equipment Suppliers (South Africa)
                </h2>
                {/* Content unchanged */}
                <p className="text-sm text-brand-steel text-center mb-6">
                  The following is a list of potential DAF equipment suppliers.
                  Effluentic is independent and does not endorse any specific
                  supplier. Obtain formal quotations based on your specific
                  project requirements.
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
                General Plant & Chemical Safety Considerations
              </h2>
              <div className="prose prose-sm sm:prose text-yellow-900 max-w-none">
                <p>
                  Operating wastewater treatment equipment like DAF systems
                  involves potential hazards. Always prioritize safety:
                </p>
                <ul>
                  <li>
                    <strong>Chemical Handling (Recap):</strong> Strictly adhere
                    to PPE requirements (gloves, eye protection) and SDS
                    guidelines when handling coagulants, flocculants, or pH
                    adjustment chemicals. Ensure proper storage, mixing
                    procedures (add chemical to water), and spill response
                    readiness.
                  </li>
                  <li>
                    <strong>Equipment Safety:</strong> Ensure all rotating
                    equipment (pumps, skimmers) has appropriate guards. Follow
                    Lock-Out/Tag-Out (LOTO) procedures during maintenance. Be
                    aware of pressurized air/water lines.
                  </li>
                  <li>
                    <strong>Confined Spaces:</strong> DAF tanks and associated
                    sumps can be confined spaces. Entry requires proper
                    permitting, atmospheric testing (O₂, LEL, H₂S, CO),
                    ventilation, and trained personnel with rescue plans.
                  </li>
                  <li>
                    <strong>Slips, Trips, and Falls:</strong> Keep walkways
                    clear. Be cautious of wet or greasy surfaces, especially
                    around the DAF unit and sludge handling areas. Use
                    appropriate non-slip footwear.
                  </li>
                  <li>
                    <strong>Electrical Safety:</strong> Ensure all electrical
                    panels and equipment are properly grounded, insulated, and
                    protected from water ingress. Only qualified electricians
                    should perform electrical work.
                  </li>
                  <li>
                    <strong>Emergency Preparedness:</strong> Know the locations
                    of emergency stops, eyewash stations, safety showers, and
                    fire extinguishers. Understand the site&apos;s emergency response
                    plan.
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
