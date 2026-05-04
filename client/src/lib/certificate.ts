import { jsPDF } from "jspdf";

export function generateCertificate(userName: string) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(255, 253, 240);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setDrawColor(0, 107, 143);
  doc.setLineWidth(3);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(184, 155, 40);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  const goldR = 184, goldG = 155, goldB = 40;

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(goldR, goldG, goldB);
  doc.text("GAD'S TUNE \u2014 Temple, Tabernacle, Tone", pageWidth / 2, 28, {
    align: "center",
  });

  doc.setLineWidth(0.3);
  doc.setDrawColor(goldR, goldG, goldB);
  doc.line(60, 34, pageWidth - 60, 34);

  doc.setFont("times", "bold");
  doc.setFontSize(32);
  doc.setTextColor(goldR, goldG, goldB);
  doc.text("SEAL OF APPROVAL", pageWidth / 2, 55, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.setTextColor(80, 60, 30);
  doc.text("Presented to:", pageWidth / 2, 72, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(goldR, goldG, goldB);
  doc.text(userName.toUpperCase(), pageWidth / 2, 88, { align: "center" });

  doc.setLineWidth(0.5);
  doc.setDrawColor(goldR, goldG, goldB);
  doc.line(80, 94, pageWidth - 80, 94);

  doc.setFont("times", "italic");
  doc.setFontSize(16);
  doc.setTextColor(80, 60, 30);
  doc.text("THIS SONG WAS FOUND PLEASING IN THE TABERNACLE.", pageWidth / 2, 110, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.setTextColor(106, 55, 120);
  doc.text("Approved by: Prophet Gad, Minister of Music", pageWidth / 2, 125, {
    align: "center",
  });
  doc.text("Under the Authority of King David", pageWidth / 2, 133, {
    align: "center",
  });

  doc.setLineWidth(0.3);
  doc.setDrawColor(goldR, goldG, goldB);
  doc.line(60, 142, pageWidth - 60, 142);

  const sealX = pageWidth / 2;
  const sealY = 160;
  doc.setDrawColor(180, 40, 40);
  doc.setFillColor(180, 40, 40);
  doc.circle(sealX, sealY, 12, "F");
  doc.setFillColor(200, 60, 60);
  doc.circle(sealX, sealY, 10, "F");

  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 253, 240);
  doc.text("APPROVED", sealX, sealY - 1, { align: "center" });
  doc.setFontSize(6);
  doc.text("BY GAD", sealX, sealY + 3, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(goldR, goldG, goldB);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Date: ${today}`, pageWidth / 2, 182, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(106, 55, 120);
  doc.text("Tone Verified. Glory Confirmed.", pageWidth / 2, 190, {
    align: "center",
  });

  doc.save(`Gads-Tune-Seal-of-Approval-${userName}.pdf`);
}
