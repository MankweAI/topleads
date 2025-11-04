import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();
    // Added concept_focus to capture
    const { name, company, email, report_id, cta_type, concept_focus } = body;

    if (!email || !report_id || !cta_type) {
      return NextResponse.json(
        { error: "Missing required fields: email, report_id, cta_type" },
        { status: 400 }
      );
    }

    // concept_focus is good context but not strictly required for lead capture itself
    const leadData = {
      name,
      company,
      email,
      report_id,
      cta_type,
      concept_focus,
    };

    const { data, error } = await supabase
      .from("leads")
      .insert(leadData)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error inserting lead:", error.message);
      throw new Error(`Supabase error: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        leadId: data.id,
        message: "Lead captured successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error in /api/lead/capture:", error);
    return NextResponse.json(
      {
        error: `Failed to capture lead: ${
          error.message || "Internal server error"
        }`,
      },
      { status: 500 }
    );
  }
}
