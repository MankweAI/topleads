"use client";
import Link from "next/link";
// Import Heroicons for a professional icon set
import {
  WrenchScrewdriverIcon,
  FireIcon,
  HomeModernIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  CalculatorIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

// Define the Topleads hubs based on our strategy (Industries)
const hubs = [
  {
    name: "For Plumbers",
    description: "Find leaks in your call handling, map ranking, and reviews.",
    href: "/spokes/plumbers",
    icon: WrenchScrewdriverIcon,
  },
  {
    name: "For HVAC Specialists",
    description: "See how many enquiries and high-value jobs you're missing.",
    href: "/spokes/hvac",
    icon: FireIcon,
  },
  {
    name: "For Roofers",
    description: "Analyze your trust signals and local search visibility.",
    href: "/spokes/roofers",
    icon: HomeModernIcon,
  },
  {
    name: "For Electricians",
    description: "Pinpoint where competitors are capturing your leads.",
    href: "/spokes/electricians",
    icon: BoltIcon,
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
          src="/video/hero-video.mp4" // Placeholder video
          autoPlay
          loop
          muted
          playsInline
          poster="/image/daf_unit.png" // Placeholder poster
        >
          Your browser does not support the video tag.
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/70 to-brand-navy/60"
          aria-hidden="true"
        ></div>
      </div>
      {/* --- END BACKGROUND VIDEO & OVERLAY --- */}

      {/* --- PAGE CONTENT (Positioned Relatively) --- */}
      <div className="relative z-10 text-white">
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
              Stop Leaking Money.
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed drop-shadow-sm">
              We help South African trades businesses find the R15,000 -
              R40,000+ you're losing to competitors every month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToHubs}
                className="bg-brand-action-green text-brand-navy-dark font-bold py-3 px-12 md:px-18 rounded-full shadow-lg border border-white/20 hover:shadow-xl hover:brightness-105 transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-brand-action-green/60"
              >
                Find Your Leaks
              </button>
            </div>
          </div>
        </section>

        {/* Content Below Hero */}
        <div className="container mx-auto px-4 py-16">
          {/* Intro Section - Removed card styles, kept padding/margin */}
          <section className="text-center max-w-4xl mx-auto mb-20 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 drop-shadow-sm">
              From "No-BS" Promise to Actionable Report
            </h2>
            <p className="text-white/80 mb-12 drop-shadow-sm">
              Our process is transparent. We show you exactly where the leaks
              are, then provide the tools to fix them.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-brand-info mb-4" />
                <h3 className="font-bold text-lg">1. Select Your Trade</h3>
                <p className="text-sm text-white/70">
                  Choose your industry for a specialized diagnostic.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <CalculatorIcon className="h-12 w-12 text-brand-info mb-4" />
                <h3 className="font-bold text-lg">2. Run the "Leak" Audit</h3>
                <p className="text-sm text-white/70">
                  Enter your business info into our "No-BS" tool.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <DocumentTextIcon className="h-12 w-12 text-brand-info mb-4" />
                <h3 className="font-bold text-lg">3. Get Your Report</h3>
                <p className="text-sm text-white/70">
                  Receive an instant, data-rich report.
                </p>
              </div>
            </div>
          </section>

          {/* Hubs Section */}
          <div id="hubs" className="space-y-12">
            {hubs.map((hub) => (
              <section
                key={hub.name}
                className="p-6 md:p-8 rounded-2xl"
                aria-labelledby={`${hub.name}-heading`}
              >
                {/* Hub Header */}
                <header className="mb-6">
                  <h2
                    id={`${hub.name}-heading`}
                    className="text-2xl font-semibold tracking-tight flex items-center gap-2 drop-shadow-sm"
                  >
                    <span className="inline-block w-2 h-6 bg-brand-info rounded-full"></span>
                    {hub.name}
                  </h2>
                  {hub.description && (
                    <p className="text-white/80 mt-2 text-base leading-relaxed drop-shadow-sm">
                      {hub.description}
                    </p>
                  )}
                </header>

                {/* Spokes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Link
                    href={hub.href}
                    className="group flex items-center gap-4 p-5 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 focus-visible:ring-2 focus-visible:ring-brand-info transition-all duration-300 hover:bg-black/40 hover:border-white/20"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-info/10 text-brand-info group-hover:bg-brand-info/20 transition-colors duration-300 shrink-0">
                      {hub.icon && (
                        <hub.icon className="w-5 h-5" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="font-medium text-white/90">
                        {hub.name} Diagnostic
                      </span>
                      <span
                        className="opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300 text-brand-info"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </div>
              </section>
            ))}
          </div>

          {/* Outro Section */}
          <section className="mt-20 text-center p-12 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 drop-shadow-sm">
              Your "No-BS" Partner
            </h2>
            <p className="text-white/80 max-w-3xl mx-auto drop-shadow-sm">
              Topleads is an independent consultancy. Our reports include links
              to the exact tools and services to fix your leaks, whether you use
              us or do it yourself.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
