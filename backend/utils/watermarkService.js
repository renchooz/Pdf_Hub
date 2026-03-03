import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';

export const addWatermarkToPdfBuffer = async (pdfBuffer, { adminEmail, studentEmail }) => {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const watermarkText = `${adminEmail} | ${studentEmail}`;

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const fontSize = 24;
    const opacity = 0.15;
    const rotate = { type: 'degrees', angle: -30 };

    const xGap = 200;
    const yGap = 150;

    for (let x = -width; x < width * 2; x += xGap) {
      for (let y = -height; y < height * 2; y += yGap) {
        page.drawText(watermarkText, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.8, 0.8, 0.8),
          opacity,
          rotate,
        });
      }
    }
  });

  const modifiedPdfBytes = await pdfDoc.save();
  return Buffer.from(modifiedPdfBytes);
};

