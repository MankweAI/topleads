"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  WrenchScrewdriverIcon,
  FireIcon,
  HomeModernIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { formatCurrency } from "@/lib/formatters";

// NEW: Imported the Doughnut Chart for the preview
import InteractiveDoughnut from "@/components/DoughnutChart";

/**
 * Custom Hook: useInView
 * Triggers a boolean when an element enters the viewport.
 */
const useInView = (options) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // We only want it to trigger once
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      // Clean up the observer
      if (ref.current && observer) {
        observer.disconnect();
      }
    };
  }, [options]);

  return [ref, isInView];
};

/**
 * Component: AnimatedCounter
 * Counts up from 0 to a target value when it becomes visible.
 */
const AnimatedCounter = ({
  targetValue,
  prefix = "",
  suffix = "",
  duration = 1500,
}) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);

        // Ease-out quad function for a smoother animation
        const easedProgress = 1 - Math.pow(1 - percentage, 3);

        setCount(Math.floor(easedProgress * targetValue));

        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          setCount(targetValue); // Ensure it ends on the exact value
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, targetValue, duration]);

  return (
    <span
      ref={ref}
      className="text-6xl md:text-7xl font-extrabold text-[#84cc16]"
    >
      {prefix}
      {count.toLocaleString("en-ZA")}
      {suffix}
    </span>
  );
};

/**
 * Component: AnimatedSection
 * A wrapper component that applies the fade-in-up animation when visible.
 */
