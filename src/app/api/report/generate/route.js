// New file to create a report
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// This is a SIMULATION. We are not "hallucinating processes" like live scraping.
// We are creating a realistic-looking but simulated report based on user input.
function simulateLeakData(industry, businessName, suburb, biggestProblem) {
  // Simulate a score between 2.5 and 4.5
  const reviewScore = (Math.random() * 2 + 2.5).toFixed(1);
  // Simulate a map rank between 6 and 15
  const meoRank = Math.floor(Math.random() * 10 + 6);
  // Simulate a 70% chance of *not* having a good title tag
  const hasTitleTag = Math.random() > 0.7;
  // Simulate 10-30 missed calls
  const missedCalls = Math.floor(Math.random() * 20 + 10);
  // Simulate monthly missed revenue
  const missedRevenue =
    (missedCalls * (1500 + Math.random() * 1000) +
      (15 - meoRank) * (500 + Math.random() * 500) +
      (4.5 - reviewScore) * (1000 + Math.random() * 1000)) *
    0.3; // Just a formula

  return {
    reviewScore: parseFloat(reviewScore),
    competitorScore: 4.8, // Static competitor score
    meoRank,
    competitorMeoRank: 1,
    hasTitleTag,
    missedCalls,
    missedRevenue: Math.max(15000, Math.round(missedRevenue / 100) * 100), // Ensure min R15k
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      industry,
      businessName,
      websiteUrl,
      suburb,
      biggestProblem,
      conceptFocus,
    } = body;

    if (!industry || !businessName || !websiteUrl || !suburb) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const simulation = simulateLeakData(
      industry,
      businessName,
      suburb,
      biggestProblem
    );

    const reportData = {
      industry, // 'plumbers', 'hvac', etc.
      business_name: businessName,
      website_url: websiteUrl,
      suburb,
      biggest_problem: biggestProblem,
      concept_focus: conceptFocus || industry,
      // Store all inputs in a flexible JSON object
      input_params: {
        industry,
        businessName,
        websiteUrl,
        suburb,
        biggestProblem,
      },
      // Store simulated results
      simulated_review_score: simulation.reviewScore,
      simulated_competitor_score: simulation.competitorScore,
      simulated_meo_rank: simulation.meoRank,
      simulated_competitor_meo_rank: simulation.competitorMeoRank,
      simulated_has_title: simulation.hasTitleTag,
      simulated_missed_calls: simulation.missedCalls,
      simulated_missed_revenue: simulation.missedRevenue,
      // Store all results in a flexible JSON object
      calculated_data: simulation,
    };

    const { data, error } = await supabase
      .from("reports")
      .insert(reportData)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error inserting report:", error.message);
      throw new Error(`Supabase error: ${error.message}`);
    }

    return NextResponse.json(
      {
        reportId: data.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error in /api/report/generate:", error);
    return NextResponse.json(
      {
        error: `Failed to generate report: ${
          error.message || "Internal server error"
        }`,
      },
      { status: 500 }
    );
  }
}
