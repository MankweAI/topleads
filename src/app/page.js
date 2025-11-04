"use client";
import Link from "next/link";
// Import necessary icons
import {
  CalculatorIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  ScaleIcon,
  ChartBarIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  DocumentChartBarIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  FireIcon,
  AdjustmentsHorizontalIcon,
  CogIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

// Define hubs data with icons assigned
const hubs = [
  // ... (keep the hubs array definition as it was, including icons)
  {
    name: "FOG (Fats, Oils, and Grease) Wastewater Treatment",
    description:
      "Solutions for treating wastewater with high concentrations of fats, oils, and grease.",
    spokes: [
      {
        href: "/spokes/how-to-treat-high-fat-wastewater",
        title: "How to Treat High-Fat Wastewater",
        icon: FireIcon,
      },
      {
        href: "/spokes/removing-emulsified-oils-from-industrial-wastewater",
        title: "Removing Emulsified Oils",
        icon: BeakerIcon,
      },
      {
        href: "/spokes/guide-to-dissolved-air-flotation-for-fog-removal",
        title: "Guide to DAF for FOG Removal",
        icon: DocumentTextIcon,
      },
      {
        href: "/spokes/chemical-treatment-options-for-breaking-oil-emulsions",
        title: "Chemical Treatment for Emulsions",
        icon: AdjustmentsHorizontalIcon,
      },
      {
        href: "/spokes/daf-vs-oil-water-separators-for-fog",
        title: "DAF vs. Oil-Water Separators",
        icon: ScaleIcon,
      },
    ],
  },
  {
    name: "Suspended Solids (TSS) Removal",
    description:
      "Strategies and technologies for removing both high-density and low-density suspended solids.",
    spokes: [
      {
        href: "/spokes/treating-high-density-vs-low-density-suspended-solids",
        title: "High-Density vs. Low-Density Solids",
        icon: AdjustmentsHorizontalIcon,
      },
      {
        href: "/spokes/how-to-size-a-clarifier-for-mining-wastewater",
        title: "Sizing a Clarifier for Mining",
        icon: CalculatorIcon,
      },
      {
        href: "/spokes/using-a-daf-system-for-low-density-solids-removal",
        title: "DAF for Low-Density Solids",
        icon: CpuChipIcon,
      },
      {
        href: "/spokes/lamella-clarifiers-vs-conventional-clarifiers",
        title: "Lamella vs. Conventional Clarifiers",
        icon: ScaleIcon,
      },
      {
        href: "/spokes/troubleshooting-high-total-suspended-solids-in-effluent",
        title: "Troubleshooting High TSS",
        icon: WrenchScrewdriverIcon,
      },
    ],
  },
  {
    name: "DAF (Dissolved Air Flotation) System Design",
    description:
      "A deep dive into DAF technology, from initial sizing and cost analysis to operational optimization.",
    spokes: [
      {
        href: "/spokes/daf-sizing-calculator-and-key-design-parameters",
        title: "DAF Sizing Calculator",
        icon: CalculatorIcon,
      },
      {
        href: "/spokes/how-does-a-dissolved-air-flotation-system-work",
        title: "How Does a DAF System Work?",
        icon: CogIcon,
      },
      {
        href: "/spokes/daf-system-costs-capex-and-opex-breakdown",
        title: "DAF System Costs",
        icon: ChartBarIcon,
      },
      {
        href: "/spokes/daf-vs-clarifier-which-is-right-for-your-application",
        title: "DAF vs. Clarifier",
        icon: ScaleIcon,
      },
      {
        href: "/spokes/how-to-optimize-chemical-dosage-for-daf-systems",
        title: "Optimize DAF Chemical Dosage",
        icon: AdjustmentsHorizontalIcon,
      },
    ],
  },
  {
    name: "Clarifier & Thickener Technology",
    description:
      "Explore gravity-based separation technologies for heavy industry and mining applications.",
    spokes: [
      {
        href: "/spokes/clarifier-surface-overflow-rate-sor-calculator",
        title: "Clarifier SOR Calculator",
        icon: CalculatorIcon,
      },
      {
        href: "/spokes/thickener-design-for-mining-and-heavy-metals-industry",
        title: "Thickener Design for Mining",
        icon: CircleStackIcon,
      },
      {
        href: "/spokes/guide-to-flocculants-and-coagulants-for-sedimentation",
        title: "Guide to Flocculants & Coagulants",
        icon: BeakerIcon,
      },
      {
        href: "/spokes/common-operational-problems-with-wastewater-clarifiers",
        title: "Common Clarifier Problems",
        icon: ExclamationTriangleIcon,
      },
      {
        href: "/spokes/the-pros-and-cons-of-lamella-clarifier-designs",
        title: "Pros & Cons of Lamella Clarifiers",
        icon: DocumentChartBarIcon,
      },
    ],
  },
  {
    name: "Industrial Wastewater Treatment Case Studies",
    description:
      "Industry-specific applications and regulatory considerations for wastewater treatment in South Africa.",
    spokes: [
      {
        href: "/spokes/guide-to-wastewater-treatment-in-the-meat-processing-industry",
        title: "Meat Processing Guide",
        icon: BuildingOffice2Icon,
      },
      {
        href: "/spokes/dairy-processing-wastewater-challenges-and-solutions",
        title: "Dairy Processing Guide",
        icon: BuildingOffice2Icon,
      },
      {
        href: "/spokes/key-considerations-for-food-and-beverage-wastewater-treatment",
        title: "Food & Beverage Guide",
        icon: ClipboardDocumentListIcon,
      },
      {
        href: "/spokes/water-management-and-treatment-in-mining-and-beneficiation",
        title: "Water Management in Mining",
        icon: GlobeAltIcon,
      },
      {
        href: "/spokes/south-african-effluent-discharge-regulations-for-industrial-sites",
        title: "SA Effluent Regulations",
        icon: ArchiveBoxIcon,
      },
    ],
  },
];

export default function Home() {
  const scrollToHubs = () => {
    document.getElementById("hubs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen">
      {/* --- BACKGROUND VIDEO & OVERLAY (Fixed Position) --- */}
      <div className="fixed inset-0 z-[-1]">
        <video
          className="w-full h-full object-cover"
          src="/video/wastewater.mp1"
          autoPlay
          loop
          muted
          playsInline
          poster="/image/daf_unit.png"
        >
          Your browser does not support the video tag.
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" // Keep overlay for text contrast
          aria-hidden="true"
        ></div>
      </div>
      {/* --- END BACKGROUND VIDEO & OVERLAY --- */}
      {/* --- PAGE CONTENT (Positioned Relatively) --- */}
      <div className="relative z-10 text-white">
        {" "}
        {/* Set default text color here */}
        {/* Hero Section */}
        <section
          aria-labelledby="hero-heading"
          className="w-full h-[65svh] min-h-[500px] max-h-[850px] flex flex-col items-center justify-center text-center p-6 md:p-12"
        >
          <div className="max-w-4xl">
            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight drop-shadow-md"
            >
              Engineer Your Wastewater Solution.
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed drop-shadow-sm">
              Access instant sizing calculators, budgetary costings, and
              technical data for industrial effluent treatment in South Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToHubs}
                className="bg-brand-action-green text-brand-navy-dark font-bold py-3 px-12 md:px-18 rounded-full shadow-lg border border-white/20 hover:shadow-xl hover:brightness-105 transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-brand-action-green/60" // Updated padding
              >
                Get Started
              </button>
            </div>
          </div>
        </section>
        {/* Content Below Hero */}
        <div className="container mx-auto px-4 py-16">
          {/* Intro Section - Removed card styles, kept padding/margin */}
          <section className="text-center max-w-4xl mx-auto mb-20 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 drop-shadow-sm">
              {" "}
              {/* text-white is inherited */}
              From Problem to Pre-Feasibility in Minutes
            </h2>
            <p className="text-white/80 mb-12 drop-shadow-sm">
              {" "}
              {/* Adjusted opacity */}
              Effluentic streamlines the initial design phase by replacing
              guesswork with data-driven calculations. Our hub-and-spoke model
              guides you to the exact tool you need.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {" "}
              {/* text-white is inherited */}
              <div className="flex flex-col items-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-brand-info mb-4" />
                <h3 className="font-bold text-lg">1. Select Your Challenge</h3>
                <p className="text-sm text-white/70">
                  {" "}
                  {/* Adjusted opacity */}
                  Choose a topic from our content hubs.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <CalculatorIcon className="h-12 w-12 text-brand-info mb-4" />
                <h3 className="font-bold text-lg">2. Input Your Parameters</h3>
                <p className="text-sm text-white/70">
                  {" "}
                  {/* Adjusted opacity */}
                  Use our specialized calculators.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <DocumentTextIcon className="h-12 w-12 text-brand-info mb-4" />
                <h3 className="font-bold text-lg">3. Generate Your Report</h3>
                <p className="text-sm text-white/70">
                  {" "}
                  {/* Adjusted opacity */}
                  Get instant, actionable data.
                </p>
              </div>
            </div>
          </section>

          {/* Hubs Section - Removed card styles */}
          <div id="hubs" className="space-y-12">
            {hubs.map((hub) => (
              <section
                key={hub.name}
                // Removed bg, backdrop, shadow, border. Kept padding.
                className="p-6 md:p-8 rounded-2xl"
                aria-labelledby={`${hub.name}-heading`}
              >
                {/* Hub Header */}
                <header className="mb-6">
                  <h2
                    id={`${hub.name}-heading`}
                    // text-white inherited
                    className="text-2xl font-semibold tracking-tight flex items-center gap-2 drop-shadow-sm"
                  >
                    {/* Kept the accent line */}
                    <span className="inline-block w-2 h-6 bg-brand-info rounded-full"></span>
                    {hub.name}
                  </h2>
                  {hub.description && (
                    <p className="text-white/80 mt-2 text-base leading-relaxed drop-shadow-sm">
                      {" "}
                      {/* Adjusted opacity */}
                      {hub.description}
                    </p>
                  )}
                </header>

                {/* Spokes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {hub.spokes.map((spoke) => (
                    <Link
                      href={spoke.href}
                      key={spoke.href}
                      // Removed bg, border. Added subtle hover effect on text.
                      className="group flex items-center gap-4 p-5 rounded-xl focus-visible:ring-2 focus-visible:ring-brand-info transition-opacity duration-300 hover:opacity-80"
                    >
                      {/* Icon Circle - Kept background for icon visibility */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-info/10 text-brand-info group-hover:bg-brand-info/20 transition-colors duration-300 shrink-0">
                        {spoke.icon && (
                          <spoke.icon className="w-5 h-5" aria-hidden="true" />
                        )}
                        {!spoke.icon && (
                          <DocumentTextIcon
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      {/* Title + Arrow */}
                      <div className="flex-1 flex justify-between items-center">
                        <span className="font-medium text-white/90">
                          {" "}
                          {/* Adjusted opacity */}
                          {spoke.title}
                        </span>
                        <span
                          className="opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300 text-brand-info"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Outro Section - Removed card styles */}
          <section className="mt-20 text-center p-12 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 drop-shadow-sm">
              {" "}
              {/* text-white inherited */}
              Your Independent, First-Pass Sizing Tool
            </h2>
            <p className="text-white/80 max-w-3xl mx-auto drop-shadow-sm">
              {" "}
              {/* Adjusted opacity */}
              Effluentic is an unbiased platform designed to empower engineers.
              Every report includes a directory of local South African equipment
              suppliers, giving you clear, actionable next steps without
              favoring any single provider.
            </p>
          </section>
        </div>{" "}
        {/* End Container */}
      </div>{" "}
      {/* End Relative Content Wrapper */}
    </div> // End Main Wrapper
  );
}
