import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertInchesToTwip,
  Header,
  Footer,
  PageNumber
} from 'docx';
import type { Workflow } from '../../types';

// Convert Base64 data URL to Uint8Array for docx ImageRun
function base64ToUint8Array(base64: string): Uint8Array {
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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

export async function exportToWord(workflow: Workflow): Promise<void> {
  const children: any[] = [];

  // --- 1. COVER / HEADER SECTION ---
  children.push(
    new Paragraph({
      text: workflow.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
      spacing: { before: 100, after: 120 }
    })
  );

  if (workflow.description) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: workflow.description,
            italics: true,
            color: '475569',
            size: 22
          })
        ],
        spacing: { after: 200 }
      })
    );
  }

  // Metadata Table
  const dateFormatted = new Date(workflow.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createMetaCell('TOTAL LANGKAH', `${workflow.steps.length} Langkah`),
            createMetaCell('TANGGAL', dateFormatted)
          ]
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 350 },
      children: [
        new TextRun({
          text: '—'.repeat(55),
          color: 'E2E8F0',
          size: 16
        })
      ]
    })
  );

  // --- 2. STEP ITEMS (Clean layout: Teks di atas, Gambar di bawah proporsional) ---
  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];
    const rawImageSource = step.annotatedScreenshot || step.screenshot;

    // Step Header Badge & Title
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 80 },
        children: [
          new TextRun({
            text: `LANGKAH ${i + 1} :  `,
            bold: true,
            color: 'FF5C35',
            size: 22
          }),
          new TextRun({
            text: step.title,
            bold: true,
            color: '0F172A',
            size: 26
          })
        ]
      })
    );

    // Step Description
    if (step.description) {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: step.description,
              size: 21,
              color: '334155'
            })
          ]
        })
      );
    }

    // Callout Box (if present)
    if (step.callout && step.callout.type !== 'none' && step.callout.text) {
      const type = step.callout.type;
      const calloutTitle =
        type === 'tip'
          ? 'TIPS'
          : type === 'warning'
          ? 'PERHATIAN'
          : 'INFORMASI';
      const borderColor = type === 'warning' ? 'D97706' : type === 'tip' ? '059669' : '2563EB';
      const bgColor = type === 'warning' ? 'FEF3C7' : type === 'tip' ? 'ECFDF5' : 'EFF6FF';

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: bgColor },
                  margins: { top: 120, bottom: 120, left: 180, right: 180 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: `[${calloutTitle}]  `, bold: true, color: borderColor, size: 20 }),
                        new TextRun({ text: step.callout.text, size: 20, color: '1E293B' })
                      ]
                    })
                  ],
                  borders: {
                    left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
                    top: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE }
                  }
                })
              ]
            })
          ]
        }),
        new Paragraph({ spacing: { after: 140 } })
      );
    }

    // Embed Screenshot (Fitted to page width with natural aspect ratio)
    if (rawImageSource) {
      try {
        const dataUrl = await ensureDataUrl(rawImageSource);
        const dimensions = await getImageDimensions(dataUrl);
        const fitted = fitDimensions(dimensions.width, dimensions.height, 510, 320);
        const imageBytes = base64ToUint8Array(dataUrl);

        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 240 },
            children: [
              new ImageRun({
                data: imageBytes,
                transformation: {
                  width: fitted.width,
                  height: fitted.height
                },
                type: 'png'
              })
            ]
          })
        );
      } catch (e) {
        console.error('Failed to embed image in docx:', e);
      }
    }

    // Divider between steps
    if (i < workflow.steps.length - 1) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 180 },
          children: [
            new TextRun({
              text: '· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·',
              color: 'CBD5E1',
              size: 14
            })
          ],
          alignment: AlignmentType.CENTER
        })
      );
    }
  }

  // Document Structure with Header & Footer
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8)
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `StepFlow  •  ${workflow.title}`,
                    size: 16,
                    color: '94A3B8'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Halaman ', size: 16, color: '94A3B8' }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: '94A3B8'
                  }),
                  new TextRun({ text: ' dari ', size: 16, color: '94A3B8' }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: '94A3B8'
                  })
                ]
              })
            ]
          })
        },
        children
      }
    ]
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${workflow.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

// Helper to construct clean metadata cell
function createMetaCell(label: string, value: string): TableCell {
  return new TableCell({
    shading: { fill: 'F8FAFC' },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: `${label}\n`, bold: true, size: 16, color: '64748B' }),
          new TextRun({ text: value, bold: true, size: 18, color: '0F172A' })
        ]
      })
    ],
    borders: {
      left: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
    }
  });
}
