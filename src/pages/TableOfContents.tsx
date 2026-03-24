import BookLayout from "@/components/book/BookLayout";
import ChapterCard from "@/components/book/ChapterCard";
import { chapters } from "@/data/chapters";

const TableOfContents = () => {
  return (
    <BookLayout>
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="mb-12 md:mb-16 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Table of Contents
          </span>
          <h1
            className="text-3xl md:text-5xl font-bold text-foreground text-balance"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Six chapters on the human future
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {chapters.map((chapter, i) => (
            <ChapterCard key={chapter.id} chapter={chapter} index={i} />
          ))}
        </div>
      </section>
    </BookLayout>
  );
};

export default TableOfContents;
