import { jsPDF } from "jspdf";

const GOLD = { r: 184, g: 155, b: 40 };
const TEKHELET = { r: 0, g: 107, b: 143 };
const SCARLET = { r: 180, g: 40, b: 40 };
const PURPLE = { r: 106, g: 55, b: 120 };
const PARCHMENT = { r: 255, g: 253, b: 240 };
const DARK_INK = { r: 50, g: 35, b: 20 };

function setColor(doc: jsPDF, c: { r: number; g: number; b: number }) {
  doc.setTextColor(c.r, c.g, c.b);
}

function addPage(doc: jsPDF) {
  doc.addPage();
  doc.setFillColor(PARCHMENT.r, PARCHMENT.g, PARCHMENT.b);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");
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

function centeredText(doc: jsPDF, text: string, y: number) {
  doc.text(text, doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
}

function wrappedCentered(doc: jsPDF, text: string, y: number, maxWidth: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  const cx = doc.internal.pageSize.getWidth() / 2;
  doc.text(lines, cx, y, { align: "center" });
  return y + lines.length * (doc.getFontSize() * 0.45);
}

function goldDivider(doc: jsPDF, y: number) {
  const cx = doc.internal.pageSize.getWidth() / 2;
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.4);
  doc.line(cx - 30, y, cx + 30, y);
}

export function generateEbook() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const pw = doc.internal.pageSize.getWidth();

  doc.setFillColor(PARCHMENT.r, PARCHMENT.g, PARCHMENT.b);
  doc.rect(0, 0, pw, doc.internal.pageSize.getHeight(), "F");
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(28);
  setColor(doc, GOLD);
  centeredText(doc, "GAD'S TUNE", 55);

  doc.setFontSize(10);
  setColor(doc, PURPLE);
  centeredText(doc, "The Prophet Who Tuned Heaven", 65);

  goldDivider(doc, 75);

  doc.setFont("times", "italic");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  centeredText(doc, "Shofar raised. Linen flowing. Light behind him.", 90);

  doc.setFont("times", "bold");
  doc.setFontSize(7);
  setColor(doc, SCARLET);
  centeredText(doc, "T   T   T", 110);

  doc.setFont("times", "normal");
  doc.setFontSize(8);
  setColor(doc, TEKHELET);
  centeredText(doc, "Temple, Tabernacle, Tone", 116);

  doc.setFont("times", "italic");
  doc.setFontSize(7);
  setColor(doc, { r: 120, g: 100, b: 70 });
  centeredText(doc, "No price. No ads. Just truth.", 180);

  // --- Page 2: From the Tribe of Warriors ---
  addPage(doc);
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  setColor(doc, PURPLE);
  centeredText(doc, "From the Tribe of Warriors", 30);

  goldDivider(doc, 38);

  doc.setFont("times", "italic");
  doc.setFontSize(8);
  setColor(doc, TEKHELET);
  centeredText(doc, "Joshua 4:12", 48);

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  wrappedCentered(doc,
    '"The men of Reuben, Gad and half the tribe of Manasseh crossed over, armed before the Israelites..."',
    56, pw - 40
  );

  doc.setFont("times", "italic");
  doc.setFontSize(8);
  setColor(doc, TEKHELET);
  centeredText(doc, "1 Chronicles 12:8", 80);

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  wrappedCentered(doc,
    '"From the Gadites there went over to David... mighty men of valor, men trained for battle..."',
    88, pw - 40
  );

  goldDivider(doc, 110);

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  setColor(doc, GOLD);
  centeredText(doc, "They didn\u2019t wait.", 122);
  centeredText(doc, "They led. They sang. They fought.", 130);

  // --- Page 3: The King's Seer ---
  addPage(doc);
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  setColor(doc, PURPLE);
  centeredText(doc, "The King\u2019s Seer", 30);

  goldDivider(doc, 38);

  doc.setFont("times", "italic");
  doc.setFontSize(8);
  setColor(doc, TEKHELET);
  centeredText(doc, "1 Samuel 22:5", 48);

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  wrappedCentered(doc,
    '"The prophet Gad said to David..."',
    56, pw - 40
  );

  doc.setFont("times", "italic");
  doc.setFontSize(8);
  setColor(doc, TEKHELET);
  centeredText(doc, "2 Samuel 24:11", 72);

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  wrappedCentered(doc,
    '"...Gad came to David and said to him, \u2018Thus says the Lord...\u2019"',
    80, pw - 40
  );

  goldDivider(doc, 100);

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  setColor(doc, GOLD);
  centeredText(doc, "God spoke. Gad listened.", 112);
  centeredText(doc, "David obeyed.", 120);

  // --- Page 4: The Minister of Music ---
  addPage(doc);
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  setColor(doc, PURPLE);
  centeredText(doc, "The Minister of Music", 30);

  goldDivider(doc, 38);

  doc.setFont("times", "italic");
  doc.setFontSize(8);
  setColor(doc, TEKHELET);
  centeredText(doc, "1 Chronicles 25:1", 48);

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  wrappedCentered(doc,
    '"David, together with the commanders of the army, set apart some of the sons of Asaph, Heman and Jeduthun for the ministry of prophesying with lyres, harps and cymbals."',
    56, pw - 36
  );

  goldDivider(doc, 90);

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  setColor(doc, GOLD);
  centeredText(doc, "With Asaph and Heman,", 102);
  centeredText(doc, "he tuned the strings.", 110);
  centeredText(doc, "Not for show. For the Ark.", 118);

  doc.setFont("times", "italic");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  centeredText(doc, "He didn\u2019t just play.", 135);
  centeredText(doc, "He ordered. He tuned. He guarded.", 143);

  // --- Page 5: The Shofar Test ---
  addPage(doc);
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  setColor(doc, PURPLE);
  centeredText(doc, "The Shofar Test", 30);

  goldDivider(doc, 38);

  doc.setFont("times", "italic");
  doc.setFontSize(8);
  setColor(doc, { r: 120, g: 100, b: 70 });
  centeredText(doc, "No verse. Just law.", 50);

  goldDivider(doc, 60);

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  setColor(doc, GOLD);
  centeredText(doc, "One blast: holy.", 75);
  centeredText(doc, "One silence: unholy.", 85);
  centeredText(doc, "No middle note.", 95);

  // --- Page 6: Why Now? ---
  addPage(doc);
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  setColor(doc, PURPLE);
  centeredText(doc, "Why Now?", 30);

  goldDivider(doc, 38);

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  setColor(doc, DARK_INK);
  centeredText(doc, "The calf is back.", 55);
  centeredText(doc, "The Ark is quiet.", 65);

  goldDivider(doc, 80);

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  setColor(doc, GOLD);
  centeredText(doc, "Gad didn\u2019t die.", 95);
  centeredText(doc, "He waited.", 105);

  // --- Page 7: How to Use the App ---
  addPage(doc);
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  setColor(doc, PURPLE);
  centeredText(doc, "How to Use the App", 30);

  goldDivider(doc, 38);

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  setColor(doc, DARK_INK);
  centeredText(doc, "Upload.", 58);
  centeredText(doc, "Wait thirty seconds.", 70);
  centeredText(doc, "Listen.", 82);

  goldDivider(doc, 98);

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  setColor(doc, GOLD);
  centeredText(doc, "Gad doesn\u2019t guess.", 112);
  centeredText(doc, "The strings do.", 120);

  // --- Page 8: If You Get the Seal ---
  addPage(doc);
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  setColor(doc, PURPLE);
  centeredText(doc, "If You Get the Seal", 30);

  goldDivider(doc, 38);

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  setColor(doc, DARK_INK);
  centeredText(doc, "Print it.", 55);
  centeredText(doc, "Frame it.", 65);
  centeredText(doc, "Play it in the house.", 75);

  goldDivider(doc, 90);

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  setColor(doc, GOLD);
  centeredText(doc, "God heard.", 105);
  centeredText(doc, "You\u2019re covered.", 115);

  // --- Page 9: If You Don't ---
  addPage(doc);
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  setColor(doc, PURPLE);
  centeredText(doc, "If You Don\u2019t", 30);

  goldDivider(doc, 38);

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  setColor(doc, DARK_INK);
  centeredText(doc, "He turned the horn away.", 55);

  goldDivider(doc, 70);

  doc.setFont("times", "italic");
  doc.setFontSize(11);
  setColor(doc, GOLD);
  centeredText(doc, "Not anger.", 85);
  centeredText(doc, "Warning.", 95);
  centeredText(doc, "Tune again.", 105);

  // --- Page 10: The Strings Still Hum ---
  addPage(doc);
  drawBorder(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  setColor(doc, PURPLE);
  centeredText(doc, "The Strings Still Hum", 30);

  goldDivider(doc, 38);

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  setColor(doc, GOLD);
  centeredText(doc, '"Upload. Listen. Decide.', 60);
  centeredText(doc, 'The strings know."', 72);

  goldDivider(doc, 90);

  doc.setFont("times", "italic");
  doc.setFontSize(9);
  setColor(doc, DARK_INK);
  centeredText(doc, "End.", 105);

  doc.setFont("times", "normal");
  doc.setFontSize(7);
  setColor(doc, { r: 140, g: 120, b: 80 });
  centeredText(doc, "No price. No ads. Just truth.", 170);
  centeredText(doc, "GAD'S TUNE \u2014 Temple, Tabernacle, Tone", 176);

  doc.save("Gads-Tune-The-Prophet-Who-Tuned-Heaven.pdf");
}