const AnimatedSection = ({ children, className = "" }) => {
  const [ref, isInView] = useInView({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  return (
    <div
      ref={ref}
      className={`w-full transition-opacity duration-1000 ${className} ${
        isInView ? "animate-fade-in-up" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default function Home() {
  // Helper function to scroll to the top hero section
  const scrollToHero = () => {
    document
      .getElementById("hero-funnel")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // NEW: Mock data for the report preview snippet
  const totalLeakedRevenue = 21500;
  const chartData = {
    total: totalLeakedRevenue + totalLeakedRevenue * 0.4, // 21500 + 8600
    leaked: totalLeakedRevenue,
    captured: totalLeakedRevenue * 0.4, // 8600
  };

  return (
    // Base colors: light gray background, dark text
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-[#0f172a] overflow-x-hidden">
      {/* --- SECTION 1: The "Hero-Funnel" --- */}
      <section
        id="hero-funnel"
        // Dark slate background for the hero
        className="relative w-full h-screen min-h-[700px] bg-black flex items-center justify-center text-center p-6 overflow-hidden"
      >
        {/* Video BG */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            className="w-full h-full object-cover opacity-30"
            src="/video/tradesmen.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#0f172a]/0 z-10"></div>
        </div>

        {/* Header inside video - Simple Logo (White) */}
        <div className="absolute top-0 left-0 w-full z-20 p-6">
          <a
            href="#"
            className="text-2xl font-extrabold text-[#ffffff] tracking-wider"
          >
            LeakageFinder
          </a>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
          <h1
            id="hero-heading"
            className="text-5xl md:text-7xl font-extrabold text-[#ffffff] mb-6 leading-tight tracking-tight animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            If you are seeing this, your business is leaking money.
          </h1>
          {/* Lighter steel text for sub-headline */}
          <p
            className="text-xl md:text-2xl text-[#94a3b8] mb-12 max-w-2xl animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            Your plumbing, electrical, HVAC or roofing business is losing jobs
            to competitors. We&apos;ll show you exactly where.
          </p>

          {/* The "Tool" CTA */}
          <div
            className="w-full max-w-3xl animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <h2 className="text-2xl font-semibold text-[#ffffff] mb-4">
              What is your trade?
              <br />
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Vibrant Indigo buttons with stagger animation */}
              <Link
                href="/spokes/plumbers"
                className="group flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#6366f1] text-[#ffffff] font-bold py-4 px-5 rounded-lg text-lg transition-all transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: "400ms" }}
              >
                <WrenchScrewdriverIcon className="h-6 w-6" />
                <span>Plumber</span>
              </Link>
              <Link
                href="/spokes/hvac"
                className="group flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#6366f1] text-[#ffffff] font-bold py-4 px-5 rounded-lg text-lg transition-all transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: "500ms" }}
              >
                <FireIcon className="h-6 w-6" />
                <span>HVAC</span>
              </Link>
              <Link
                href="/spokes/roofers"
                className="group flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#6366f1] text-[#ffffff] font-bold py-4 px-5 rounded-lg text-lg transition-all transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: "600ms" }}
              >
                <HomeModernIcon className="h-6 w-6" />
                <span>Roofer</span>
              </Link>
              <Link
                href="/spokes/electricians"
                className="group flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#6366f1] text-[#ffffff] font-bold py-4 px-5 rounded-lg text-lg transition-all transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: "700ms" }}
              >
                <BoltIcon className="h-6 w-6" />
                <span>Electrician</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: "What Are These 'Money Leaks'?" --- */}
      {/* White background for contrast */}
      <AnimatedSection className="py-20 px-6 text-center bg-[#ffffff]">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4 tracking-tight">
          We Find the 3 &quot;Money Leaks&quot;
        </h2>
        {/* Medium steel text */}
        <p className="text-xl text-[#64748b] mb-16 max-w-3xl mx-auto">
          Your competitors are exploiting these gaps. Our audit checks them
          instantly.
        </p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Traffic Leak (UPDATED) */}
          <div className="flex flex-col items-center text-center p-8 bg-[#ffffff] border border-[#f1f5f9] rounded-xl shadow-lg card-lift">
            {/* Vibrant Orange for "Leak" icons */}
            <MagnifyingGlassIcon className="h-12 w-12 text-[#f97316] mb-4" />
            <h3 className="font-bold text-2xl text-[#0f172a] mb-3">
              1. The Traffic Leak (SEO)
            </h3>
            <p className="text-base text-[#64748b] leading-relaxed">
              If you&apos;re not on the first page of Google or in the &quot;Map Pack&quot;,
              customers can&apos;t find you. You&apos;re losing clicks, calls, and jobs to
              the competitors who are.
            </p>
          </div>

          {/* Card 2: Trust Leak */}
          <div className="flex flex-col items-center text-center p-8 bg-[#ffffff] border border-[#f1f5f9] rounded-xl shadow-lg card-lift">
            {/* Vibrant Orange for "Leak" icons */}
            <StarIcon className="h-12 w-12 text-[#f97316] mb-4" />
            <h3 className="font-bold text-2xl text-[#0f172a] mb-3">
              2. The Trust Leak
            </h3>
            <p className="text-base text-[#64748b] leading-relaxed">
              Customers choose competitors with higher review scores. A 4.8-star
              business will get the call over your 3.5-star rating every single
              time.
            </p>
          </div>

          {/* Card 3: Enquiry Leak */}
          <div className="flex flex-col items-center text-center p-8 bg-[#ffffff] border border-[#f1f5f9] rounded-xl shadow-lg card-lift">
            {/* Vibrant Orange for "Leak" icons */}
            <ChatBubbleBottomCenterTextIcon className="h-12 w-12 text-[#f97316] mb-4" />
            <h3 className="font-bold text-2xl text-[#0f172a] mb-3">
              3. The Enquiry Leak
            </h3>
            <p className="text-base text-[#64748b] leading-relaxed">
              60% of customers browse after 5 PM. If your site can&apos;t capture
              their details 24/7 with a chatbot, they leave and call someone
              else.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* --- SECTION 3: "Data-Driven" Animated Stats --- */}
      <AnimatedSection className="py-20 px-6 text-center bg-[#f1f5f9]">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-16 tracking-tight">
          Data-Driven. No Guesswork.
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center">
            {/* Lime green for stats */}
            <AnimatedCounter targetValue={15000} prefix="R" suffix="+" />
            <p className="text-xl font-semibold text-[#64748b] mt-2">
              Avg. Leaked Revenue /mo
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* Lime green for stats */}
            <AnimatedCounter targetValue={90} suffix="%" />
            <p className="text-xl font-semibold text-[#64748b] mt-2">
              Customers Who Click the &quot;Map Pack&quot;
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* Lime green for stats */}
            <AnimatedCounter targetValue={30} suffix="s" />
            <p className="text-xl font-semibold text-[#64748b] mt-2">
              Time To Get Your Report
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* --- SECTION 4: "How Your 30-Second Audit Works" --- */}
      <AnimatedSection className="py-20 px-6 text-center bg-[#ffffff]">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-16 tracking-tight">
          Your 30-Second Audit
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center">
            {/* Vibrant Lime Action Color */}
            <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-[#84cc16] text-[#0f172a] shadow-lg">
              <span className="text-3xl font-bold">1</span>
            </div>
            <h3 className="font-bold text-xl text-[#0f172a] mb-2">
              Select Your Trade
            </h3>
            <p className="text-base text-[#64748b]">
              (You can do this at the top!) This customizes the audit for your
              industry.
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* Vibrant Lime Action Color */}
            <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-[#84cc16] text-[#0f172a] shadow-lg">
              <span className="text-3xl font-bold">2</span>
            </div>
            <h3 className="font-bold text-xl text-[#0f172a] mb-2">
              Enter Your Details
            </h3>
            <p className="text-base text-[#64748b]">
              Enter your business name, website, and main suburb. No password
              needed.
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* Vibrant Lime Action Color */}
            <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-[#84cc16] text-[#0f172a] shadow-lg">
              <span className="text-3xl font-bold">3</span>
            </div>
            <h3 className="font-bold text-xl text-[#0f172a] mb-2">
              Get Your Instant Report
            </h3>
            <p className="text-base text-[#64748b]">
              See your &apos;Money Leaks&apos; immediately. No waiting for a salesperson
              to call you.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* --- SECTION 5: "The 'No-BS' Report Preview" (UPDATED) --- */}
      <AnimatedSection className="py-20 px-6 text-center bg-[#f1f5f9]">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4 tracking-tight">
          Get Your Instant &apos;Money Leak&apos; Report
        </h2>
        <p className="text-xl text-[#64748b] mb-16 max-w-3xl mx-auto">
          We don&apos;t give you fluff. We give you data you can act on.
        </p>

        {/* --- THIS IS THE MODIFIED BLOCK --- */}
        <div className="max-w-4xl mx-auto bg-[#ffffff] rounded-2xl shadow-2xl overflow-hidden border border-[#e2e8f0]">
          {/* Mock Report Header */}
          <div className="p-4 bg-[#ffffff] border-b border-[#e2e8f0]">
            <h3 className="text-lg font-semibold text-left text-[#0f172a]">
              Report for:{" "}
              <span className="font-mono text-[#4f46e5]">Jono&apos;s Plumbing</span>
            </h3>
          </div>

          {/* This is the user's requested code block, with mock data */}
          <div
            className="bg-[#ffffff] p-10 rounded-xl text-center animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
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
              onClick={scrollToHero}
              className="font-bold py-4 px-12 rounded-lg shadow-lg text-[#0f172a] bg-[#84cc16] hover:bg-[#a3e635] transition-all duration-200 text-xl transform hover:scale-105"
            >
              Start My Free Audit →
            </button>
          </div>
          {/* --- END OF MODIFIED BLOCK --- */}
        </div>
      </AnimatedSection>

      {/* --- SECTION 6: "Our 'No-BS' Promise" --- */}
      <AnimatedSection className="max-w-6xl mx-auto py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-16 tracking-tight">
          Our &quot;No-BS&quot; Promise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-[#ffffff] rounded-xl p-8 shadow-lg border border-[#f1f5f9] card-lift">
            {/* Vibrant Lime Action Color */}
            <CheckBadgeIcon className="h-12 w-12 text-[#84cc16] mb-4" />
            <h3 className="font-bold text-xl text-[#0f172a] mb-2">
              No Fluff, Just Data
            </h3>
            <p className="text-base text-[#64748b]">
              Our reports show you actionable numbers, not vague marketing
              jargon.
            </p>
          </div>

          <div className="flex flex-col items-center bg-[#ffffff] rounded-xl p-8 shadow-lg border border-[#f1f5f9] card-lift">
            {/* Vibrant Lime Action Color */}
            <CheckBadgeIcon className="h-12 w-12 text-[#84cc16] mb-4" />
            <h3 className="font-bold text-xl text-[#0f172a] mb-2">
              No 1-Hour Sales Calls
            </h3>
            <p className="text-base text-[#64748b]">
              Our diagnostic is instant. Our strategy call is 15 minutes, tops.
            </p>
          </div>

          <div className="flex flex-col items-center bg-[#ffffff] rounded-xl p-8 shadow-lg border border-[#f1f5f9] card-lift">
            {/* Vibrant Lime Action Color */}
            <CheckBadgeIcon className="h-12 w-12 text-[#84cc16] mb-4" />
            <h3 className="font-bold text-xl text-[#0f172a] mb-2">
              No Hard Sell
            </h3>
            <p className="text-base text-[#64748b]">
              We show you the leaks. You decide if you want our help to fix
              them.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* --- SECTION 7: Final CTA --- */}
      {/* Dark background for final CTA */}
      <section className="w-full py-20 px-6 text-center bg-[#0f172a]">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#ffffff] mb-4 tracking-tight">
          Find Your Leaks.
        </h2>
        {/* Light steel text */}
        <p className="text-xl text-[#94a3b8] mb-10">
          It&apos;s free, instant, and takes 30 seconds.
        </p>
        <button
          onClick={scrollToHero}
          // Vibrant Lime Action Button
          className="font-bold py-4 px-12 rounded-lg shadow-lg text-[#0f172a] bg-[#84cc16] hover:bg-[#a3e635] transition-all duration-200 text-xl transform hover:scale-105"
        >
          Start My Free Audit →
        </button>
      </section>
    </div>
  );
}
