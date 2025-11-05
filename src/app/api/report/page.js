"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import {
  MapIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

function ReportContent() {
  const searchParams = useSearchParams();
  const siteUrl = searchParams.get("site") || "your-website.com";
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle="Book Your Expert Call"
        modalSubtext="An expert will personally review these findings and call you within 24 hours with a complete, no-obligation breakdown of your money leaks."
        websiteUrl={siteUrl} // Pass the URL to the modal
      />
      <div className="bg-brand-light-gray min-h-screen">
        <div className="container mx-auto max-w-4xl py-12 px-4">
          {/* 1. Personalized Header */}
          <div className="text-center mb-10">
            <p className="text-lg font-semibold text-brand-action-green">
              Scan Complete
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy-dark mt-2">
              Report for:{" "}
              <span className="text-brand-info underline decoration-brand-info/50">
                {siteUrl}
              </span>
            </h1>
            <p className="text-xl text-brand-steel mt-4">
              We&apos;ve analyzed your site and found 4 immediate growth
              opportunities.
            </p>
          </div>

          {/* 2. The "Dashboard" Style Opportunities */}
          <div className="space-y-6">
            {/* Opportunity 1 */}
            <div className="p-6 border-t-4 border-brand-info rounded-lg shadow-lg bg-brand-off-white">
              <div className="flex items-center mb-2">
                <MapIcon className="w-8 h-8 text-brand-info mr-3" />
                <h2 className="text-2xl font-bold text-brand-navy-dark">
                  Growth Opportunity: Local Maps (MEO)
                </h2>
              </div>
              <p className="text-lg text-brand-steel">
                You&apos;re not appearing in the Google &apos;3-Pack.&apos; 76% of all
                local searches hire from the map.
                <strong>
                  {" "}
                  This is the single biggest opportunity to get more customers.
                </strong>
              </p>
            </div>
            {/* Opportunity 2 */}
            <div className="p-6 border-t-4 border-brand-info rounded-lg shadow-lg bg-brand-off-white">
              <div className="flex items-center mb-2">
                <StarIcon className="w-8 h-8 text-brand-info mr-3" />
                <h2 className="text-2xl font-bold text-brand-navy-dark">
                  Growth Opportunity: Customer Trust
                </h2>
              </div>
              <p className="text-lg text-brand-steel">
                We found no &quot;Click-to-Get-Reviews&quot; system. More 5-star reviews
                is the fastest way to
                <strong> build trust and win new clients.</strong>
              </p>
            </div>
            {/* Opportunity 3 */}
            <div className="p-6 border-t-4 border-brand-info rounded-lg shadow-lg bg-brand-off-white">
              <div className="flex items-center mb-2">
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-brand-info mr-3" />
                <h2 className="text-2xl font-bold text-brand-navy-dark">
                  Growth Opportunity: 24/7 Leads
                </h2>
              </div>
              <p className="text-lg text-brand-steel">
                No instant chatbot was found. 60% of customers browse
                after-hours.
                <strong> You can stop leaking all overnight leads.</strong>
              </p>
            </div>
            {/* Opportunity 4 */}
            <div className="p-6 border-t-4 border-brand-info rounded-lg shadow-lg bg-brand-off-white">
              <div className="flex items-center mb-2">
                <RocketLaunchIcon className="w-8 h-8 text-brand-info mr-3" />
                <h2 className="text-2xl font-bold text-brand-navy-dark">
                  Growth Opportunity: Site Speed (SEO)
                </h2>
              </div>
              <p className="text-lg text-brand-steel">
                Your site is slow or not mobile-friendly. 53% of visitors leave
                if a site takes 3+ seconds to load.
                <strong> We can cut that load time in half.</strong>
              </p>
            </div>
          </div>

          {/* 3. Final CTA (The "Solution") */}
          <div className="mt-12 text-center bg-brand-navy-dark text-white p-10 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Stop the Leaks. Start the Growth.
            </h2>
            <p className="text-lg text-brand-steel-light mb-8 max-w-2xl mx-auto">
              These opportunities are costing you money. Book a 100% free,
              no-obligation call with an expert to get a complete breakdown.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-action-green text-brand-navy-dark font-bold text-xl py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:brightness-105 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-brand-action-green/60"
            >
              Book Your 24-Hour Expert Call
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// We wrap the component in <Suspense> because useSearchParams()
// requires it. This is best practice.
export default function ReportPageWrapper() {
  return (
    <Suspense fallback={<div>Loading report...</div>}>
      <ReportContent />
    </Suspense>
  );
}
