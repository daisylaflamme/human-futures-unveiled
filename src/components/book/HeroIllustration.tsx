import { Chapter } from "@/data/chapters";

interface HeroIllustrationProps {
  chapter: Chapter;
  className?: string;
}

const HeroIllustration = ({ chapter, className = "" }: HeroIllustrationProps) => {
  return (
    <div
      className={`relative w-full aspect-[16/9] rounded-2xl overflow-hidden ${className}`}
    >
      {/* Real chapter image */}
      <img
        src={chapter.image}
        alt={chapter.imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        width={1344}
        height={768}
      />
      {/* Gradient overlay for text integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-br ${chapter.gradient} opacity-30`} />
      {/* Chapter label */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass-card px-5 py-3 inline-block">
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: `hsl(${chapter.accentHsl})` }}>
            Chapter {chapter.id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroIllustration;
