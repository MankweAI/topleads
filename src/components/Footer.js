// New component
export default function Footer() {
  return (
    <footer className="py-8 bg-brand-navy-dark text-center text-brand-steel text-sm relative z-10 border-t border-brand-navy-light">
      <div className="container mx-auto px-6">
        <p>&copy; {new Date().getFullYear()} Topleads. All rights reserved.</p>
        <p className="mt-2">
          Fixing Money Leaks for Trades Professionals in South Africa
        </p>
      </div>
    </footer>
  );
}
