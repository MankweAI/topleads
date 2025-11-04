import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // Get the new Topleads fields
    const { name, email, phone, website_url } = body;

    // Validate required fields
    if (!name || !email || !phone || !website_url) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Insert into the 'leads' table
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name,
          email,
          phone,
          website_url,
          source: "Topleads Funnel", // Add a source for tracking
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Could not save lead." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Lead captured successfully", data },
      { status: 200 }
    );
  } catch (err) {
    console.error("API Error:", err.message);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
