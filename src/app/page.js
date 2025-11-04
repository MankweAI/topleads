"use client";
import Link from "next/link";
import {
  WrenchScrewdriverIcon,
  FireIcon,
  HomeModernIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  CalculatorIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Header from "@/components/Header";

// Topleads Color & Theme Reference (from tailwind.config.js):
// brand-navy:       #0A2540
// brand-navy-dark:  #061A2E
// brand-light-gray: #F6F9FC
// brand-off-white:  #FFFFFF
// brand-action-green: #19D479
// brand-warning:    #F59E0B
// brand-info:       #3B82F6
// brand-steel-dark: #4A5568
// accent:           #E67E22
const hubs = [
  {
    name: "For Plumbers",
    description: "Find leaks in your call handling, map ranking, and reviews.",
    href: "/spokes/plumbers",
    icon: WrenchScrewdriverIcon,
    iconBg: "linear-gradient(135deg, #d1ff3b 0%, #3B82F6 94%)", // vibrant yellow-green + blue
  },
  {
    name: "For HVAC Specialists",
    description:
      "See how many enquiries and high-value install jobs you're missing.",
    href: "/spokes/hvac",
    icon: FireIcon,
    iconBg: "linear-gradient(135deg, #ffecd1 0%, #F59E0B 94%)", // vivid cream + orange
  },
  {
    name: "For Roofers",
    description: "Analyze your trust signals and local search visibility.",
    href: "/spokes/roofers",
    icon: HomeModernIcon,
    iconBg: "linear-gradient(135deg, #baffd1 0%, #19D479 94%)", // mint green + action green
  },
  {
    name: "For Electricians",
    description: "Pinpoint where competitors are capturing your leads.",
    href: "/spokes/electricians",
    icon: BoltIcon,
    iconBg: "linear-gradient(135deg, #ffd1fa 0%, #6B7C93 94%)", // pink-violet + steel
  },
];


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
  const scrollToHubs = () =>
    document.getElementById("hubs")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-brand-off-white font-sans">
      {/* --- HERO Section: Video with Overlay & Header --- */}
      <section className="relative w-full h-screen min-h-[600px] bg-transparent flex items-center justify-center text-center p-0 overflow-hidden">
        {/* Video BG */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <video
            className="w-full h-full object-cover"
            src="/video/tradesmen.mp4"
            autoPlay
            loop
            muted
            playsInline
            poster="/image/daf_unit.png"
          />
        </div>
        {/* Header inside video */}
        <div className="absolute top-0 left-0 w-full z-10">
          <div className="bg-transparent backdrop-blur-md">
            <Header />
          </div>
        </div>
        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center h-full pt-32 pb-8">
          <h1
            id="hero-heading"
            className="text-5xl md:text-6xl font-extrabold text-white mb-7 leading-tight tracking-tight drop-shadow-sm"
          >
            Stop Leaking Money.
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 leading-relaxed">
            We help South African trades businesses find the R15,000 - R40,000+
            you're losing to competitors every month.
          </p>
          <button
            onClick={scrollToHubs}
            className="font-bold py-3 px-12 rounded-full shadow-md border border-brand-action-green text-brand-navy-dark bg-brand-light-gray hover:bg-brand-action-green hover:text-white transition-all duration-200"
          >
            Find Your Leaks
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 px-6 text-center bg-brand-light-gray">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-navy-dark mb-10 tracking-tight">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center bg-white rounded-xl shadow-md py-8 px-4 hover:shadow-lg transition group">
            <div
              className="flex items-center justify-center h-16 w-16 mb-6 rounded-full shadow-inner"
              style={{ background: "#A0AEC0", opacity: 0.13 }}
            >
              <MagnifyingGlassIcon
                className="h-10 w-10"
                style={{ color: "#1E2329" }}
              />
            </div>
            <h3 className="font-bold text-xl text-brand-navy-dark mb-2 group-hover:text-brand-info transition-colors">
              1. Select Your Trade
            </h3>
            <p className="text-base text-brand-steel-dark">
              Choose your industry for a specialized diagnostic.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow-md py-8 px-4 hover:shadow-lg transition group">
            <div
              className="flex items-center justify-center h-16 w-16 mb-6 rounded-full shadow-inner"
              style={{ background: "#F6F9FC", opacity: 0.14 }}
            >
              <CalculatorIcon
                className="h-10 w-10"
                style={{ color: "#1E2329" }}
              />
            </div>
            <h3 className="font-bold text-xl text-brand-navy-dark mb-2 group-hover:text-brand-action-green transition-colors">
              2. Run the "Leak" Audit
            </h3>
            <p className="text-base text-brand-steel-dark">
              Enter your business info into our "No-BS" tool.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow-md py-8 px-4 hover:shadow-lg transition group">
            <div
              className="flex items-center justify-center h-16 w-16 mb-6 rounded-full shadow-inner"
              style={{ background: "#F59E0B", opacity: 0.09 }}
            >
              <DocumentTextIcon
                className="h-10 w-10"
                style={{ color: "#1E2329" }}
              />
            </div>
            <h3 className="font-bold text-xl text-brand-navy-dark mb-2 group-hover:text-brand-warning transition-colors">
              3. Get Your Report
            </h3>
            <p className="text-base text-brand-steel-dark">
              Receive an instant, data-rich report.
            </p>
          </div>
        </div>
      </section>

      {/* Hubs Section */}
      <section id="hubs" className="w-full py-16 px-6 bg-brand-light-gray">
        <header className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-navy-dark mb-2 tracking-tight">
            Start Your Free Audit
          </h2>
          <p className="text-lg text-brand-steel-dark">
            Select your trade to run a specialized diagnostic.
          </p>
        </header>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {hubs.map((hub) => (
            <Link
              href={hub.href}
              key={hub.name}
              className="group block p-8 bg-white rounded-2xl shadow hover:shadow-lg border border-brand-light-gray hover:border-brand-info transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-lg"
                  style={{ background: hub.iconBg }}
                >
                  <hub.icon
                    className="w-6 h-6"
                    aria-hidden="true"
                    style={{ color: "#fff" }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-navy-dark mb-1 group-hover:text-brand-info transition-colors">
                    {hub.name}
                  </h3>
                  <p className="text-base text-brand-steel-dark">
                    {hub.description}
                  </p>
                </div>
              </div>
              <span className="inline-block mt-6 text-base font-semibold text-brand-info opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Start Audit →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promise Section */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-navy-dark mb-10 tracking-tight">
          Our "No-BS" Promise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promises.map((promise, i) => (
            <div
              key={promise.title}
              className="flex flex-col items-center bg-brand-light-gray rounded-xl p-7 shadow-md hover:shadow-lg transition"
            >
              <div
                className="flex items-center justify-center w-14 h-14 rounded-full mb-5"
                style={{
                  background: ["#19D479", "#3B82F6", "#F59E0B"][i % 3],
                  opacity: 0.72,
                }}
              >
                <promise.icon className="h-8 w-8" style={{ color: "#fff" }} />
              </div>
              <h3 className="font-bold text-lg text-brand-navy-dark mb-2">
                {promise.title}
              </h3>
              <p className="text-base text-brand-steel-dark">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
