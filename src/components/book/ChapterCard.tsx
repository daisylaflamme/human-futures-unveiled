import { Link } from "react-router-dom";
import { Chapter } from "@/data/chapters";

interface ChapterCardProps {
  chapter: Chapter;
  index: number;
}

const ChapterCard = ({ chapter, index }: ChapterCardProps) => {
  return (
    <Link
      to={`/chapter/${chapter.id}`}
      className="group glass-card p-6 md:p-8 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-4 mb-4">
        <span
          className="text-4xl md:text-5xl font-bold opacity-20 leading-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {String(chapter.id).padStart(2, "0")}
        </span>
      </div>
      <h3
        className="text-xl md:text-2xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {chapter.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {chapter.subtitle}
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
        <span>Read chapter</span>
        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

export default ChapterCard;
