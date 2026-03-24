import { Link } from "react-router-dom";
import BookLayout from "@/components/book/BookLayout";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";

const ClosingPage = () => {
  return (
    <BookLayout>
      <div className="min-h-screen flex items-center justify-center px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center py-24">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full border border-border">
            <span className="text-2xl">✦</span>
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Thank you for reading
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg">
            This book was created as a digital reading experience exploring the
            human future with AI.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-12 text-sm">
            The ideas here are starting points, not conclusions. The most
            important chapter is the one you write through your own choices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/chapters">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Chapters
              </Button>
            </Link>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </BookLayout>
  );
};

export default ClosingPage;
