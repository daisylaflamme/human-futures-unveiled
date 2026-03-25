import jsPDF from "jspdf";
import { chapters } from "@/data/chapters";

const MARGIN = 40;
const PAGE_W = 595.28; // A4 width in points
const PAGE_H = 841.89; // A4 height in points
const CONTENT_W = PAGE_W - MARGIN * 2;

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

  // ── Cover page ──
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  doc.setTextColor(200, 205, 215);
  doc.setFontSize(11);
  doc.text("A Digital Illustrated Book", PAGE_W / 2, 280, { align: "center" });

  doc.setTextColor(230, 235, 245);
  doc.setFontSize(48);
  doc.setFont("helvetica", "bold");
  doc.text("AI & Us", PAGE_W / 2, 350, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(180, 185, 195);
  doc.text("A Short Visual Book on the Human Future", PAGE_W / 2, 395, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(140, 145, 155);
  const introLines = doc.splitTextToSize(
    "Six chapters exploring how artificial intelligence reshapes work, creativity, trust, and what it means to be human in a world of infinite possibility.",
    300
  );
  doc.text(introLines, PAGE_W / 2, 450, { align: "center" });

  // ── Table of Contents ──
  doc.addPage();
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  doc.setTextColor(230, 235, 245);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Table of Contents", PAGE_W / 2, 100, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  chapters.forEach((ch, i) => {
    const y = 180 + i * 70;
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
    doc.text(`Chapter ${chapter.id}`, PAGE_W / 2, 50, { align: "center" });

    // Title
    doc.setTextColor(230, 235, 245);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(chapter.title, PAGE_W / 2, 85, { align: "center" });

    // Subtitle
    doc.setTextColor(170, 175, 185);
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(chapter.subtitle, PAGE_W / 2, 110, { align: "center" });

    // Chapter image
    let yOffset = 135;
    try {
      const { dataUrl, width: natW, height: natH } = await loadImageAsDataUrl(chapter.image);
      const ratio = natH / natW;
      const imgW = Math.min(CONTENT_W, 480);
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
        yOffset = MARGIN;
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
