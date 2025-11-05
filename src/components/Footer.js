// New component
export default function Footer() {
  return (
    <footer className="py-8 bg-[#0f172a] text-center text-[#64748b] text-sm relative z-10 border-t border-[#64748b]/20">
      <div className="container mx-auto px-6">
        <p>
          &copy; {new Date().getFullYear()} LeakageFinder. All rights reserved.
        </p>
        <p className="mt-2 text-[#94a3b8]">
          Fixing Money Leaks for{" "}
          <span className="text-[#a3e635]">Trades Professionals</span> in South
          Africa
        </p>
      </div>
    </footer>
  );
}
