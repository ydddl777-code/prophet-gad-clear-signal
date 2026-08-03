import { jsPDF } from "jspdf";
import {
  BOOK_TITLE,
  BOOK_SERIES,
  BOOK_AUTHOR_LINE,
  BOOK_COPYRIGHT_LINE,
  BOOK_CHAPTERS,
} from "../content/remnantWarningBook";

// ─────────────────────────────────────────────────────────────────────────
// Same gold-perimeter / parchment / tekhelet-blue aesthetic as
// client/src/lib/ebook.ts (the placeholder "Gad's Tune" ebook). Reused here
// on purpose so the real paid "Remnant Warning" book matches the visual
// language already established for Clear Signal's book-cover-related UI.
// ─────────────────────────────────────────────────────────────────────────
const GOLD = { r: 184, g: 155, b: 40 };
const TEKHELET = { r: 0, g: 107, b: 143 };
const SCARLET = { r: 180, g: 40, b: 40 };
const PURPLE = { r: 106, g: 55, b: 120 };
const PARCHMENT = { r: 255, g: 253, b: 240 };
const DARK_INK = { r: 50, g: 35, b: 20 };

const MARGIN_X = 18;
const TOP_Y = 24;
const BOTTOM_Y = 190; // a5 page height is 210mm; leave footer room

type RGB = { r: number; g: number; b: number };

function setColor(doc: jsPDF, c: RGB) {
  doc.setTextColor(c.r, c.g, c.b);
}

function fillParchment(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setFillColor(PARCHMENT.r, PARCHMENT.g, PARCHMENT.b);
  doc.rect(0, 0, w, h, "F");
}

function drawBorder(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(TEKHELET.r, TEKHELET.g, TEKHELET.b);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.3);
  doc.rect(13, 13, w - 26, h - 26);
}

function goldDivider(doc: jsPDF, y: number) {
  const cx = doc.internal.pageSize.getWidth() / 2;
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.4);
  doc.line(cx - 26, y, cx + 26, y);
}

function centeredText(doc: jsPDF, text: string, y: number) {
  doc.text(text, doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
}

let pageNum = 0;

function newPage(doc: jsPDF, isFirst = false) {
  if (!isFirst) doc.addPage();
  pageNum += 1;
  fillParchment(doc);
  drawBorder(doc);
  if (pageNum > 1) {
    doc.setFont("times", "italic");
    doc.setFontSize(7.5);
    setColor(doc, { r: 140, g: 120, b: 80 });
    centeredText(doc, String(pageNum), 202);
  }
}

/**
 * Prints wrapped body text starting at `y`, paginating (drawing new bordered
 * parchment pages) whenever the text would run past the bottom margin.
 * Returns the y position after the printed block.
 */
function flowParagraph(doc: jsPDF, text: string, y: number, opts?: { italic?: boolean; size?: number }): number {
  const size = opts?.size ?? 9.5;
  doc.setFont("times", opts?.italic ? "italic" : "normal");
  doc.setFontSize(size);
  setColor(doc, DARK_INK);

  const maxWidth = doc.internal.pageSize.getWidth() - MARGIN_X * 2;
  const lines: string[] = doc.splitTextToSize(text, maxWidth);
  const lineHeight = size * 0.42;

  let cursorY = y;
  for (const line of lines) {
    if (cursorY > BOTTOM_Y) {
      newPage(doc);
      cursorY = TOP_Y;
    }
    doc.text(line, MARGIN_X, cursorY);
    cursorY += lineHeight;
  }
  return cursorY + lineHeight * 0.6; // small gap after paragraph
}

function ensureRoom(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > BOTTOM_Y) {
    newPage(doc);
    return TOP_Y;
  }
  return y;
}

