import { useParams, Navigate } from "react-router-dom";
import BookLayout from "@/components/book/BookLayout";
import HeroIllustration from "@/components/book/HeroIllustration";
import ChapterNavigation from "@/components/book/ChapterNavigation";
import { chapters } from "@/data/chapters";

const ChapterPage = () => {
  const { id } = useParams<{ id: string }>();
  const chapterId = Number(id);
  const chapter = chapters.find((c) => c.id === chapterId);

  if (!chapter) return <Navigate to="/chapters" replace />;

  return (
    <BookLayout showProgress currentChapter={chapter.id}>
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Chapter header */}
        <div className="mb-10 md:mb-14 text-center">
          <span
            className="inline-block text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: `hsl(${chapter.accentHsl})` }}
          >
            Chapter {chapter.id}
          </span>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {chapter.title}
          </h1>
          <p
            className="text-base md:text-lg text-muted-foreground italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {chapter.subtitle}
          </p>
        </div>

        {/* Hero illustration */}
        <HeroIllustration chapter={chapter} className="mb-12 md:mb-16" />

        {/* Body text */}
        <div className="prose-book">
          {chapter.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Navigation */}
        <ChapterNavigation currentId={chapter.id} />
      </article>
    </BookLayout>
  );
};

export default ChapterPage;
