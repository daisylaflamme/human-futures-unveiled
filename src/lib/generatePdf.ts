import jsPDF from "jspdf";
import { chapters, type Chapter } from "@/data/chapters";
import pdfCover from "@/assets/pdf-cover.png";

// ── 6×9 trim with 0.125" bleed → 6.25×9.25 at 72 DPI ──
const BLEED = 0.125 * 72;        // 9 pt
const TRIM_W = 6 * 72;           // 432 pt
const TRIM_H = 9 * 72;           // 648 pt
const PAGE_W = TRIM_W + BLEED * 2; // 450 pt (full bleed)
const PAGE_H = TRIM_H + BLEED * 2; // 666 pt

// Safe area margins from trim edge (0.375" inner safe)
const SAFE = 0.375 * 72;         // 27 pt from trim
const MARGIN_L = BLEED + SAFE + 16; // ~52 pt from page edge
const MARGIN_R = BLEED + SAFE + 16;
const MARGIN_T = BLEED + SAFE;     // ~36 pt from page edge
const MARGIN_B = BLEED + SAFE;

const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R; // ~346 pt
const FOOTER_Y = PAGE_H - MARGIN_B - 4;
const MAX_Y = FOOTER_Y - 20;

// 8pt grid helper
const G = 8;
const g = (n: number) => n * G;

const BODY_INDENT = 14;
const BODY_TEXT_W = CONTENT_W - BODY_INDENT;
const CHAPTER_TOP = BLEED + 22;
const CHAPTER_FRAME_BOTTOM = FOOTER_Y - 28;
const CHAPTER_FRAME_H = CHAPTER_FRAME_BOTTOM - CHAPTER_TOP;
const CHAPTER_IMAGE_MAX_W = CONTENT_W + 20;
const CHAPTER_LABEL_GAP = g(3.5);
const CHAPTER_TITLE_GAP = g(2.25);
const CHAPTER_SUBTITLE_GAP = g(3);
const CHAPTER_IMAGE_GAP = g(4) + 32;

// Accent — refined purple-blue
const AC_R = 140, AC_G = 130, AC_B = 235;

type ChapterLayoutPreset = {
  titleSize: number;
  titleLeading: number;
  subtitleSize: number;
  subtitleLeading: number;
  bodyFontSize: number;
  bodyLineHeight: number;
  paragraphGap: number;
  imageMaxHeight: number;
};

type ChapterTextLayout = {
  titleLines: string[];
  subtitleLines: string[];
  paragraphLines: string[][];
  bodyHeight: number;
};

// ── Helpers ──

function drawPageBg(doc: jsPDF) {
  // Full bleed dark bg
  doc.setFillColor(12, 14, 20);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Subtle radial-ish glow at top center (faked with gradient rect)
  doc.setFillColor(18, 22, 35);
  doc.rect(BLEED, BLEED, TRIM_W, TRIM_H * 0.4, "F");
}

function drawFooter(doc: jsPDF, pageNum: number) {
  // Thin separator
  doc.setDrawColor(40, 44, 58);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_L, FOOTER_Y - 12, PAGE_W - MARGIN_R, FOOTER_Y - 12);

  // Book title — very subtle
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(90, 88, 110);
  doc.text("AI & Us", MARGIN_L, FOOTER_Y);

  // Page number
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 82, 100);
  doc.text(String(pageNum), PAGE_W - MARGIN_R, FOOTER_Y, { align: "right" });
}

