// Remove or comment out the Inter import
// import { Inter } from "next/font/google";

// Import Source Sans 3 instead
import { Source_Sans_3 } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";

// Configure Source Sans 3
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans", // Use a descriptive variable name
  display: "swap", // Ensures text is visible while font loads
  // Optionally specify weights if needed, e.g., weights: ['400', '600', '700']
});

export const metadata = {
  title: "Effluentic - Wastewater Treatment Sizing Tool",
  description:
    "Instant pre-feasibility reports for industrial wastewater treatment systems.",
};

// Updated Footer Component (code remains the same)
function Footer() {
  return (
    <footer className="py-8 bg-black/50 backdrop-blur-sm text-center text-gray-300 text-sm relative z-10">
      <div className="container mx-auto px-6">
        <p>
          &copy; {new Date().getFullYear()} Effluentic. All rights reserved.
        </p>
        <p className="mt-2">For Engineering Professionals in South Africa</p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      {/* Apply the new font variable to the body */}
      <body className={`${sourceSans.variable} font-sans`}>
        {" "}
        {/* Use sourceSans.variable */}
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
  