export function generateRemnantWarningPdf(): Buffer {
  pageNum = 0;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const pw = doc.internal.pageSize.getWidth();

  // ── Cover page ──────────────────────────────────────────────────────
  newPage(doc, true);

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  setColor(doc, PURPLE);
  centeredText(doc, BOOK_SERIES, 44);

  goldDivider(doc, 52);

  doc.setFont("times", "bold");
  doc.setFontSize(24);
  setColor(doc, GOLD);
  const titleLines = doc.splitTextToSize(BOOK_TITLE, pw - 40);
  let ty = 78;
  for (const line of titleLines) {
    centeredText(doc, line, ty);
    ty += 10;
  }

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  setColor(doc, TEKHELET);
  centeredText(doc, "No Contemporary Worship Music for the Israelites", ty + 8);

  goldDivider(doc, ty + 20);

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  centeredText(doc, BOOK_AUTHOR_LINE, ty + 34);

  doc.setFont("times", "italic");
  doc.setFontSize(7.5);
  setColor(doc, { r: 120, g: 100, b: 70 });
  centeredText(doc, "Thread Bear Books · Remnant Seed LLC", 178);
  centeredText(doc, "A companion volume to the Clear Signal discernment tool", 184);

  // ── Copyright / legal page ──────────────────────────────────────────
  newPage(doc);
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  setColor(doc, PURPLE);
  centeredText(doc, "Copyright Information", 30);
  goldDivider(doc, 37);

  let cy = 50;
  const legalLines = [
    BOOK_COPYRIGHT_LINE,
    "All rights reserved.",
    "No part of this book may be reproduced or transmitted in any form or by any means, electronic or mechanical, including photocopying, recording, or by any information storage and retrieval system, without written permission from the publisher.",
    "Scripture quotations are from the King James Version (KJV) of the Bible, which is in the public domain.",
    "Published by Thread Bear Books, a division of Remnant Seed LLC.",
    "Purchased through Clear Signal (pgcs.ai) — a product of Prophet Gad · Remnant Seed LLC · Thread Bear Studio.",
  ];
  for (const l of legalLines) {
    cy = flowParagraph(doc, l, cy, { size: 8.5 });
    cy += 2;
  }

  cy = ensureRoom(doc, cy, 30);
  goldDivider(doc, cy);
  cy += 12;
  doc.setFont("times", "italic");
  doc.setFontSize(8.5);
  setColor(doc, PURPLE);
  cy = flowParagraph(
    doc,
    "The modern Prophet Gad operates in the spirit and power of the ancient Gad. This is not an esoteric claim of literal reincarnation, but the deliberate voice of a discernment ministry — Prophet Gad, the oracle; Michael Siprin, the hand that writes it down.",
    cy,
    { italic: true, size: 8.5 }
  );

  // ── Table of contents ───────────────────────────────────────────────
  newPage(doc);
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  setColor(doc, PURPLE);
  centeredText(doc, "Table of Contents", 28);
  goldDivider(doc, 35);

  let toy = 48;
  doc.setFont("times", "normal");
  doc.setFontSize(8.5);
  setColor(doc, DARK_INK);
  for (const chapter of BOOK_CHAPTERS) {
    toy = ensureRoom(doc, toy, 8);
    const label = chapter.title.replace(/^CHAPTER (\d+):\s*/i, "Chapter $1 — ").replace(/^APPENDIX:\s*/i, "Appendix — ");
    const lines = doc.splitTextToSize(label, pw - MARGIN_X * 2);
    for (const line of lines) {
      doc.text(line, MARGIN_X, toy);
      toy += 5.5;
    }
    toy += 1.5;
  }

  // ── Chapters ─────────────────────────────────────────────────────────
  for (const chapter of BOOK_CHAPTERS) {
    newPage(doc);
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    setColor(doc, PURPLE);
    const headTitle = chapter.title
      .replace(/^CHAPTER (\d+):\s*/i, "")
      .replace(/^APPENDIX:\s*/i, "");
    const headLines = doc.splitTextToSize(headTitle, pw - MARGIN_X * 2 - 6);
    let hy = 26;
    for (const hl of headLines) {
      centeredText(doc, hl, hy);
      hy += 6.5;
    }
    goldDivider(doc, hy + 3);

    let y = hy + 14;
    for (const para of chapter.paragraphs) {
      y = ensureRoom(doc, y, 8);
      // Short ALL-CAPS lines read as sub-headers (e.g. "SONG 1: ETERNAL FATHER").
      const isSubhead = para.length < 60 && para === para.toUpperCase() && /[A-Z]/.test(para);
      if (isSubhead) {
        doc.setFont("times", "bold");
        doc.setFontSize(9.5);
        setColor(doc, TEKHELET);
        doc.text(para, MARGIN_X, y);
        y += 7;
      } else {
        y = flowParagraph(doc, para, y);
      }
    }
  }

  // ── Closing page ─────────────────────────────────────────────────────
  newPage(doc);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  setColor(doc, GOLD);
  centeredText(doc, "Soli Deo Gloria", 90);
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  centeredText(doc, "To God Alone Be Glory", 100);
  goldDivider(doc, 112);
  doc.setFont("times", "normal");
  doc.setFontSize(8);
  setColor(doc, { r: 140, g: 120, b: 80 });
  centeredText(doc, "Purchased through Clear Signal — pgcs.ai", 170);
  centeredText(doc, "A product of Prophet Gad · Remnant Seed LLC · Thread Bear Studio", 176);

  const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
