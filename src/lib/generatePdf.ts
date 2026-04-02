import jsPDF from "jspdf";
import { chapters } from "@/data/chapters";
import pdfCover from "@/assets/pdf-cover.png";

// ── 6×9 inch book at 72 DPI ──
const PAGE_W = 6 * 72;        // 432 pt
const PAGE_H = 9 * 72;        // 648 pt
const BLEED = 0.125 * 72;     // 9 pt (visual only — we use trim box for content)

const MARGIN_L = 0.7 * 72;    // 50.4
const MARGIN_R = 0.7 * 72;
const MARGIN_T = 0.75 * 72;   // 54
const MARGIN_B = 0.75 * 72;

const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;
const FOOTER_Y = PAGE_H - MARGIN_B + 10;
const MAX_Y = PAGE_H - MARGIN_B - 14; // safe text bottom

const ACCENT_R = 120;
const ACCENT_G = 110;
const ACCENT_B = 220;

// ── Helpers ──

function drawPageBg(doc: jsPDF) {
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

function drawFooter(doc: jsPDF, pageNum: number) {
  doc.setDrawColor(50, 55, 70);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_L, FOOTER_Y - 14, PAGE_W - MARGIN_R, FOOTER_Y - 14);

  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(7.5);
  doc.setTextColor(160, 155, 180);
  doc.text("AI & Us", MARGIN_L, FOOTER_Y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(140, 145, 155);
  doc.text(String(pageNum).padStart(2, "0"), PAGE_W - MARGIN_R, FOOTER_Y, { align: "right" });
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

/**
 * Render body paragraphs with left accent bar starting at yOffset.
 * Handles pagination automatically — returns final yOffset.
 */
function renderBody(
  doc: jsPDF,
  paragraphs: string[],
  startY: number,
  pageNum: { value: number },
  textW: number,
  indent: number,
): number {
  const LINE_H = 14.5;
  const PARA_GAP = 10;
  let y = startY;

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");

  for (const para of paragraphs) {
    const lines: string[] = doc.splitTextToSize(para, textW);
    const blockH = lines.length * LINE_H;

    // Check if at least 2 lines fit; if not, break to next page
    if (y + LINE_H * 2 > MAX_Y) {
      drawFooter(doc, pageNum.value++);
      doc.addPage([PAGE_W, PAGE_H]);
      drawPageBg(doc);
      y = MARGIN_T;
    }

    // Render line by line with widow/orphan control
    let lineIdx = 0;
    while (lineIdx < lines.length) {
      // How many lines remain?
      const remaining = lines.length - lineIdx;

      // If only 1 line remains and we're at the top — just print it
      // If we'd leave 1 line alone at bottom (widow), push 2 lines to next page
      const spaceLeft = MAX_Y - y;
      const linesThatFit = Math.floor(spaceLeft / LINE_H);

      if (linesThatFit <= 0) {
        drawFooter(doc, pageNum.value++);
        doc.addPage([PAGE_W, PAGE_H]);
        drawPageBg(doc);
        y = MARGIN_T;
        continue;
      }

      // Widow/orphan: don't leave fewer than 2 lines on either side of a break
      let linesToPrint: number;
      if (remaining <= linesThatFit) {
        linesToPrint = remaining; // all fit
      } else if (linesThatFit < 2) {
        // not enough room even for 2 lines — new page
        drawFooter(doc, pageNum.value++);
        doc.addPage([PAGE_W, PAGE_H]);
        drawPageBg(doc);
        y = MARGIN_T;
        continue;
      } else {
        // Ensure at least 2 lines remain for next page
        linesToPrint = Math.min(linesThatFit, remaining - 2);
        if (linesToPrint < 2) linesToPrint = 2;
        // Clamp
        if (linesToPrint > linesThatFit) linesToPrint = linesThatFit;
      }

      // Draw left accent bar for this chunk
      const chunkH = linesToPrint * LINE_H;
      doc.setDrawColor(ACCENT_R, ACCENT_G, ACCENT_B);
      doc.setLineWidth(2);
      doc.line(MARGIN_L, y - 2, MARGIN_L, y + chunkH - 4);

      // Draw lines
      doc.setTextColor(195, 200, 210);
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "normal");
      for (let i = 0; i < linesToPrint; i++) {
        doc.text(lines[lineIdx + i], MARGIN_L + indent, y + i * LINE_H);
      }

      y += chunkH;
      lineIdx += linesToPrint;

      // If more lines remain, page break
      if (lineIdx < lines.length) {
        drawFooter(doc, pageNum.value++);
        doc.addPage([PAGE_W, PAGE_H]);
        drawPageBg(doc);
        y = MARGIN_T;
      }
    }

    y += PARA_GAP;
  }

  return y;
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

  doc.setTextColor(ACCENT_R, ACCENT_G, ACCENT_B);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("Contents", MARGIN_L, MARGIN_T);

  doc.setDrawColor(ACCENT_R, ACCENT_G, ACCENT_B);
  doc.setLineWidth(1.5);
  doc.line(MARGIN_L, MARGIN_T + 8, MARGIN_L + 30, MARGIN_T + 8);

  doc.setTextColor(230, 235, 245);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Table of Contents", MARGIN_L, MARGIN_T + 36);

  const tocStartY = MARGIN_T + 70;
  chapters.forEach((ch, i) => {
    const y = tocStartY + i * 52;
    doc.setFillColor(ACCENT_R, ACCENT_G, ACCENT_B);
    doc.circle(MARGIN_L + 3, y - 3, 2.5, "F");

    doc.setTextColor(220, 225, 235);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(ch.title, MARGIN_L + 14, y);

    doc.setFont("helvetica", "italic");
    doc.setTextColor(130, 135, 150);
    doc.setFontSize(9);
    doc.text(ch.subtitle, MARGIN_L + 14, y + 15);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 105, 120);
    doc.setFontSize(9);
    doc.text(`Chapter ${ch.id}`, PAGE_W - MARGIN_R, y, { align: "right" });
  });

  drawFooter(doc, pageNum.value++);

  // ── Chapter pages ──
  const PARA_INDENT = 12;
  const TEXT_W = CONTENT_W - PARA_INDENT;
  const IMG_MAX_W = CONTENT_W;
  const IMG_MAX_H = 180; // consistent image height cap

  for (const chapter of chapters) {
    doc.addPage([PAGE_W, PAGE_H]);
    drawPageBg(doc);

    let y = MARGIN_T;

    // Chapter label
    doc.setTextColor(ACCENT_R, ACCENT_G, ACCENT_B);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(`Chapter ${chapter.id}`, MARGIN_L, y);

    // Accent line
    doc.setDrawColor(ACCENT_R, ACCENT_G, ACCENT_B);
    doc.setLineWidth(1.5);
    doc.line(MARGIN_L, y + 8, MARGIN_L + 30, y + 8);

    y += 30;

    // Title
    doc.setTextColor(230, 235, 245);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(chapter.title, CONTENT_W);
    doc.text(titleLines, MARGIN_L, y);
    y += titleLines.length * 26 + 4;

    // Subtitle
    doc.setTextColor(150, 145, 170);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(chapter.subtitle, MARGIN_L, y);
    y += 22;

    // Chapter image — aspect-ratio preserved, capped height
    try {
      const { dataUrl, width: natW, height: natH } = await loadImageAsDataUrl(chapter.image);
      const ratio = natH / natW;
      let imgW = IMG_MAX_W;
      let imgH = imgW * ratio;

      // If too tall, scale down
      if (imgH > IMG_MAX_H) {
        imgH = IMG_MAX_H;
        imgW = imgH / ratio;
      }

      const imgX = MARGIN_L + (CONTENT_W - imgW) / 2; // center

      // Subtle border
      doc.setDrawColor(45, 50, 70);
      doc.setLineWidth(0.8);
      doc.roundedRect(imgX - 1, y - 1, imgW + 2, imgH + 2, 3, 3, "S");
      doc.addImage(dataUrl, "JPEG", imgX, y, imgW, imgH);
      y += imgH + 20;
    } catch {
      y += 10;
    }

    // Body text
    y = renderBody(doc, chapter.paragraphs, y, pageNum, TEXT_W, PARA_INDENT);

    drawFooter(doc, pageNum.value++);
  }

  // ── Closing page ──
  doc.addPage([PAGE_W, PAGE_H]);
  drawPageBg(doc);

  let y = MARGIN_T;
  doc.setTextColor(ACCENT_R, ACCENT_G, ACCENT_B);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("Closing", MARGIN_L, y);
  doc.setDrawColor(ACCENT_R, ACCENT_G, ACCENT_B);
  doc.setLineWidth(1.5);
  doc.line(MARGIN_L, y + 8, MARGIN_L + 30, y + 8);

  y += 30;
  doc.setTextColor(230, 235, 245);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you\nfor reading", MARGIN_L, y);

  y += 60;
  const closingText =
    "This book was created as a digital reading experience exploring the human future with AI. The ideas here are starting points, not conclusions. The most important chapter is the one you write through your own choices.";

  renderBody(doc, [closingText], y, pageNum, TEXT_W, PARA_INDENT);
  drawFooter(doc, pageNum.value);

  doc.save("AI-and-Us.pdf");
}
