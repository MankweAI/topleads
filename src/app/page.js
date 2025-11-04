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
  CheckBadgeIcon, // For the 'No-BS' Promise
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
    description:
      "See how many enquiries and high-value install jobs you're missing.",
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

// 'No-BS' Promise data
const promises = [
  {
    icon: CheckBadgeIcon,
    title: "No Fluff, Just Data",
    description:
      "Our reports show you actionable numbers, not vague marketing jargon.",
  },
  {
    icon: CheckBadgeIcon,
    title: "No 1-Hour Sales Calls",
    description:
      "Our diagnostic is instant. Our strategy call is 15 minutes, tops.",
  },
  {
    icon: CheckBadgeIcon,
    title: "No Hard Sell",
    description:
      "We show you the leaks. You decide if you want our help to fix them.",
  },
];

export default function Home() {
  const scrollToHubs = () => {
    document.getElementById("hubs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen">
      {/* --- SECTION 1: HERO (VIDEO) --- */}
      <section
        aria-labelledby="hero-heading"
        className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center text-center p-6"
      >
        {/* Fixed Background Video & Overlay */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <video
            className="w-full h-full object-cover"
            src="/video/tradesmen.mp4" // Using the correct video path
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

        {/* Hero Content: Removed global text-white, applied directly to elements */}
        <div className="relative z-10 max-w-4xl">
          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight drop-shadow-md text-white"
          >
            Stop Leaking Money.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed drop-shadow-sm">
            We help South African trades businesses find the R15,000 - R40,000+
            you're losing to competitors every month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToHubs}
              className="bg-brand-action-green text-brand-navy-dark font-bold py-3 px-12 md:px-18 rounded-full shadow-lg border border-white/20 hover:shadow-xl hover:brightness-105 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-brand-action-green/60"
            >
              Find Your Leaks
            </button>
          </div>
        </div>
      </section>
      {/* --- END HERO --- */}

      {/* --- SECTION 2: HOW IT WORKS (DARK BREAKOUT) --- */}
      <section className="relative z-10 bg-brand-navy-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-4 drop-shadow-sm">
            From "No-BS" Promise to Actionable Report
          </h2>
          {/* Corrected text color for better contrast on dark bg */}
          <p className="text-white/80 mb-12 drop-shadow-sm">
            Our process is transparent. We show you exactly where the leaks are,
            then provide the tools to fix them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-brand-info mb-4" />
              <h3 className="font-bold text-lg">1. Select Your Trade</h3>
              {/* Corrected text color for better contrast on dark bg */}
              <p className="text-sm text-white/80">
                Choose your industry for a specialized diagnostic.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <CalculatorIcon className="h-12 w-12 text-brand-info mb-4" />
              <h3 className="font-bold text-lg">2. Run the "Leak" Audit</h3>
              {/* Corrected text color for better contrast on dark bg */}
              <p className="text-sm text-white/80">
                Enter your business info into our "No-BS" tool.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <DocumentTextIcon className="h-12 w-12 text-brand-info mb-4" />
              <h3 className="font-bold text-lg">3. Get Your Report</h3>
              {/* Corrected text color for better contrast on dark bg */}
              <p className="text-sm text-white/80">
                Receive an instant, data-rich report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: HUBS (LIGHT SECTION) --- */}
      <section
        id="hubs"
        className="relative z-10 bg-brand-light-gray py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="text-center mb-12">
            {/* These text colors (navy, steel) are correct on light-gray bg */}
            <h2 className="text-3xl font-bold text-brand-navy-dark tracking-tight">
              Start Your Free Audit
            </h2>
            <p className="text-brand-steel-dark mt-2 text-lg leading-relaxed">
              Select your trade to run a specialized diagnostic.
            </p>
          </header>

          {/* Spokes Grid as Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hubs.map((hub) => (
              <Link
                href={hub.href}
                key={hub.name}
                className="group relative block p-8 bg-white rounded-xl shadow-lg border border-gray-200 hover:border-brand-info hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-info/10 text-brand-info shrink-0">
                    <hub.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    {/* These text colors (navy, steel) are correct on white bg */}
                    <h3 className="text-xl font-bold text-brand-navy-dark">
                      {hub.name}
                    </h3>
                    <p className="text-brand-steel-dark mt-1">
                      {hub.description}
                    </p>
                  </div>
                </div>
                <span className="absolute bottom-6 right-6 text-brand-info opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Start Audit →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: 'NO-BS' PROMISE (DARK) --- */}
      <section className="relative z-10 bg-brand-navy-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 drop-shadow-sm">
            Our "No-BS" Promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promises.map((promise) => (
              <div key={promise.title} className="flex flex-col items-center">
                <promise.icon className="h-12 w-12 text-brand-action-green mb-4" />
                <h3 className="font-bold text-lg">{promise.title}</h3>
                {/* Corrected text color for better contrast on dark bg */}
                <p className="text-sm text-white/80">{promise.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
