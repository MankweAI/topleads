import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
// import Header from "@/components/Header"; // Header is no longer global
import Footer from "@/components/Footer"; // Import Footer

// Update metadata for LeakageFinder
export const metadata = {
  title: "LeakageFinder - Stop Leaking Money. Start Booking Jobs.",
  description:
    "We help skilled trades (Plumbers, HVAC, Roofers, Electricians) in South Africa fix their 'money leaks' and capture lost revenue.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* You should create a new favicon.svg to match the new branding */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      {/* Apply the variables and the new default background color */}
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-tl-bg`}
      >
        <div className="relative min-h-screen">
          {/* Main content */}
          <main className="relative z-10">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
