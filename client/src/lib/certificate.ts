import { jsPDF } from "jspdf";
import type { AnalysisData, Verdict } from "@/lib/appState";

export type CertificateOptions = {
  songFileName?: string;
  verdict?: Verdict;
  analysisData?: AnalysisData | null;
};

type CategoryKey = Exclude<keyof AnalysisData, "signalClarityScore">;

const CATEGORY_ROWS: { key: CategoryKey; title: string }[] = [
  { key: "bpmProfile",          title: "BPM & Frequency Profile" },
  { key: "lyricalDoctrine",     title: "Lyrical Doctrine" },
  { key: "tranceInducement",    title: "Trance Inducement Risk" },
  { key: "loopRepetition",      title: "Loop & Repetition Analysis" },
  { key: "culturalDegradation", title: "Cultural Degradation Markers" },
  { key: "rhythmicArchetype",   title: "Rhythmic Archetype Classification" },
];

const GOLD: [number, number, number]    = [184, 155, 40];
const INK: [number, number, number]     = [80, 60, 30];
const CRIMSON: [number, number, number] = [160, 40, 40];
const PURPLE: [number, number, number]  = [106, 55, 120];

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, Math.max(0, max - 3)) + "..." : text;
}

function scoreColor(score: number): [number, number, number] {
  if (score >= 70) return GOLD;
  if (score >= 45) return [170, 110, 30];
  return CRIMSON;
}

export function generateCertificate(userName: string, options: CertificateOptions = {}) {
  const { songFileName, verdict, analysisData } = options;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Parchment background + double border (Clear Signal house style)
  doc.setFillColor(255, 253, 240);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setDrawColor(0, 107, 143);
  doc.setLineWidth(3);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // ── Header ──────────────────────────────────────────────────────────────
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text("CLEAR SIGNAL", pageWidth / 2, 25, { align: "center" });

  doc.setLineWidth(0.3);
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.line(60, 30, pageWidth - 60, 30);

  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.text("ANALYSIS REPORT", pageWidth / 2, 42, { align: "center" });

  // ── Listener / track / date ─────────────────────────────────────────────
  const displayName = (userName || "").trim() || "Listener";

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.setTextColor(INK[0], INK[1], INK[2]);
  doc.text("Prepared for:", pageWidth / 2, 52, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text(displayName.toUpperCase(), pageWidth / 2, 61, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(80, 65, pageWidth - 80, 65);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.setTextColor(INK[0], INK[1], INK[2]);
  if (songFileName && songFileName.trim()) {
    doc.text(`Track: ${truncate(songFileName.trim(), 70)}`, pageWidth / 2, 73, { align: "center" });
  }
  doc.setFontSize(10.5);
  doc.text(`Date of analysis: ${today}`, pageWidth / 2, 80, { align: "center" });

  // ── Verdict + overall score ─────────────────────────────────────────────
  doc.setFont("times", "bolditalic");
  doc.setFontSize(13);
  if (verdict === "calf") {
    doc.setTextColor(CRIMSON[0], CRIMSON[1], CRIMSON[2]);
    doc.text("THIS TRACK DOES NOT MEET THE CURRENT CLEAR SIGNAL CRITERIA.", pageWidth / 2, 90, { align: "center" });
  } else if (verdict === "ark") {
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text("THIS TRACK MEETS THE CURRENT CLEAR SIGNAL CRITERIA.", pageWidth / 2, 90, { align: "center" });
  } else {
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text("CLEAR SIGNAL CRITERIA REVIEW - SEE BREAKDOWN BELOW.", pageWidth / 2, 90, { align: "center" });
  }

  if (analysisData && typeof analysisData.signalClarityScore === "number") {
    const overall = Math.round(analysisData.signalClarityScore);
    const oc = scoreColor(overall);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(oc[0], oc[1], oc[2]);
    doc.text(`Signal Clarity Score: ${overall} / 100`, pageWidth / 2, 99, { align: "center" });
  }

  doc.setLineWidth(0.3);
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.line(40, 104, pageWidth - 40, 104);

  // ── Six-category breakdown ──────────────────────────────────────────────
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text("SIX-CATEGORY BREAKDOWN", pageWidth / 2, 112, { align: "center", charSpace: 0.8 });

  if (analysisData) {
    const colX = [30, pageWidth / 2 + 8];
    const colW = pageWidth / 2 - 46;
    const rowY = [121, 139, 157];

    CATEGORY_ROWS.forEach((row, i) => {
      const cat = analysisData[row.key];
      const x = colX[i % 2];
      const y = rowY[Math.floor(i / 2)];

      const score = cat && typeof cat.score === "number" ? Math.round(cat.score) : null;
      const label = cat && cat.label ? String(cat.label) : "No data recorded for this category.";
      const sc = score !== null ? scoreColor(score) : INK;

      doc.setFont("times", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(INK[0], INK[1], INK[2]);
      doc.text(truncate(row.title, 42), x, y);

      doc.setFont("times", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(sc[0], sc[1], sc[2]);
      doc.text(score !== null ? `${score} / 100` : "n/a", x + colW, y, { align: "right" });

      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(120, 100, 70);
      doc.text(truncate(label, 68), x, y + 5);

      // Score bar
      doc.setFillColor(228, 219, 195);
      doc.rect(x, y + 7.2, colW, 1.6, "F");
      if (score !== null) {
        doc.setFillColor(sc[0], sc[1], sc[2]);
        doc.rect(x, y + 7.2, Math.max(1, (colW * Math.min(100, Math.max(0, score))) / 100), 1.6, "F");
      }
    });
  } else {
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.setTextColor(120, 100, 70);
    doc.text("Full category data was not available for this analysis session.", pageWidth / 2, 135, { align: "center" });
  }

  // ── Footer + seal ───────────────────────────────────────────────────────
  doc.setLineWidth(0.3);
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.line(60, 172, pageWidth - 60, 172);

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.text("Issued by: Clear Signal - Music discernment for all nations", pageWidth / 2, 180, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(8.5);
  doc.text("Criteria reviewed. Report generated by Clear Signal.", pageWidth / 2, 187, { align: "center" });

  const sealX = pageWidth - 36;
  const sealY = 181;
  doc.setDrawColor(180, 40, 40);
  doc.setFillColor(180, 40, 40);
  doc.circle(sealX, sealY, 10, "F");
  doc.setFillColor(200, 60, 60);
  doc.circle(sealX, sealY, 8.2, "F");

  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 253, 240);
  doc.text("CLEAR", sealX, sealY - 1, { align: "center" });
  doc.setFontSize(6);
  doc.text("SIGNAL", sealX, sealY + 3, { align: "center" });

  const safeName =
    displayName.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") || "Listener";
  doc.save(`Clear-Signal-Analysis-Report-${safeName}.pdf`);
}
