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

  // ── Table of Contents ──
  doc.addPage();
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  doc.setTextColor(230, 235, 245);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Table of Contents", PAGE_W / 2, MARGIN_TOP + 30, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  chapters.forEach((ch, i) => {
    const y = MARGIN_TOP + 110 + i * 70;
    doc.setTextColor(200, 205, 215);
    doc.setFont("helvetica", "bold");
    doc.text(`${ch.id}. ${ch.title}`, MARGIN, y);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(140, 145, 155);
    doc.setFontSize(11);
    doc.text(ch.subtitle, MARGIN, y + 20);
    doc.setFontSize(13);
  });

  // ── Chapter pages ──
  for (const chapter of chapters) {
    doc.addPage();
    doc.setFillColor(15, 17, 23);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");

    // Chapter number
    doc.setTextColor(140, 145, 155);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Chapter ${chapter.id}`, PAGE_W / 2, MARGIN_TOP, { align: "center" });

    // Title
    doc.setTextColor(230, 235, 245);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(chapter.title, PAGE_W / 2, MARGIN_TOP + 35, { align: "center" });

    // Subtitle
    doc.setTextColor(170, 175, 185);
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(chapter.subtitle, PAGE_W / 2, MARGIN_TOP + 60, { align: "center" });

    // Chapter image
    let yOffset = MARGIN_TOP + 85;
    try {
      const { dataUrl, width: natW, height: natH } = await loadImageAsDataUrl(chapter.image);
      const ratio = natH / natW;
      const imgW = Math.min(CONTENT_W, 440);
      const imgH = imgW * ratio;
      const imgX = (PAGE_W - imgW) / 2;
      doc.addImage(dataUrl, "JPEG", imgX, yOffset, imgW, imgH);
      yOffset += imgH + 30;
    } catch {
      yOffset += 20;
    }

    // Body paragraphs
    doc.setTextColor(180, 185, 195);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    for (const para of chapter.paragraphs) {
      const lines = doc.splitTextToSize(para, CONTENT_W);
      if (yOffset + lines.length * 16 > PAGE_H - MARGIN) {
        doc.addPage();
        doc.setFillColor(15, 17, 23);
        doc.rect(0, 0, PAGE_W, PAGE_H, "F");
        doc.setTextColor(180, 185, 195);
        doc.setFontSize(11);
        yOffset = MARGIN_TOP;
      }
      doc.text(lines, MARGIN, yOffset);
      yOffset += lines.length * 16 + 14;
    }
  }

  // ── Closing page ──
  doc.addPage();
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  doc.setTextColor(230, 235, 245);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for reading", PAGE_W / 2, 350, { align: "center" });

  doc.setTextColor(160, 165, 175);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const closingLines = doc.splitTextToSize(
    "This book was created as a digital reading experience exploring the human future with AI. The ideas here are starting points, not conclusions. The most important chapter is the one you write through your own choices.",
    360
  );
  doc.text(closingLines, PAGE_W / 2, 390, { align: "center" });

  doc.save("AI-and-Us.pdf");
}
