import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // Import Footer

// NO FUNCTION CALLS - GeistSans and GeistMono are objects

// Update metadata for Topleads
export const metadata = {
  title: "Topleads - Stop Leaking Money. Start Booking Jobs.",
  description:
    "We help skilled trades (Plumbers, HVAC, Roofers, Electricians) in South Africa fix their 'money leaks' and capture lost revenue.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      {/* Apply the variables directly from the imported objects */}
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-brand-light-gray`}
      >
        <div className="relative min-h-screen">
          {/* Video background moved to hub page, layout is clean */}
          {/* <Header /> */}
          {/* Main content pushed below the fixed header */}
          <main className="relative z-10">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
