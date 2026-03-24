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
      <div className={`absolute inset-0 bg-gradient-to-br ${chapter.gradient}`} />
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute w-[60%] h-[60%] rounded-full blur-3xl"
          style={{
            background: `hsl(${chapter.accentHsl} / 0.4)`,
            top: "20%",
            left: "25%",
          }}
        />
        <div
          className="absolute w-[40%] h-[40%] rounded-full blur-3xl"
          style={{
            background: `hsl(${chapter.accentHsl} / 0.3)`,
            bottom: "10%",
            right: "15%",
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-[8rem] md:text-[12rem] font-bold opacity-[0.07] select-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {String(chapter.id).padStart(2, "0")}
        </span>
      </div>
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
