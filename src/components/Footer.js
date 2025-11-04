// New component
export default function Footer() {
  return (
    <footer className="py-8 bg-tl-dark text-center text-tl-steel text-sm relative z-10 border-t border-tl-steel/20">
      <div className="container mx-auto px-6">
        <p>&copy; {new Date().getFullYear()} Topleads. All rights reserved.</p>
        <p className="mt-2 text-tl-steel-light">
          Fixing Money Leaks for{" "}
          <span className="text-tl-action-hover">Trades Professionals</span> in
          South Africa
        </p>
      </div>
    </footer>
  );
}