async function loadImageAsDataUrl(src: string): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve({
        dataUrl: canvas.toDataURL("image/jpeg", 0.92),
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
}

// ── Body renderer with pagination + widow/orphan ──

function renderBody(
  doc: jsPDF,
  paragraphs: string[],
  startY: number,
  pageNum: { value: number },
  textW: number,
  indent: number,
): number {
  const LINE_H = g(2.2);   // ~17.6pt for 11.5pt text → 1.53 line-height
  const PARA_GAP = g(1.8); // ~14.4pt
  let y = startY;

  doc.setFontSize(11.5);
  doc.setFont("helvetica", "normal");

  for (const para of paragraphs) {
    const lines: string[] = doc.splitTextToSize(para, textW);

    if (y + LINE_H * 2 > MAX_Y) {
      drawFooter(doc, pageNum.value++);
      doc.addPage([PAGE_W, PAGE_H]);
      drawPageBg(doc);
      y = MARGIN_T + g(4);
    }

    let lineIdx = 0;
    while (lineIdx < lines.length) {
      const remaining = lines.length - lineIdx;
      const spaceLeft = MAX_Y - y;
      const linesThatFit = Math.floor(spaceLeft / LINE_H);

      if (linesThatFit <= 0) {
        drawFooter(doc, pageNum.value++);
        doc.addPage([PAGE_W, PAGE_H]);
        drawPageBg(doc);
        y = MARGIN_T + g(4);
        continue;
      }

      let linesToPrint: number;
      if (remaining <= linesThatFit) {
        linesToPrint = remaining;
      } else if (linesThatFit < 2) {
        drawFooter(doc, pageNum.value++);
        doc.addPage([PAGE_W, PAGE_H]);
        drawPageBg(doc);
        y = MARGIN_T + g(4);
        continue;
      } else {
        linesToPrint = Math.min(linesThatFit, remaining - 2);
        if (linesToPrint < 2) linesToPrint = 2;
        if (linesToPrint > linesThatFit) linesToPrint = linesThatFit;
      }

      // Left accent bar — very thin, low opacity
      const chunkH = linesToPrint * LINE_H;
      doc.setDrawColor(AC_R, AC_G, AC_B);
      doc.setLineWidth(1.2);
      const barOpacity = 0.25;
      doc.setGState(new (doc as any).GState({ opacity: barOpacity }));
      doc.line(MARGIN_L + indent - 8, y - 2, MARGIN_L + indent - 8, y + chunkH - 6);
      doc.setGState(new (doc as any).GState({ opacity: 1 }));

      // Body text — soft white
      doc.setTextColor(210, 214, 225);
      doc.setFontSize(11.5);
      doc.setFont("helvetica", "normal");
      for (let i = 0; i < linesToPrint; i++) {
        doc.text(lines[lineIdx + i], MARGIN_L + indent, y + i * LINE_H);
      }

      y += chunkH;
      lineIdx += linesToPrint;

      if (lineIdx < lines.length) {
        drawFooter(doc, pageNum.value++);
        doc.addPage([PAGE_W, PAGE_H]);
        drawPageBg(doc);
        y = MARGIN_T + g(4);
      }
    }

    y += PARA_GAP;
  }

  return y;
}

// ── Draw soft glow behind image (vignette effect) ──
function drawImageGlow(doc: jsPDF, x: number, y: number, w: number, h: number) {
  // Layered translucent rects for glow
  const layers = [
    { expand: 12, color: [AC_R, AC_G, AC_B] as const, opacity: 0.06 },
    { expand: 6, color: [AC_R, AC_G, AC_B] as const, opacity: 0.04 },
  ];
  for (const layer of layers) {
    doc.setGState(new (doc as any).GState({ opacity: layer.opacity }));
    doc.setFillColor(layer.color[0], layer.color[1], layer.color[2]);
    doc.roundedRect(
      x - layer.expand, y - layer.expand,
      w + layer.expand * 2, h + layer.expand * 2,
      6, 6, "F"
    );
  }
  doc.setGState(new (doc as any).GState({ opacity: 1 }));
}

function toLines(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

function getChapterTextLayout(
  doc: jsPDF,
  chapter: Chapter,
  preset: ChapterLayoutPreset,
): ChapterTextLayout {
  doc.setFont("times", "bold");
  doc.setFontSize(preset.titleSize);
  const titleLines = toLines(doc.splitTextToSize(chapter.title, CONTENT_W));

  doc.setFont("times", "italic");
  doc.setFontSize(preset.subtitleSize);
  const subtitleLines = toLines(doc.splitTextToSize(chapter.subtitle, CONTENT_W));

  doc.setFont("helvetica", "normal");
  doc.setFontSize(preset.bodyFontSize);
  const paragraphLines = chapter.paragraphs.map((paragraph) =>
    toLines(doc.splitTextToSize(paragraph, BODY_TEXT_W)),
  );

  const bodyHeight = paragraphLines.reduce(
    (total, lines, index) =>
      total +
      lines.length * preset.bodyLineHeight +
      (index < paragraphLines.length - 1 ? preset.paragraphGap : 0),
    0,
  );

  return { titleLines, subtitleLines, paragraphLines, bodyHeight };
}

function getChapterContentHeight(layout: ChapterTextLayout, preset: ChapterLayoutPreset): number {
  return (
    CHAPTER_LABEL_GAP +
    layout.titleLines.length * preset.titleLeading +
    CHAPTER_TITLE_GAP +
    layout.subtitleLines.length * preset.subtitleLeading +
    CHAPTER_SUBTITLE_GAP +
    preset.imageMaxHeight +
    CHAPTER_IMAGE_GAP +
    layout.bodyHeight
  );
}

function resolveChapterLayoutPreset(doc: jsPDF): ChapterLayoutPreset {
  const basePreset = {
    titleSize: 34,
    titleLeading: 36,
    subtitleSize: 12.5,
    subtitleLeading: 16,
  };

  const candidates: Omit<ChapterLayoutPreset, "titleSize" | "titleLeading" | "subtitleSize" | "subtitleLeading">[] = [
    { bodyFontSize: 11.5, bodyLineHeight: 18, paragraphGap: g(1.5), imageMaxHeight: 180 },
    { bodyFontSize: 11.25, bodyLineHeight: 17.5, paragraphGap: g(1.5), imageMaxHeight: 172 },
    { bodyFontSize: 11, bodyLineHeight: 17, paragraphGap: g(1.25), imageMaxHeight: 166 },
    { bodyFontSize: 11, bodyLineHeight: 17, paragraphGap: g(1.25), imageMaxHeight: 164 },
    { bodyFontSize: 11, bodyLineHeight: 17, paragraphGap: g(1), imageMaxHeight: 162 },
  ];

  for (const candidate of candidates) {
    const preset: ChapterLayoutPreset = { ...basePreset, ...candidate };
    const fitsAllChapters = chapters.every((chapter) => {
      const layout = getChapterTextLayout(doc, chapter, preset);
      return getChapterContentHeight(layout, preset) <= CHAPTER_FRAME_H;
    });

    if (fitsAllChapters) {
      return preset;
    }
  }

  return { ...basePreset, ...candidates[candidates.length - 1] };
}

// ── Main ──

export async function generateBookPdf(): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: [PAGE_W, PAGE_H] });

  // ── Cover page — full-bleed image ──
  try {
    const { dataUrl, width: natW, height: natH } = await loadImageAsDataUrl(pdfCover);
    const ratio = natH / natW;
    const pageRatio = PAGE_H / PAGE_W;
    let imgW: number, imgH: number, imgX: number, imgY: number;
    if (ratio > pageRatio) {
      imgW = PAGE_W;
      imgH = PAGE_W * ratio;
      imgX = 0;
      imgY = (PAGE_H - imgH) / 2;
    } else {
      imgH = PAGE_H;
      imgW = PAGE_H / ratio;
      imgX = (PAGE_W - imgW) / 2;
      imgY = 0;
    }
    doc.addImage(dataUrl, "PNG", imgX, imgY, imgW, imgH);
  } catch {
    drawPageBg(doc);
  }

  const pageNum = { value: 1 };

  // ── Table of Contents ──
  doc.addPage([PAGE_W, PAGE_H]);
  drawPageBg(doc);

  let tocY = MARGIN_T + g(10); // generous top spacing

  doc.setTextColor(AC_R, AC_G, AC_B);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "italic");
  doc.text("CONTENTS", MARGIN_L, tocY);

  doc.setDrawColor(AC_R, AC_G, AC_B);
  doc.setLineWidth(1);
  doc.line(MARGIN_L, tocY + 6, MARGIN_L + 28, tocY + 6);

  tocY += g(5);
  doc.setTextColor(245, 245, 252);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Table of Contents", MARGIN_L, tocY);

  tocY += g(6);

  chapters.forEach((ch, i) => {
    const y = tocY + i * g(7);

    // Dot
    doc.setFillColor(AC_R, AC_G, AC_B);
    doc.circle(MARGIN_L + 3, y - 3, 2, "F");

    // Title
    doc.setTextColor(235, 238, 248);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(ch.title, MARGIN_L + 16, y);

    // Subtitle
    doc.setFont("helvetica", "italic");
    doc.setTextColor(110, 115, 135);
    doc.setFontSize(9.5);
    doc.text(ch.subtitle, MARGIN_L + 16, y + 14);

    // Chapter number
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 84, 100);
    doc.setFontSize(8.5);
    doc.text(`${String(ch.id).padStart(2, "0")}`, PAGE_W - MARGIN_R, y, { align: "right" });
  });

  drawFooter(doc, pageNum.value++);

  // ── Chapter pages ──
  const chapterPreset = resolveChapterLayoutPreset(doc);

  for (const chapter of chapters) {
    doc.addPage([PAGE_W, PAGE_H]);
    drawPageBg(doc);

    const chapterLayout = getChapterTextLayout(doc, chapter, chapterPreset);
    let y = CHAPTER_TOP;

    // Chapter label — small caps style
    doc.setTextColor(AC_R, AC_G, AC_B);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "italic");
    doc.text(`CHAPTER ${String(chapter.id).padStart(2, "0")}`, MARGIN_L, y);

    // Short accent underline
    doc.setDrawColor(AC_R, AC_G, AC_B);
    doc.setLineWidth(1);
    doc.line(MARGIN_L, y + 5, MARGIN_L + 24, y + 5);

    y += CHAPTER_LABEL_GAP;

    // Title — large, pure white, tight leading
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(chapterPreset.titleSize);
    doc.setFont("times", "bold");
    for (let i = 0; i < chapterLayout.titleLines.length; i++) {
      doc.text(chapterLayout.titleLines[i], MARGIN_L, y + i * chapterPreset.titleLeading);
    }
    y += chapterLayout.titleLines.length * chapterPreset.titleLeading + CHAPTER_TITLE_GAP;

    // Subtitle — muted, slightly tracked
    doc.setTextColor(132, 138, 162);
    doc.setFontSize(chapterPreset.subtitleSize);
    doc.setFont("times", "italic");
    for (let i = 0; i < chapterLayout.subtitleLines.length; i++) {
      doc.text(chapterLayout.subtitleLines[i], MARGIN_L, y + i * chapterPreset.subtitleLeading);
    }

    y += chapterLayout.subtitleLines.length * chapterPreset.subtitleLeading + CHAPTER_SUBTITLE_GAP;

    // Chapter image — centered, contained, soft glow
    try {
      const { dataUrl, width: natW, height: natH } = await loadImageAsDataUrl(chapter.image);
      const ratio = natH / natW;
      let imgW = CHAPTER_IMAGE_MAX_W;
      let imgH = imgW * ratio;

      if (imgH > chapterPreset.imageMaxHeight) {
        imgH = chapterPreset.imageMaxHeight;
        imgW = imgH / ratio;
      }

      if (imgW > CHAPTER_IMAGE_MAX_W) {
        imgW = CHAPTER_IMAGE_MAX_W;
        imgH = imgW * ratio;
      }

      const imgX = MARGIN_L + (CONTENT_W - imgW) / 2;

      // Soft glow behind image
      drawImageGlow(doc, imgX, y, imgW, imgH);

      // Image with rounded clip (simulated with rounded rect overlay)
      doc.addImage(dataUrl, "JPEG", imgX, y, imgW, imgH);

      y += imgH + CHAPTER_IMAGE_GAP;
    } catch {
      y += CHAPTER_IMAGE_GAP;
    }

    // Body text — single contained block
    doc.setDrawColor(AC_R, AC_G, AC_B);
    doc.setLineWidth(1);
    doc.setGState(new (doc as any).GState({ opacity: 0.2 }));
    doc.line(MARGIN_L + BODY_INDENT - 8, y - 2, MARGIN_L + BODY_INDENT - 8, y + chapterLayout.bodyHeight - 4);
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    doc.setTextColor(214, 218, 228);
    doc.setFontSize(chapterPreset.bodyFontSize);
    doc.setFont("helvetica", "normal");

    for (let paragraphIndex = 0; paragraphIndex < chapterLayout.paragraphLines.length; paragraphIndex++) {
      const lines = chapterLayout.paragraphLines[paragraphIndex];
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        doc.text(lines[lineIndex], MARGIN_L + BODY_INDENT, y + lineIndex * chapterPreset.bodyLineHeight);
      }

      y += lines.length * chapterPreset.bodyLineHeight;

      if (paragraphIndex < chapterLayout.paragraphLines.length - 1) {
        y += chapterPreset.paragraphGap;
      }
    }

    drawFooter(doc, pageNum.value++);
  }

  // ── Closing page ──
  doc.addPage([PAGE_W, PAGE_H]);
  drawPageBg(doc);

  let y = MARGIN_T + g(12);

  doc.setTextColor(AC_R, AC_G, AC_B);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "italic");
  doc.text("CLOSING", MARGIN_L, y);
  doc.setDrawColor(AC_R, AC_G, AC_B);
  doc.setLineWidth(1);
  doc.line(MARGIN_L, y + 5, MARGIN_L + 24, y + 5);

  y += g(4);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(34);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you", MARGIN_L, y);
  y += 38;
  doc.text("for reading", MARGIN_L, y);

  y += g(6);
  const closingText =
    "This book was created as a digital reading experience exploring the human future with AI. The ideas here are starting points, not conclusions. The most important chapter is the one you write through your own choices.";

  renderBody(doc, [closingText], y, pageNum, BODY_TEXT_W, BODY_INDENT);
  drawFooter(doc, pageNum.value);

  doc.save("AI-and-Us.pdf");
}
