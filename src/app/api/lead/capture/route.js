// src/app/api/lead/capture/route.js
import { NextResponse } from "next/server";

// TODO: Install your preferred email provider
// Example using Resend: `npm install resend`
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to format currency
const formatCurrency = (value) => {
  if (typeof value !== "number") return "N/A";
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      company,
      website_url,
      context_data,
      context_total_leak,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // --- Prepare Email Content ---
    const subject = `New Topleads Lead: ${company} (${formatCurrency(
      context_total_leak
    )}/mo Leak)`;

    const emailHtml = `
      <h1>New Topleads Strategy Call Request</h1>
      <p>A new high-value lead just came through the funnel.</p>
      <hr>
      <h2>Contact Details</h2>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Company:</strong> ${company}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Website:</strong> ${website_url}</li>
      </ul>
      <hr>
      <h2>Diagnostic Report</h2>
      <ul>
        <li><strong>Total Leaked Revenue:</strong> <strong style="color: #f97316;">${formatCurrency(
          context_total_leak
        )} / month</strong></li>
        <li><strong>Trust Leak (Reviews):</strong> ${
          context_data.trustLeak_rating
        } ★</li>
        <li><strong>Traffic Leak (Rank):</strong> ${context_data.trafficLeak_rank.replace(
          /_/g,
          " "
        )}</li>
        <li><strong>Enquiry Leak (24/7):</strong> ${context_data.enquiryLeak_method.replace(
          /_/g,
          " "
        )}</li>
      </ul>
    `;

    // --- TODO: Send Email Logic ---
    // This is where you plug in your email provider.
    //
    // Example using Resend (make sure to set RESEND_API_KEY in .env.local):
    /*
    const { data, error } = await resend.emails.send({
      from: 'Topleads Funnel <leads@yourdomain.com>',
      to: ['your-email@yourcompany.com'], // Your sales email
      subject: subject,
      html: emailHtml,
    });

    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json(
        { error: "Could not send lead email." },
        { status: 500 }
      );
    }
    */
    // --- End of TODO section ---

    // For testing, we'll just log the email content to the console
    console.log("--- NEW LEAD CAPTURED (Email Shell) ---");
    console.log("Subject:", subject);
    console.log("Body:", emailHtml);
    console.log("-----------------------------------------");

    // We must return a "data" object, even if it's just a message.
    // The modal `handleSubmit` function expects it.
    return NextResponse.json(
      { message: "Lead captured successfully", data: { success: true } },
      { status: 200 }
    );
  } catch (err) {
    console.error("API Error in /api/lead/capture:", err.message);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
