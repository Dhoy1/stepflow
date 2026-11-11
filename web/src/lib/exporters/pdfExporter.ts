import { jsPDF } from 'jspdf';
import type { Workflow } from '../../types';

// Convert any image URL (remote or data URL) to base64 data URL
async function ensureDataUrl(src: string): Promise<string> {
  if (src.startsWith('data:image')) return src;
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return src;
  }
}

// Get natural dimensions of image
function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width || 800,
        height: img.naturalHeight || img.height || 450
      });
    };
    img.onerror = () => {
      resolve({ width: 800, height: 450 });
    };
    img.src = src;
  });
}

// Calculate fitted dimensions preserving aspect ratio
function fitDimensions(origW: number, origH: number, maxW: number, maxH: number) {
  const aspect = origW / origH;
  let w = maxW;
  let h = w / aspect;
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }
  return { width: Math.round(w), height: Math.round(h) };
}

export async function exportToPdf(workflow: Workflow): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  function ensurePageSpace(neededHeight: number) {
    if (cursorY + neededHeight > pageHeight - 16) {
      doc.addPage();
      cursorY = margin;
      return true;
    }
    return false;
  }

  // --- 1. COVER / HEADER SECTION ---
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // #0F172A
  const splitTitle = doc.splitTextToSize(workflow.title, contentWidth);
  doc.text(splitTitle, margin, cursorY + 2);
  cursorY += splitTitle.length * 8 + 2;

  // Description
  if (workflow.description) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // #475569
    const splitDesc = doc.splitTextToSize(workflow.description, contentWidth);
    doc.text(splitDesc, margin, cursorY);
    cursorY += splitDesc.length * 5 + 4;
  }

  // Metadata Chips
  doc.setFontSize(8.5);
  const dateFormatted = new Date(workflow.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Metadata Pill Background
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 8, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL:', margin + 6, cursorY + 5.2);
  doc.setTextColor(15, 23, 42);
  doc.text(`${workflow.steps.length} Langkah`, margin + 20, cursorY + 5.2);

  doc.setTextColor(100, 116, 139);
  doc.text('TANGGAL:', margin + 70, cursorY + 5.2);
  doc.setTextColor(15, 23, 42);
  doc.text(dateFormatted, margin + 88, cursorY + 5.2);

  cursorY += 14;

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 8;

  // --- 2. STEP ITEMS (Teks di atas, Gambar di bawah proporsional) ---
  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];
    const rawImageSource = step.annotatedScreenshot || step.screenshot;

    // Pre-calculate image dimension and total step height
    let dataUrl: string | null = null;
    let fittedImgW = contentWidth;
    let fittedImgH = 80;

    if (rawImageSource) {
      try {
        dataUrl = await ensureDataUrl(rawImageSource);
        const dims = await getImageDimensions(dataUrl);
        const fitted = fitDimensions(dims.width, dims.height, contentWidth, 95);
        fittedImgW = fitted.width;
        fittedImgH = fitted.height;
      } catch (err) {
        console.error('Failed to prepare step image:', err);
      }
    }

    // Estimate step height: Header (10) + Title (8) + Desc (10) + Callout (10) + Image (fittedImgH)
    const estimatedHeight = 28 + (step.description ? 10 : 0) + (dataUrl ? fittedImgH + 8 : 0);
    ensurePageSpace(estimatedHeight);

    // Step Number Badge (Pill)
    doc.setFillColor(255, 92, 53); // #FF5C35
    doc.roundedRect(margin, cursorY - 1, 24, 5.5, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`LANGKAH ${i + 1}`, margin + 2.5, cursorY + 3);

    // Step Title (Beside badge)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    const splitStepTitle = doc.splitTextToSize(step.title, contentWidth - 28);
    doc.text(splitStepTitle, margin + 27, cursorY + 3.2);
    cursorY += Math.max(6, splitStepTitle.length * 5) + 3;

    // Step Description
    if (step.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const splitStepDesc = doc.splitTextToSize(step.description, contentWidth);
      doc.text(splitStepDesc, margin, cursorY + 1);
      cursorY += splitStepDesc.length * 4.5 + 4;
    }

    // Callout Box (if present)
    if (step.callout && step.callout.type !== 'none' && step.callout.text) {
      const type = step.callout.type;
      const isWarn = type === 'warning';
      const isTip = type === 'tip';
      const calloutTitle = isWarn ? 'PERHATIAN' : isTip ? 'TIPS' : 'INFORMASI';

      const bgR = isWarn ? 254 : isTip ? 236 : 239;
      const bgG = isWarn ? 243 : isTip ? 253 : 246;
      const bgB = isWarn ? 199 : isTip ? 245 : 255;

      const lineR = isWarn ? 217 : isTip ? 5 : 37;
      const lineG = isWarn ? 119 : isTip ? 150 : 99;
      const lineB = isWarn ? 6 : isTip ? 105 : 235;

      doc.setFillColor(bgR, bgG, bgB);
      doc.setDrawColor(lineR, lineG, lineB);
      doc.roundedRect(margin, cursorY, contentWidth, 7.5, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(lineR, lineG, lineB);
      doc.text(`[${calloutTitle}]  ${step.callout.text}`, margin + 3, cursorY + 4.8, {
        maxWidth: contentWidth - 6
      });
      cursorY += 10.5;
    }

    // Embed Screenshot (Centered & Aspect-Ratio Preserved)
    if (dataUrl) {
      try {
        const imgX = margin + (contentWidth - fittedImgW) / 2;

        // Subtle frame around image
        doc.setDrawColor(226, 232, 240);
        doc.rect(imgX - 0.5, cursorY - 0.5, fittedImgW + 1, fittedImgH + 1, 'S');

        // Draw image
        doc.addImage(dataUrl, 'PNG', imgX, cursorY, fittedImgW, fittedImgH, undefined, 'FAST');
        cursorY += fittedImgH + 8;
      } catch (err) {
        console.error('Failed to draw PDF image:', err);
      }
    }

    // Small divider between steps
    if (i < workflow.steps.length - 1) {
      cursorY += 2;
      doc.setDrawColor(241, 245, 249);
      doc.line(margin + 20, cursorY, pageWidth - margin - 20, cursorY);
      cursorY += 6;
    }
  }

  // --- 3. FOOTER ON ALL PAGES ---
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Top border of footer
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // #94A3B8

    // Left title
    doc.text(`StepFlow  •  ${workflow.title}`, margin, pageHeight - 6.5);

    // Right page number
    doc.text(`Halaman ${p} dari ${totalPages}`, pageWidth - margin, pageHeight - 6.5, {
      align: 'right'
    });
  }

  // Download PDF
  const fileName = `${workflow.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(fileName);
}
