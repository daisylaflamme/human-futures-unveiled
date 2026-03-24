import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Download } from "lucide-react";
import { chapters } from "@/data/chapters";
import ProgressBar from "./ProgressBar";

interface BookLayoutProps {
  children: ReactNode;
  showProgress?: boolean;
  currentChapter?: number;
}

const BookLayout = ({ children, showProgress = false, currentChapter }: BookLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen">
      {showProgress && currentChapter && (
        <ProgressBar current={currentChapter} total={chapters.length} />
      )}

      {!isHome && (
        <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-border/50" style={{ background: "hsl(var(--background) / 0.85)" }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 h-14">
            <Link
              to="/"
              className="text-sm font-semibold tracking-wide text-foreground hover:text-primary transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AI & Us
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/chapters" className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
                Chapters
              </Link>
              <button className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <Download className="w-3 h-3" />
                PDF
              </button>
            </div>

            <button
              className="md:hidden text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden border-t border-border/50 px-4 py-4 space-y-1" style={{ background: "hsl(var(--background) / 0.95)" }}>
              <Link
                to="/chapters"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Table of Contents
              </Link>
              {chapters.map((ch) => (
                <Link
                  key={ch.id}
                  to={`/chapter/${ch.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 pl-4 text-sm text-muted-foreground hover:text-foreground"
                >
                  {ch.id}. {ch.title}
                </Link>
              ))}
              <button className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          )}
        </header>
      )}

      <main>{children}</main>
    </div>
  );
};

export default BookLayout;
