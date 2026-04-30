import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { getNeighbor, shouldSkipTurn } from "@/lib/pageOrder";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

interface PageTurnProps {
  children: ReactNode;
}

/**
 * Realistic page-turn wrapper.
 *
 * - Wraps the active route. On navigation, rotates the outgoing page around
 *   its left or right edge with perspective + a moving shadow overlay to
 *   mimic a curling paper page.
 * - Direction:
 *     forward (next) — outgoing rotates around its LEFT edge to the left
 *                      (i.e. the right edge lifts and turns leftward).
 *     backward (prev) — outgoing rotates around its RIGHT edge to the right.
 * - Skips animation on: cover ("/") and the first page after cover ("/chapters").
 * - Falls back to a simple fade on low-performance devices or
 *   prefers-reduced-motion.
 * - Supports swipe (mobile) and click-edge / keyboard (desktop) navigation.
 */
const PageTurn = ({ children }: PageTurnProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const perfMode = usePerformanceMode();

  // Track previous pathname to compute direction.
  const prevPathRef = useRef<string>(location.pathname);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [skip, setSkip] = useState<boolean>(true); // first render: no animation

  useEffect(() => {
    const from = prevPathRef.current;
    const to = location.pathname;
    if (from === to) return;

    // Determine direction by linear page order; fallback to forward.
    const dir =
      getNeighbor(from, 1) === to
        ? 1
        : getNeighbor(from, -1) === to
          ? -1
          : 1;
    setDirection(dir);
    setSkip(shouldSkipTurn(from, to));
    prevPathRef.current = to;
  }, [location.pathname]);

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable)
          return;
      }
      if (e.key === "ArrowRight") {
        const next = getNeighbor(location.pathname, 1);
        if (next) navigate(next);
      } else if (e.key === "ArrowLeft") {
        const prev = getNeighbor(location.pathname, -1);
        if (prev) navigate(prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [location.pathname, navigate]);

  // Swipe navigation (mobile).
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * 0.5 + Math.abs(velocity.x) * 0.1;
    if (swipe < 80) return;
    if (offset.x < 0) {
      const next = getNeighbor(location.pathname, 1);
      if (next) navigate(next);
    } else {
      const prev = getNeighbor(location.pathname, -1);
      if (prev) navigate(prev);
    }
  };

  // ----- Fade fallback -----
  if (perfMode === "reduced") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ----- Full 3D page-turn -----
  // Forward: outgoing page rotates around its LEFT edge (origin "left center")
  //   from rotateY(0) -> rotateY(-180). Incoming sits beneath, fading in.
  // Backward: outgoing rotates around its RIGHT edge from 0 -> 180.

  const exitRotate = direction === 1 ? -170 : 170;
  const exitOrigin = direction === 1 ? "left center" : "right center";
  const shadowGradient =
    direction === 1
      ? "linear-gradient(to right, hsl(0 0% 0% / 0.45), transparent 35%)"
      : "linear-gradient(to left, hsl(0 0% 0% / 0.45), transparent 35%)";

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        perspective: "2400px",
        perspectiveOrigin: "center center",
        overflowX: "hidden",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={location.pathname}
          drag={skip ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
          initial={
            skip
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.995 }
          }
          animate={
            skip
              ? { opacity: 1 }
              : { opacity: 1, rotateY: 0, scale: 1 }
          }
          exit={
            skip
              ? { opacity: 0 }
              : {
                  rotateY: exitRotate,
                  transition: {
                    duration: 0.85,
                    ease: [0.65, 0, 0.35, 1], // cubic-bezier - book curl easing
                  },
                }
          }
          transition={
            skip
              ? { duration: 0.2 }
              : { duration: 0.45, ease: "easeOut", delay: 0.15 }
          }
          style={{
            position: "relative",
            transformStyle: "preserve-3d",
            transformOrigin: skip ? "center center" : exitOrigin,
            backfaceVisibility: "hidden",
            willChange: "transform, opacity",
            background: "hsl(var(--background))",
            minHeight: "100vh",
          }}
        >
          {children}
          {/* Curl shadow overlay — only visible while exiting */}
          {!skip && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{
                opacity: 1,
                transition: { duration: 0.85, ease: [0.65, 0, 0.35, 1] },
              }}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: shadowGradient,
                mixBlendMode: "multiply",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTurn;
