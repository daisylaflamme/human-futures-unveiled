import { Link } from "react-router-dom";
import { chapters } from "@/data/chapters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, List } from "lucide-react";

interface ChapterNavigationProps {
  currentId: number;
}

const ChapterNavigation = ({ currentId }: ChapterNavigationProps) => {
  const prev = chapters.find((c) => c.id === currentId - 1);
  const next = chapters.find((c) => c.id === currentId + 1);

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 border-t border-border">
      <div className="flex-1 w-full sm:w-auto">
        {prev ? (
          <Link to={`/chapter/${prev.id}`}>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground w-full sm:w-auto justify-start">
              <ChevronLeft className="w-4 h-4" />
              <span className="truncate">{prev.title}</span>
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <Link to="/chapters">
        <Button variant="outline" size="sm" className="gap-2">
          <List className="w-3.5 h-3.5" />
          Contents
        </Button>
      </Link>

      <div className="flex-1 w-full sm:w-auto flex justify-end">
        {next ? (
          <Link to={`/chapter/${next.id}`}>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground w-full sm:w-auto justify-end">
              <span className="truncate">{next.title}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Link to="/closing">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <span>Closing</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default ChapterNavigation;
