import { chapters } from "@/data/chapters";

// Linear reading order used to determine page-turn direction.
// Index in this array = "page number" in the book.
export const pageOrder: string[] = [
  "/",
  "/chapters",
  ...chapters.map((c) => `/chapter/${c.id}`),
  "/closing",
];

export const getPageIndex = (pathname: string): number => {
  const idx = pageOrder.indexOf(pathname);
  if (idx !== -1) return idx;
  // Fallback: try matching chapter route pattern
  const m = pathname.match(/^\/chapter\/(\d+)$/);
  if (m) {
    const guess = pageOrder.indexOf(`/chapter/${m[1]}`);
    if (guess !== -1) return guess;
  }
  return -1;
};

// Pages where we DO NOT animate page-turn (cover and first page after cover).
export const skipTurnPaths = new Set<string>(["/", "/chapters"]);

export const shouldSkipTurn = (from: string, to: string): boolean => {
  return skipTurnPaths.has(from) || skipTurnPaths.has(to);
};

// Navigate forward/backward helpers based on linear order.
export const getNeighbor = (
  pathname: string,
  dir: 1 | -1,
): string | null => {
  const idx = getPageIndex(pathname);
  if (idx === -1) return null;
  const next = idx + dir;
  if (next < 0 || next >= pageOrder.length) return null;
  return pageOrder[next];
};
