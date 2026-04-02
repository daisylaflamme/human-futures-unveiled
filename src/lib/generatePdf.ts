import jsPDF from "jspdf";
import { chapters } from "@/data/chapters";
import pdfCover from "@/assets/pdf-cover.png";

const MARGIN = 50;
const MARGIN_TOP = 55;
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = PAGE_H - 35;
const ACCENT_R = 120;
const ACCENT_G = 110;
const ACCENT_B = 220;

function drawPageBg(doc: jsPDF) {
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

function drawFooter(doc: jsPDF, pageNum: number) {
  // Thin separator line
  doc.setDrawColor(50, 55, 70);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, FOOTER_Y - 12, PAGE_W - MARGIN, FOOTER_Y - 12);
  // "AI & Us" left
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(9);
  doc.setTextColor(160, 155, 180);
  doc.text("AI & Us", MARGIN, FOOTER_Y);
  // Page number right
  doc.setFont("helvetica", "normal");
  doc.setTextColor(140, 145, 155);
  doc.text(String(pageNum).padStart(2, "0"), PAGE_W - MARGIN, FOOTER_Y, { align: "right" });
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

export async function generateBookPdf(): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // ── Cover page — full-bleed image, no text ──
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
    doc.setFillColor(15, 17, 23);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  }

  let pageNum = 1;

  // ── Table of Contents ──
  doc.addPage();
  drawPageBg(doc);

  // "Table of Contents" label - same style as chapter label
  doc.setTextColor(ACCENT_R, ACCENT_G, ACCENT_B);
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text("Contents", MARGIN, MARGIN_TOP);

  // Accent line
  doc.setDrawColor(ACCENT_R, ACCENT_G, ACCENT_B);
  doc.setLineWidth(2);
  doc.line(MARGIN, MARGIN_TOP + 10, MARGIN + 35, MARGIN_TOP + 10);

  // Title
  doc.setTextColor(230, 235, 245);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("Table of Contents", MARGIN, MARGIN_TOP + 45);

  chapters.forEach((ch, i) => {
    const y = MARGIN_TOP + 100 + i * 65;
    // Chapter number dot
    doc.setFillColor(ACCENT_R, ACCENT_G, ACCENT_B);
    doc.circle(MARGIN + 4, y - 4, 3, "F");
    // Title
    doc.setTextColor(220, 225, 235);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${ch.title}`, MARGIN + 16, y);
    // Subtitle
    doc.setFont("helvetica", "italic");
    doc.setTextColor(130, 135, 150);
    doc.setFontSize(10);
    doc.text(ch.subtitle, MARGIN + 16, y + 18);
    // Chapter number right-aligned
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 105, 120);
    doc.setFontSize(10);
    doc.text(`Chapter ${ch.id}`, PAGE_W - MARGIN, y, { align: "right" });
  });

  drawFooter(doc, pageNum++);

  // ── Chapter pages ──
  const PARA_INDENT = 14; // left bar + gap
  const TEXT_W = CONTENT_W - PARA_INDENT;
  const MAX_TEXT_Y = FOOTER_Y - 30;

  for (const chapter of chapters) {
    doc.addPage();
    drawPageBg(doc);

    // Chapter label - italic, accent color, left-aligned
    doc.setTextColor(ACCENT_R, ACCENT_G, ACCENT_B);
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.text(`Chapter ${chapter.id}`, MARGIN, MARGIN_TOP);

    // Accent underline
    doc.setDrawColor(ACCENT_R, ACCENT_G, ACCENT_B);
    doc.setLineWidth(2);
    doc.line(MARGIN, MARGIN_TOP + 10, MARGIN + 35, MARGIN_TOP + 10);

    // Title - large, bold, left-aligned
    doc.setTextColor(230, 235, 245);
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(chapter.title, CONTENT_W);
    doc.text(titleLines, MARGIN, MARGIN_TOP + 42);
    const titleH = titleLines.length * 36;

    // Subtitle - italic, left-aligned
    const subtitleY = MARGIN_TOP + 42 + titleH + 4;
    doc.setTextColor(150, 145, 170);
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(chapter.subtitle, MARGIN, subtitleY);

    // Chapter image - full content width with subtle border
    let yOffset = subtitleY + 24;
    try {
      const { dataUrl, width: natW, height: natH } = await loadImageAsDataUrl(chapter.image);
      const ratio = natH / natW;
      const imgW = CONTENT_W;
      const imgH = imgW * ratio;
      // Subtle border behind image
      doc.setDrawColor(45, 50, 70);
      doc.setLineWidth(1);
      doc.roundedRect(MARGIN - 1, yOffset - 1, imgW + 2, imgH + 2, 4, 4, "S");
      doc.addImage(dataUrl, "JPEG", MARGIN, yOffset, imgW, imgH);
      yOffset += imgH + 28;
    } catch {
      yOffset += 20;
    }

    // Body paragraphs with left accent bar
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "normal");
    for (const para of chapter.paragraphs) {
      const lines = doc.splitTextToSize(para, TEXT_W);
      const blockH = lines.length * 15 + 10;

      if (yOffset + blockH > MAX_TEXT_Y) {
        drawFooter(doc, pageNum++);
        doc.addPage();
        drawPageBg(doc);
        yOffset = MARGIN_TOP;
      }

      // Left accent bar
      doc.setDrawColor(ACCENT_R, ACCENT_G, ACCENT_B);
      doc.setLineWidth(2.5);
      doc.line(MARGIN, yOffset - 2, MARGIN, yOffset + blockH - 14);

      // Paragraph text
      doc.setTextColor(195, 200, 210);
      doc.text(lines, MARGIN + PARA_INDENT, yOffset);
      yOffset += blockH + 4;
    }

    drawFooter(doc, pageNum++);
  }

  // ── Closing page ──
  doc.addPage();
  drawPageBg(doc);

  doc.setTextColor(ACCENT_R, ACCENT_G, ACCENT_B);
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text("Closing", MARGIN, MARGIN_TOP);
  doc.setDrawColor(ACCENT_R, ACCENT_G, ACCENT_B);
  doc.setLineWidth(2);
  doc.line(MARGIN, MARGIN_TOP + 10, MARGIN + 35, MARGIN_TOP + 10);

  doc.setTextColor(230, 235, 245);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you\nfor reading", MARGIN, MARGIN_TOP + 45);

  const closingText =
    "This book was created as a digital reading experience exploring the human future with AI. The ideas here are starting points, not conclusions. The most important chapter is the one you write through your own choices.";
  const closingLines = doc.splitTextToSize(closingText, TEXT_W);

  // Left accent bar for closing
  const closingY = MARGIN_TOP + 120;
  const closingBlockH = closingLines.length * 15 + 10;
  doc.setDrawColor(ACCENT_R, ACCENT_G, ACCENT_B);
  doc.setLineWidth(2.5);
  doc.line(MARGIN, closingY - 2, MARGIN, closingY + closingBlockH - 14);

  doc.setTextColor(195, 200, 210);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");
  doc.text(closingLines, MARGIN + PARA_INDENT, closingY);

  drawFooter(doc, pageNum);

  doc.save("AI-and-Us.pdf");
}
