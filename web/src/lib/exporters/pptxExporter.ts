import pptxgen from 'pptxgenjs';
import type { Workflow } from '../../types';

export async function exportToPptx(workflow: Workflow): Promise<void> {
  const pres = new pptxgen();

  // Modern 16:9 Widescreen Layout (13.333" x 7.5")
  pres.layout = 'LAYOUT_WIDE';

  // --- SLIDE 1: COVER SLIDE ---
  const coverSlide = pres.addSlide();
  coverSlide.background = { color: '0F172A' }; // Slate 900 dark background

  // Title
  coverSlide.addText(workflow.title, {
    x: 1.0,
    y: 2.0,
    w: 11.333,
    h: 1.8,
    fontSize: 32,
    bold: true,
    color: 'FFFFFF',
    fontFace: 'Arial',
    valign: 'top',
    wrap: true
  });

  // Description & Subtitle
  coverSlide.addText(
    workflow.description || 'Panduan Penggunaan Langkah demi Langkah',
    {
      x: 1.0,
      y: 4.0,
      w: 11.333,
      h: 1.0,
      fontSize: 15,
      color: '94A3B8',
      fontFace: 'Arial',
      valign: 'top',
      wrap: true
    }
  );

  // Metadata Footer
  coverSlide.addText(
    `Dibuat: ${new Date(workflow.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}  •  Total: ${workflow.steps.length} Langkah`,
    {
      x: 1.0,
      y: 6.2,
      w: 11.333,
      h: 0.4,
      fontSize: 11,
      color: '64748B',
      fontFace: 'Arial'
    }
  );

  // --- SLIDE 2..N: STEP SLIDES (Layout: Teks di atas, Gambar di bawah) ---
  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];
    const imageSource = step.annotatedScreenshot || step.screenshot;
    const slide = pres.addSlide();
    slide.background = { color: 'FFFFFF' };

    // 1. Step Pill Badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.7,
      y: 0.35,
      w: 2.2,
      h: 0.32,
      rectRadius: 0.16,
      fill: { color: 'FF5C35' }
    });
    slide.addText(`LANGKAH ${i + 1} DARI ${workflow.steps.length}`, {
      x: 0.7,
      y: 0.35,
      w: 2.2,
      h: 0.32,
      fontSize: 9,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle',
      fontFace: 'Arial'
    });

    // 2. Page Title / Breadcrumb (Top Right)
    if (step.pageTitle || workflow.title) {
      slide.addText(step.pageTitle || workflow.title, {
        x: 6.0,
        y: 0.35,
        w: 6.633,
        h: 0.32,
        fontSize: 10,
        color: '94A3B8',
        align: 'right',
        valign: 'middle',
        fontFace: 'Arial'
      });
    }

    // 3. Step Title (Prominent Heading above image)
    slide.addText(step.title, {
      x: 0.7,
      y: 0.75,
      w: 11.933,
      h: 0.55,
      fontSize: 20,
      bold: true,
      color: '0F172A',
      fontFace: 'Arial',
      valign: 'middle',
      wrap: true
    });

    // 4. Step Description & Callout (if any)
    const hasCallout = Boolean(step.callout && step.callout.type !== 'none' && step.callout.text);

    if (step.description) {
      slide.addText(step.description, {
        x: 0.7,
        y: 1.35,
        w: hasCallout ? 8.2 : 11.933,
        h: 0.45,
        fontSize: 12,
        color: '475569',
        fontFace: 'Arial',
        valign: 'top',
        wrap: true
      });
    }

    if (hasCallout && step.callout) {
      const calloutType = step.callout.type.toUpperCase();
      const isTip = calloutType === 'TIP';
      const isWarning = calloutType === 'WARNING';
      const calloutColor = isWarning ? 'D97706' : isTip ? '059669' : '2563EB';
      const calloutBg = isWarning ? 'FEF3C7' : isTip ? 'D1FAE5' : 'EFF6FF';

      const calloutX = step.description ? 9.2 : 0.7;
      const calloutY = 1.3;
      const calloutW = step.description ? 3.433 : 11.933;

      slide.addShape(pres.ShapeType.roundRect, {
        x: calloutX,
        y: calloutY,
        w: calloutW,
        h: 0.48,
        rectRadius: 0.08,
        fill: { color: calloutBg },
        line: { color: calloutColor, width: 1 }
      });
      slide.addText(`${calloutType}: ${step.callout.text}`, {
        x: calloutX + 0.12,
        y: calloutY,
        w: calloutW - 0.24,
        h: 0.48,
        fontSize: 9.5,
        bold: true,
        color: calloutColor,
        valign: 'middle',
        fontFace: 'Arial'
      });
    }

    // 5. Screenshot Area (Directly UNDER the text, contained and centered)
    if (imageSource) {
      try {
        const isBase64 = imageSource.startsWith('data:image');
        slide.addImage({
          ...(isBase64 ? { data: imageSource } : { path: imageSource }),
          x: 0.7,
          y: 1.95,
          w: 11.933,
          h: 4.95,
          sizing: { type: 'contain', w: 11.933, h: 4.95 }
        });
      } catch (err) {
        console.error('Failed to embed slide image:', err);
      }
    }

    // 6. Slide Footer Bar
    slide.addText(`StepFlow  •  ${workflow.title}`, {
      x: 0.7,
      y: 7.02,
      w: 8.0,
      h: 0.3,
      fontSize: 9,
      color: '94A3B8',
      valign: 'middle',
      fontFace: 'Arial'
    });
    slide.addText(`${i + 1} / ${workflow.steps.length}`, {
      x: 10.0,
      y: 7.02,
      w: 2.633,
      h: 0.3,
      fontSize: 9,
      color: '94A3B8',
      align: 'right',
      valign: 'middle',
      fontFace: 'Arial'
    });
  }

  // --- FINAL SLIDE ---
  const endSlide = pres.addSlide();
  endSlide.background = { color: '0F172A' };

  endSlide.addShape(pres.ShapeType.roundRect, {
    x: 5.766,
    y: 2.2,
    w: 1.8,
    h: 0.35,
    rectRadius: 0.17,
    fill: { color: '10B981' }
  });
  endSlide.addText('SELESAI', {
    x: 5.766,
    y: 2.2,
    w: 1.8,
    h: 0.35,
    fontSize: 10,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle',
    fontFace: 'Arial'
  });

  endSlide.addText('Tutorial Selesai', {
    x: 1.0,
    y: 2.8,
    w: 11.333,
    h: 1.0,
    fontSize: 36,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    fontFace: 'Arial'
  });
  endSlide.addText('Seluruh langkah alur kerja telah didokumentasikan dengan sukses.', {
    x: 1.0,
    y: 3.9,
    w: 11.333,
    h: 0.6,
    fontSize: 15,
    color: '94A3B8',
    align: 'center',
    fontFace: 'Arial'
  });

  // Save PPTX
  const fileName = `${workflow.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pptx`;
  await pres.writeFile({ fileName });
}
