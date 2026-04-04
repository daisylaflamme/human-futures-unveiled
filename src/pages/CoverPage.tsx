import { Link } from "react-router-dom";
import BookLayout from "@/components/book/BookLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight, List } from "lucide-react";
import coverHero from "@/assets/cover-hero.jpg";

const CoverPage = () => {
  return (
    <BookLayout>
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(230,35%,6%)] via-[hsl(235,30%,10%)] to-[hsl(250,25%,8%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full bg-[hsl(220,60%,25%)] opacity-[0.07] blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] rounded-full bg-[hsl(260,50%,30%)] opacity-[0.05] blur-[100px]" />
        </div>

        {/* Mobile & Tablet Portrait: stacked layout */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12 lg:hidden">
          {/* Title */}
          <div className="text-center mb-6">
            <h1
              className="text-5xl sm:text-6xl font-bold text-foreground mb-3 text-balance"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AI & Us
            </h1>
            <p
              className="text-base sm:text-lg text-muted-foreground font-light italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A Short Visual Book on the Human Future
            </p>
            <p
              className="text-sm sm:text-base text-muted-foreground/70 mt-2 tracking-widest uppercase"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.15em" }}
            >
              by Daisy Laflamme
            </p>
          </div>

          {/* Hero image */}
          <div className="relative w-[70vw] max-w-[320px] sm:max-w-[380px] aspect-square rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-primary/10">
            <img
              src={coverHero}
              alt="Split face — half human with warm lighting, half AI with cool blue tones"
              className="w-full h-full object-cover object-center"
              width={1024}
              height={1344}
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
            <Link to="/chapter/1" className="w-full">
              <Button size="lg" className="w-full gap-2 text-sm tracking-wide rounded-xl bg-gradient-to-r from-primary to-[hsl(var(--accent))] hover:opacity-90 transition-opacity">
                Start Reading
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/chapters" className="w-full">
              <Button variant="outline" size="lg" className="w-full gap-2 text-sm tracking-wide rounded-xl border-border/60">
                <List className="w-4 h-4" />
                View Chapters
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop & Tablet Landscape: cinematic two-column */}
        <div className="relative z-10 hidden lg:flex items-center justify-center flex-1 max-w-6xl mx-auto px-8 gap-16">
          {/* Left: text + buttons */}
          <div className="flex-1 max-w-md">
            <h1
              className="text-7xl xl:text-8xl font-bold text-foreground mb-4 text-balance"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AI & Us
            </h1>
            <p
              className="text-xl xl:text-2xl text-muted-foreground font-light italic mb-10"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A Short Visual Book on the Human Future
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/chapter/1">
                <Button size="lg" className="gap-2 px-8 text-sm tracking-wide rounded-xl bg-gradient-to-r from-primary to-[hsl(var(--accent))] hover:opacity-90 transition-opacity">
                  Start Reading
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/chapters">
                <Button variant="outline" size="lg" className="gap-2 px-8 text-sm tracking-wide rounded-xl border-border/60">
                  <List className="w-4 h-4" />
                  View Chapters
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: hero image */}
          <div className="relative w-[380px] xl:w-[440px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-primary/15">
            <img
              src={coverHero}
              alt="Split face — half human with warm lighting, half AI with cool blue tones"
              className="w-full h-full object-cover object-top"
              width={1024}
              height={1344}
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,hsl(230,35%,6%)_100%)] opacity-40" />
          </div>
        </div>

        {/* Scroll hint — mobile only */}
        <div className="relative z-10 pb-6 flex justify-center lg:hidden">
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1 animate-bounce">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      </div>
    </BookLayout>
  );
};

export default CoverPage;
