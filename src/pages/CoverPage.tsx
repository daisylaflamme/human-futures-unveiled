import { Link } from "react-router-dom";
import BookLayout from "@/components/book/BookLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight, List } from "lucide-react";

const CoverPage = () => {
  return (
    <BookLayout>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225,30%,5%)] via-[hsl(240,25%,10%)] to-[hsl(260,20%,8%)]" />
          <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-[hsl(220,60%,30%)] opacity-[0.08] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-[hsl(260,50%,35%)] opacity-[0.06] blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-[hsl(35,50%,40%)] opacity-[0.04] blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="mb-8 animate-fade-in">
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              A Digital Illustrated Book
            </span>
            <h1
              className="text-5xl sm:text-7xl md:text-8xl font-bold text-foreground mb-4 text-balance"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AI & Us
            </h1>
            <p
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A Short Visual Book on the Human Future
            </p>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto mb-12">
            Six chapters exploring how artificial intelligence reshapes work,
            creativity, trust, and what it means to be human in a world of
            infinite possibility.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/chapter/1">
              <Button size="lg" className="gap-2 px-8 text-sm tracking-wide">
                Start Reading
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/chapters">
              <Button variant="outline" size="lg" className="gap-2 px-8 text-sm tracking-wide">
                <List className="w-4 h-4" />
                View Chapters
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      </div>
    </BookLayout>
  );
};

export default CoverPage;
