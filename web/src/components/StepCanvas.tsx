'use client';
import React, { useRef, useEffect, useState } from 'react';
import {
  Square,
  Crop,
  EyeOff,
  RotateCcw,
  Check,
  X,
  Trash2,
  Move,
  ArrowUpRight,
  CircleDot,
  Upload,
  ClipboardPaste,
  Plus,
  Minus,
  Undo2,
  Redo2
} from 'lucide-react';
import type { Step, BlurRegion, HighlightConfig, ArrowAnnotation, NumberBadge } from '../types';

export interface CanvasSnapshot {
  screenshot: string;
  originalScreenshot?: string;
  annotatedScreenshot?: string;
  highlights: HighlightConfig[];
  numberBadges: NumberBadge[];
  blurRegions: BlurRegion[];
  arrows: ArrowAnnotation[];
}

export interface StepHistoryEntry {
  history: CanvasSnapshot[];
  index: number;
}

interface StepCanvasProps {
  step: Step;
  onUpdateStep: (updated: Partial<Step>) => void;
  historyCache?: React.MutableRefObject<Map<string, StepHistoryEntry>>;
}

type ToolMode = 'none' | 'highlight' | 'crop' | 'blur' | 'arrow' | 'badge';
type HandleType = 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w';
type DragModeType = HandleType | 'new' | 'new-arrow' | 'arrow-start' | 'arrow-end' | 'arrow-move' | 'badge-move' | 'badge-resize' | null;

const HIGHLIGHT_COLORS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#FF5C35' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' }
];

export const StepCanvas: React.FC<StepCanvasProps> = ({ step, onUpdateStep, historyCache }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Default tool is 'none' so the cursor is standard arrow, not stuck on crosshair
  const [activeTool, setActiveTool] = useState<ToolMode>('none');
  const [selectedColor, setSelectedColor] = useState('#EF4444');

  // Selection states
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [selectedArrowId, setSelectedArrowId] = useState<string | null>(null);

  // Dragging & Interaction State
  const [dragMode, setDragMode] = useState<DragModeType>(null);
  const [badgeResizeHandle, setBadgeResizeHandle] = useState<HandleType | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [initialBox, setInitialBox] = useState<HighlightConfig | null>(null);
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [initialBadge, setInitialBadge] = useState<NumberBadge | null>(null);
  const [initialArrow, setInitialArrow] = useState<ArrowAnnotation | null>(null);
  const [currentArrow, setCurrentArrow] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [cropSelection, setCropSelection] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [hoverCursor, setHoverCursor] = useState<string>('default');

  const [imgLoaded, setImgLoaded] = useState(false);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const stepIdRef = useRef(step.id);
  stepIdRef.current = step.id;

  // Helpers to get normalized highlights and badges
  const getHighlights = (): HighlightConfig[] => {
    if (step.highlights && step.highlights.length > 0) {
      return step.highlights;
    }
    if (step.highlight && step.highlight.width > 0) {
      return [{ ...step.highlight, id: step.highlight.id || 'hl_legacy' }];
    }
    return [];
  };

  const getBadges = (): NumberBadge[] => {
    return step.numberBadges || [];
  };

  // History Stack for Undo / Redo (including Photo Replacement)
  const historyRef = useRef<CanvasSnapshot[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateUndoRedoAvailability = () => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const syncToCache = (newHistory: CanvasSnapshot[], newIndex: number) => {
    if (historyCache?.current) {
      historyCache.current.set(step.id, {
        history: newHistory,
        index: newIndex
      });
    }
  };

  const captureCurrentSnapshot = (): CanvasSnapshot => ({
    screenshot: step.screenshot || '',
    originalScreenshot: step.originalScreenshot || step.screenshot || '',
    annotatedScreenshot: step.annotatedScreenshot || '',
    highlights: JSON.parse(JSON.stringify(getHighlights())),
    numberBadges: JSON.parse(JSON.stringify(getBadges())),
    blurRegions: JSON.parse(JSON.stringify(step.blurRegions || [])),
    arrows: JSON.parse(JSON.stringify(step.arrows || []))
  });

  const pushNewSnapshot = (nextSnapshot: CanvasSnapshot) => {
    if (historyRef.current.length === 0) {
      const snap = captureCurrentSnapshot();
      historyRef.current = [snap];
      historyIndexRef.current = 0;
      syncToCache([snap], 0);
    }

    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    const nextHistory = currentHistory.slice(0, currentIndex + 1);
    nextHistory.push(JSON.parse(JSON.stringify(nextSnapshot)));
    if (nextHistory.length > 50) {
      nextHistory.shift();
    }
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    syncToCache(nextHistory, nextHistory.length - 1);
    updateUndoRedoAvailability();
  };

  const handleUndo = () => {
    if (historyIndexRef.current <= 0) return;
    const nextIndex = historyIndexRef.current - 1;
    const targetSnap = historyRef.current[nextIndex];
    if (!targetSnap) return;

    historyIndexRef.current = nextIndex;
    syncToCache(historyRef.current, nextIndex);
    updateUndoRedoAvailability();

    onUpdateStep({
      screenshot: targetSnap.screenshot,
      originalScreenshot: targetSnap.originalScreenshot,
      annotatedScreenshot: targetSnap.annotatedScreenshot,
      highlights: targetSnap.highlights,
      highlight: targetSnap.highlights[0] || undefined,
      numberBadges: targetSnap.numberBadges,
      blurRegions: targetSnap.blurRegions,
      arrows: targetSnap.arrows
    });

    setSelectedBoxId(null);
    setSelectedBadgeId(null);
    setSelectedArrowId(null);
  };

  const handleRedo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    const nextIndex = historyIndexRef.current + 1;
    const targetSnap = historyRef.current[nextIndex];
    if (!targetSnap) return;

    historyIndexRef.current = nextIndex;
    syncToCache(historyRef.current, nextIndex);
    updateUndoRedoAvailability();

    onUpdateStep({
      screenshot: targetSnap.screenshot,
      originalScreenshot: targetSnap.originalScreenshot,
      annotatedScreenshot: targetSnap.annotatedScreenshot,
      highlights: targetSnap.highlights,
      highlight: targetSnap.highlights[0] || undefined,
      numberBadges: targetSnap.numberBadges,
      blurRegions: targetSnap.blurRegions,
      arrows: targetSnap.arrows
    });

    setSelectedBoxId(null);
    setSelectedBadgeId(null);
    setSelectedArrowId(null);
  };

  // Restore from cache or initialize history on step change
  const currentStepIdForHistory = useRef(step.id);
  useEffect(() => {
    currentStepIdForHistory.current = step.id;
    const cached = historyCache?.current.get(step.id);
    if (cached && cached.history && cached.history.length > 0) {
      historyRef.current = cached.history;
      historyIndexRef.current = cached.index;
      updateUndoRedoAvailability();
    } else {
      const initialSnap = captureCurrentSnapshot();
      historyRef.current = [initialSnap];
      historyIndexRef.current = 0;
      syncToCache([initialSnap], 0);
      updateUndoRedoAvailability();
    }
  }, [step.id]);

  // Load screenshot into memory safely
  useEffect(() => {
    let isCurrent = true;
    setImgLoaded(false);
    imageObjRef.current = null;
    setSelectedBoxId(null);
    setSelectedBadgeId(null);
    setSelectedArrowId(null);
    setCropSelection(null);

    // Immediately clear canvas so no leftover image from previous step shows
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const sourceImage = step.screenshot || step.originalScreenshot;
    if (!sourceImage) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceImage;
    img.onload = () => {
      if (!isCurrent || stepIdRef.current !== step.id) return;
      imageObjRef.current = img;
      setImgLoaded(true);
      renderCanvasWithImg(img, step.id);
    };

    return () => {
      isCurrent = false;
    };
  }, [step.id, step.screenshot, step.originalScreenshot]);

  // Re-render when annotations, arrows, badges, or selection change
  useEffect(() => {
    if (imgLoaded && imageObjRef.current && stepIdRef.current === step.id) {
      renderCanvasWithImg(imageObjRef.current, step.id);
    }
  }, [
    step.blurRegions,
    step.highlight,
    step.highlights,
    step.numberBadges,
    step.arrows,
    selectedColor,
    imgLoaded,
    selectedBoxId,
    selectedBadgeId,
    selectedArrowId
  ]);

  // Global listener for clipboard Paste (Ctrl + V)
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
              const dataUrl = uploadEvent.target?.result as string;
              if (dataUrl) {
                const newSnap: CanvasSnapshot = {
                  screenshot: dataUrl,
                  originalScreenshot: dataUrl,
                  annotatedScreenshot: dataUrl,
                  highlights: [],
                  numberBadges: [],
                  blurRegions: [],
                  arrows: []
                };
                pushNewSnapshot(newSnap);
                onUpdateStep({
                  screenshot: dataUrl,
                  originalScreenshot: dataUrl,
                  annotatedScreenshot: dataUrl,
                  highlight: undefined,
                  highlights: [],
                  numberBadges: [],
                  blurRegions: [],
                  arrows: []
                });
                setSelectedBoxId(null);
                setSelectedBadgeId(null);
                setSelectedArrowId(null);
              }
            };
            reader.readAsDataURL(file);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [step.id]);

  // Handle keyboard shortcut (Ctrl + Z, Ctrl + Y, Delete / Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      // Undo: Ctrl + Z / Cmd + Z (or Redo if Shift is held)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }

      // Redo: Ctrl + Y / Cmd + Y
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedBadgeId) {
          handleDeleteBadge();
        } else if (selectedArrowId) {
          handleDeleteArrow();
        } else if (selectedBoxId) {
          handleDeleteBox();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBadgeId, selectedArrowId, selectedBoxId, step.highlights, step.highlight, step.numberBadges, step.arrows]);

  const renderCanvasWithImg = (img: HTMLImageElement, forStepId: string) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || stepIdRef.current !== forStepId) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    // 1. Draw base screenshot
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 2. Draw Blur / Redaction Regions
    if (step.blurRegions && step.blurRegions.length > 0) {
      for (const region of step.blurRegions) {
        applyPixelateOrBlur(ctx, region.x, region.y, region.width, region.height);
      }
    }

    // 3. Draw All Highlight Boxes
    const allBoxes = getHighlights();
    for (const h of allBoxes) {
      if (h.width <= 0) continue;
      const boxColor = h.color || selectedColor;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = Math.max(3, Math.round(canvas.width * 0.003));
      drawRoundedRect(ctx, h.x, h.y, h.width, h.height, 4);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Draw Arrows (Clean solid arrows pointing to target)
    if (step.arrows && step.arrows.length > 0) {
      for (const arrow of step.arrows) {
        drawArrow(
          ctx,
          arrow.startX,
          arrow.startY,
          arrow.endX,
          arrow.endY,
          arrow.color || selectedColor
        );
      }
    }

    // 5. Draw All Number Badges (clean state for baking)
    const allBadges = getBadges();
    for (const badge of allBadges) {
      const badgeColor = badge.color || selectedColor;
      drawNumberBadge(ctx, badge.x, badge.y, badge.number, badgeColor, badge.size);
    }

    // 6. BAKE ANNOTATED SCREENSHOT HERE (100% CLEAN - NO RESIZE HANDLES/DOTS IN PPT/PDF/DOCX!)
    if (stepIdRef.current === forStepId) {
      const cleanAnnotatedUrl = canvas.toDataURL('image/png');
      if (step.annotatedScreenshot !== cleanAnnotatedUrl) {
        onUpdateStep({ annotatedScreenshot: cleanAnnotatedUrl });
      }
    }

    // 7. DRAW 8 RESIZE HANDLES ONLY WHEN A BOX IS SELECTED FOR EDITING
    if (selectedBoxId) {
      const active = allBoxes.find((b) => b.id === selectedBoxId);
      if (active && active.width > 0) {
        drawResizeHandles(ctx, active.x, active.y, active.width, active.height, active.color || selectedColor);
      }
    }

    // 8. DRAW 8 RESIZE HANDLES ON ACTIVE NUMBER BADGE (Resizeable like the focus box!)
    if (selectedBadgeId) {
      const activeBadge = allBadges.find((b) => b.id === selectedBadgeId);
      if (activeBadge) {
        const defaultRadius = Math.max(16, Math.round(canvas.width * 0.014));
        const radius = activeBadge.size ? Math.round(activeBadge.size / 2) : defaultRadius;
        drawBadgeResizeHandles(ctx, activeBadge.x, activeBadge.y, radius, activeBadge.color || selectedColor);
      }
    }

    // 9. DRAW ARROW HANDLES ONLY WHEN ARROW IS SELECTED FOR EDITING
    if (selectedArrowId && step.arrows) {
      const selArrow = step.arrows.find((a) => a.id === selectedArrowId);
      if (selArrow) {
        drawArrowHandles(
          ctx,
          selArrow.startX,
          selArrow.startY,
          selArrow.endX,
          selArrow.endY,
          selArrow.color || selectedColor
        );
      }
    }
  };

  function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawNumberBadge(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    num: number,
    color: string,
    size?: number
  ) {
    const defaultRadius = Math.max(16, Math.round(ctx.canvas.width * 0.014));
    const radius = size ? Math.round(size / 2) : defaultRadius;
    ctx.save();

    // Solid filled circular badge
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Crisp white outline
    ctx.lineWidth = Math.max(2, Math.round(radius * 0.12));
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Crisp white bold number in center (scaled proportionally with radius)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(radius * 1.15)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), x, y + 1);

    ctx.restore();
  }

  function drawBadgeResizeHandles(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    color: string
  ) {
    ctx.save();
    const x = cx - radius;
    const y = cy - radius;
    const size = radius * 2;

    // Dashed bounding box
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(x, y, size, size);

    // 8 Handle points (nw, n, ne, e, se, s, sw, w) - exactly like the red focus box!
    const handleRadius = Math.max(5, Math.round(Math.min(size * 0.09, 8)));
    const points = [
      { x, y }, // nw
      { x: cx, y }, // n
      { x: x + size, y }, // ne
      { x: x + size, y: cy }, // e
      { x: x + size, y: y + size }, // se
      { x: cx, y: y + size }, // s
      { x, y: y + size }, // sw
      { x, y: cy } // w
    ];

    ctx.setLineDash([]);
    for (const pt of points) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, handleRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#3B82F6';
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawResizeHandles(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) {
    const handleRadius = Math.max(5, Math.round(w * 0.015));
    const points = [
      { x, y }, // nw
      { x: x + w / 2, y }, // n
      { x: x + w, y }, // ne
      { x: x + w, y: y + h / 2 }, // e
      { x: x + w, y: y + h }, // se
      { x: x + w / 2, y: y + h }, // s
      { x: x + w, y: y + h }, // sw
      { x: x, y: y + h / 2 } // w
    ];

    ctx.save();
    for (const pt of points) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, handleRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawArrow(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string
  ) {
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.hypot(dx, dy);
    if (len < 6) return;

    const angle = Math.atan2(dy, dx);
    const lineWidth = Math.max(4, Math.round(ctx.canvas.width * 0.0035));
    const headLen = Math.max(18, Math.round(ctx.canvas.width * 0.016));
    const headAngle = Math.PI / 6; // 30 degrees

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const shaftEndX = endX - headLen * 0.5 * Math.cos(angle);
    const shaftEndY = endY - headLen * 0.5 * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(shaftEndX, shaftEndY);
    ctx.stroke();

    const x1 = endX - headLen * Math.cos(angle - headAngle);
    const y1 = endY - headLen * Math.sin(angle - headAngle);
    const x2 = endX - headLen * Math.cos(angle + headAngle);
    const y2 = endY - headLen * Math.sin(angle + headAngle);
    const notchX = endX - headLen * 0.65 * Math.cos(angle);
    const notchY = endY - headLen * 0.65 * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(notchX, notchY);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawArrowHandles(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string
  ) {
    const r = Math.max(6, Math.round(ctx.canvas.width * 0.006));
    ctx.save();

    ctx.beginPath();
    ctx.arc(startX, startY, r, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(endX, endY, r + 1, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.restore();
  }

  function getArrowHitTest(
    x: number,
    y: number
  ): { arrow: ArrowAnnotation; type: 'arrow-start' | 'arrow-end' | 'arrow-move' } | null {
    if (!step.arrows || step.arrows.length === 0) return null;
    const tol = Math.max(14, Math.round((canvasRef.current?.width || 1000) * 0.014));

    for (let i = step.arrows.length - 1; i >= 0; i--) {
      const a = step.arrows[i];
      if (Math.hypot(x - a.endX, y - a.endY) <= tol) {
        return { arrow: a, type: 'arrow-end' };
      }
      if (Math.hypot(x - a.startX, y - a.startY) <= tol) {
        return { arrow: a, type: 'arrow-start' };
      }

      const dist = distanceToSegment(x, y, a.startX, a.startY, a.endX, a.endY);
      if (dist <= tol) {
        return { arrow: a, type: 'arrow-move' };
      }
    }
    return null;
  }

  function distanceToSegment(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function getBadgeHitTest(
    x: number,
    y: number
  ): { badge: NumberBadge; handle: HandleType } | null {
    const badges = getBadges();
    const defaultRadius = Math.max(16, Math.round((canvasRef.current?.width || 1000) * 0.014));

    // 1. If a badge is selected, test its 8 resize handles first
    if (selectedBadgeId) {
      const active = badges.find((b) => b.id === selectedBadgeId);
      if (active) {
        const radius = active.size ? Math.round(active.size / 2) : defaultRadius;
        const cx = active.x;
        const cy = active.y;
        const x0 = cx - radius;
        const y0 = cy - radius;
        const size = radius * 2;
        const tol = Math.max(10, Math.round(size * 0.16));

        if (Math.hypot(x - x0, y - y0) <= tol) return { badge: active, handle: 'nw' };
        if (Math.hypot(x - (x0 + size), y - y0) <= tol) return { badge: active, handle: 'ne' };
        if (Math.hypot(x - (x0 + size), y - (y0 + size)) <= tol) return { badge: active, handle: 'se' };
        if (Math.hypot(x - x0, y - (y0 + size)) <= tol) return { badge: active, handle: 'sw' };

        if (Math.hypot(x - cx, y - y0) <= tol) return { badge: active, handle: 'n' };
        if (Math.hypot(x - cx, y - (y0 + size)) <= tol) return { badge: active, handle: 's' };
        if (Math.hypot(x - x0, y - cy) <= tol) return { badge: active, handle: 'w' };
        if (Math.hypot(x - (x0 + size), y - cy) <= tol) return { badge: active, handle: 'e' };

        // Test inside the badge circle
        if (Math.hypot(x - cx, y - cy) <= radius + 4) {
          return { badge: active, handle: 'move' };
        }
      }
    }

    // 2. Otherwise test any badge circle (top to bottom)
    for (let i = badges.length - 1; i >= 0; i--) {
      const b = badges[i];
      const radius = b.size ? Math.round(b.size / 2) : defaultRadius;
      if (Math.hypot(x - b.x, y - b.y) <= radius + 4) {
        return { badge: b, handle: 'move' };
      }
    }
    return null;
  }

  function getBoxHitTest(x: number, y: number): { box: HighlightConfig; handle: HandleType } | null {
    const boxes = getHighlights();

    // 1. If a box is selected, test its resize handles first
    if (selectedBoxId) {
      const active = boxes.find((b) => b.id === selectedBoxId);
      if (active && active.width > 0) {
        const tol = Math.max(12, Math.round(active.width * 0.04));
        if (Math.hypot(x - active.x, y - active.y) <= tol) return { box: active, handle: 'nw' };
        if (Math.hypot(x - (active.x + active.width), y - active.y) <= tol) return { box: active, handle: 'ne' };
        if (Math.hypot(x - (active.x + active.width), y - (active.y + active.height)) <= tol) return { box: active, handle: 'se' };
        if (Math.hypot(x - active.x, y - (active.y + active.height)) <= tol) return { box: active, handle: 'sw' };

        if (Math.hypot(x - (active.x + active.width / 2), y - active.y) <= tol) return { box: active, handle: 'n' };
        if (Math.hypot(x - (active.x + active.width / 2), y - (active.y + active.height)) <= tol) return { box: active, handle: 's' };
        if (Math.hypot(x - active.x, y - (active.y + active.height / 2)) <= tol) return { box: active, handle: 'w' };
        if (Math.hypot(x - (active.x + active.width), y - (active.y + active.height / 2)) <= tol) return { box: active, handle: 'e' };

        if (x >= active.x && x <= active.x + active.width && y >= active.y && y <= active.y + active.height) {
          return { box: active, handle: 'move' };
        }
      }
    }

    // 2. Otherwise test inside any box (top to bottom)
    for (let i = boxes.length - 1; i >= 0; i--) {
      const b = boxes[i];
      if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) {
        return { box: b, handle: 'move' };
      }
    }

    return null;
  }

  function applyPixelateOrBlur(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    if (w <= 0 || h <= 0) return;
    try {
      const imgData = ctx.getImageData(x, y, w, h);
      const data = imgData.data;
      const pixelSize = Math.max(6, Math.round(w / 18));

      for (let py = 0; py < h; py += pixelSize) {
        for (let px = 0; px < w; px += pixelSize) {
          const idx = (py * w + px) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          for (let dy = 0; dy < pixelSize && py + dy < h; dy++) {
            for (let dx = 0; dx < pixelSize && px + dx < w; dx++) {
              const targetIdx = ((py + dy) * w + (px + dx)) * 4;
              data[targetIdx] = r;
              data[targetIdx + 1] = g;
              data[targetIdx + 2] = b;
            }
          }
        }
      }
      ctx.putImageData(imgData, x, y);

      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    } catch (e) {
      console.warn('Pixelate failed:', e);
    }
  }

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = canvasRef.current.width / rect.width;
    const x = Math.round((e.clientX - rect.left) * scale);
    const y = Math.round((e.clientY - rect.top) * scale);

    // 1. Tool mode: badge (Nomor Langkah)
    if (activeTool === 'badge') {
      const badges = getBadges();
      const usedNumbers = new Set(badges.map((b) => b.number));
      let nextNum = 1;
      while (usedNumbers.has(nextNum)) nextNum++;

      const newBadge: NumberBadge = {
        id: 'badge_' + Date.now(),
        x,
        y,
        number: nextNum,
        color: selectedColor
      };
      const updated = [...badges, newBadge];
      pushNewSnapshot({
        ...captureCurrentSnapshot(),
        numberBadges: updated
      });
      onUpdateStep({ numberBadges: updated });
      setSelectedBadgeId(newBadge.id);
      setSelectedBoxId(null);
      setSelectedArrowId(null);
      setActiveTool('none');
      return;
    }

    // 2. Tool mode: crop or blur
    if (activeTool === 'crop' || activeTool === 'blur') {
      setDragMode('new');
      setStartPos({ x, y });
      setCurrentBox({ x, y, w: 0, h: 0 });
      return;
    }

    // 3. Tool mode: highlight box
    if (activeTool === 'highlight') {
      setDragMode('new');
      setStartPos({ x, y });
      setCurrentBox({ x, y, w: 0, h: 0 });
      return;
    }

    // 4. Tool mode: arrow
    if (activeTool === 'arrow') {
      setDragMode('new-arrow');
      setStartPos({ x, y });
      setCurrentArrow({ startX: x, startY: y, endX: x, endY: y });
      return;
    }

    // 5. In normal mode ('none'):
    // Priority A: Check if clicked a badge
    const badgeHit = getBadgeHitTest(x, y);
    if (badgeHit) {
      setSelectedBadgeId(badgeHit.badge.id);
      setSelectedBoxId(null);
      setSelectedArrowId(null);
      setStartPos({ x, y });
      setInitialBadge({ ...badgeHit.badge });

      if (badgeHit.handle === 'move') {
        setDragMode('badge-move');
        setBadgeResizeHandle(null);
      } else {
        setDragMode('badge-resize');
        setBadgeResizeHandle(badgeHit.handle);
      }
      return;
    }

    // Priority B: Check if clicked an arrow
    const arrowHit = getArrowHitTest(x, y);
    if (arrowHit) {
      setSelectedArrowId(arrowHit.arrow.id);
      setSelectedBadgeId(null);
      setSelectedBoxId(null);
      setDragMode(arrowHit.type);
      setStartPos({ x, y });
      setInitialArrow({ ...arrowHit.arrow });
      return;
    }

    // Priority C: Check if clicked a highlight box
    const boxHit = getBoxHitTest(x, y);
    if (boxHit) {
      setSelectedBoxId(boxHit.box.id || 'box_0');
      setSelectedBadgeId(null);
      setSelectedArrowId(null);
      setDragMode(boxHit.handle);
      setStartPos({ x, y });
      setInitialBox({ ...boxHit.box });
      return;
    }

    // Clicked outside: deselect everything
    setSelectedBadgeId(null);
    setSelectedBoxId(null);
    setSelectedArrowId(null);
    setDragMode(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = canvasRef.current.width / rect.width;
    const currentX = Math.round((e.clientX - rect.left) * scale);
    const currentY = Math.round((e.clientY - rect.top) * scale);

    // Not dragging: update cursor based on hover
    if (!dragMode || !startPos) {
      if (
        activeTool === 'crop' ||
        activeTool === 'blur' ||
        activeTool === 'highlight' ||
        activeTool === 'arrow' ||
        activeTool === 'badge'
      ) {
        setHoverCursor('crosshair');
        return;
      }

      // Check badge hover
      const badgeHit = getBadgeHitTest(currentX, currentY);
      if (badgeHit) {
        if (badgeHit.badge.id === selectedBadgeId && badgeHit.handle !== 'move') {
          if (badgeHit.handle === 'nw' || badgeHit.handle === 'se') setHoverCursor('nwse-resize');
          else if (badgeHit.handle === 'ne' || badgeHit.handle === 'sw') setHoverCursor('nesw-resize');
          else if (badgeHit.handle === 'n' || badgeHit.handle === 's') setHoverCursor('ns-resize');
          else if (badgeHit.handle === 'e' || badgeHit.handle === 'w') setHoverCursor('ew-resize');
        } else {
          setHoverCursor('move');
        }
        return;
      }

      // Check arrow hover
      const arrowHit = getArrowHitTest(currentX, currentY);
      if (arrowHit) {
        if (arrowHit.type === 'arrow-start' || arrowHit.type === 'arrow-end') {
          setHoverCursor('crosshair');
        } else {
          setHoverCursor('move');
        }
        return;
      }

      // Check box hover
      const boxHit = getBoxHitTest(currentX, currentY);
      if (boxHit) {
        if (boxHit.box.id === selectedBoxId) {
          if (boxHit.handle === 'nw' || boxHit.handle === 'se') setHoverCursor('nwse-resize');
          else if (boxHit.handle === 'ne' || boxHit.handle === 'sw') setHoverCursor('nesw-resize');
          else if (boxHit.handle === 'n' || boxHit.handle === 's') setHoverCursor('ns-resize');
          else if (boxHit.handle === 'e' || boxHit.handle === 'w') setHoverCursor('ew-resize');
          else if (boxHit.handle === 'move') setHoverCursor('move');
        } else {
          setHoverCursor('pointer');
        }
        return;
      }

      setHoverCursor('default');
      return;
    }

    // Dragging: Handle Resize or Move
    const dx = currentX - startPos.x;
    const dy = currentY - startPos.y;

    // A. Dragging Badge Move
    if (dragMode === 'badge-move' && initialBadge) {
      const cw = canvasRef.current.width;
      const ch = canvasRef.current.height;
      const defaultRadius = Math.max(16, Math.round(cw * 0.014));
      const r = initialBadge.size ? Math.round(initialBadge.size / 2) : defaultRadius;
      const newX = Math.max(r, Math.min(cw - r, initialBadge.x + dx));
      const newY = Math.max(r, Math.min(ch - r, initialBadge.y + dy));
      const updated = getBadges().map((b) =>
        b.id === initialBadge.id ? { ...b, x: newX, y: newY } : b
      );
      onUpdateStep({ numberBadges: updated });
      return;
    }

    // A2. Dragging Badge Resize (Mengubah ukuran besar/kecil bulatan angka)
    if (dragMode === 'badge-resize' && initialBadge) {
      const dist = Math.hypot(currentX - initialBadge.x, currentY - initialBadge.y);
      const newSize = Math.round(Math.max(20, Math.min(220, dist * 2)));
      const updated = getBadges().map((b) =>
        b.id === initialBadge.id ? { ...b, size: newSize } : b
      );
      onUpdateStep({ numberBadges: updated });
      return;
    }

    // B. Drawing New Arrow
    if (dragMode === 'new-arrow') {
      setCurrentArrow({
        startX: startPos.x,
        startY: startPos.y,
        endX: currentX,
        endY: currentY
      });
      return;
    }

    // C. Dragging Arrow endpoints or shaft
    if (dragMode === 'arrow-start' && initialArrow) {
      const updatedArrows = (step.arrows || []).map((a) =>
        a.id === initialArrow.id ? { ...a, startX: initialArrow.startX + dx, startY: initialArrow.startY + dy } : a
      );
      onUpdateStep({ arrows: updatedArrows });
      return;
    }

    if (dragMode === 'arrow-end' && initialArrow) {
      const updatedArrows = (step.arrows || []).map((a) =>
        a.id === initialArrow.id ? { ...a, endX: initialArrow.endX + dx, endY: initialArrow.endY + dy } : a
      );
      onUpdateStep({ arrows: updatedArrows });
      return;
    }

    if (dragMode === 'arrow-move' && initialArrow) {
      const updatedArrows = (step.arrows || []).map((a) =>
        a.id === initialArrow.id
          ? {
              ...a,
              startX: initialArrow.startX + dx,
              startY: initialArrow.startY + dy,
              endX: initialArrow.endX + dx,
              endY: initialArrow.endY + dy
            }
          : a
      );
      onUpdateStep({ arrows: updatedArrows });
      return;
    }

    // D. Drawing New Box / Crop / Blur
    if (dragMode === 'new') {
      const x = Math.min(startPos.x, currentX);
      const y = Math.min(startPos.y, currentY);
      const w = Math.abs(currentX - startPos.x);
      const h = Math.abs(currentY - startPos.y);
      setCurrentBox({ x, y, w, h });
      return;
    }

    // E. Moving or Resizing a Highlight Box
    if (initialBox && selectedBoxId) {
      let { x, y, width, height } = initialBox;

      if (dragMode === 'move') {
        x += dx;
        y += dy;
      } else if (dragMode === 'se') {
        width = Math.max(20, initialBox.width + dx);
        height = Math.max(20, initialBox.height + dy);
      } else if (dragMode === 'e') {
        width = Math.max(20, initialBox.width + dx);
      } else if (dragMode === 's') {
        height = Math.max(20, initialBox.height + dy);
      } else if (dragMode === 'nw') {
        x = initialBox.x + dx;
        y = initialBox.y + dy;
        width = Math.max(20, initialBox.width - dx);
        height = Math.max(20, initialBox.height - dy);
      } else if (dragMode === 'ne') {
        y = initialBox.y + dy;
        width = Math.max(20, initialBox.width + dx);
        height = Math.max(20, initialBox.height - dy);
      } else if (dragMode === 'sw') {
        x = initialBox.x + dx;
        width = Math.max(20, initialBox.width - dx);
        height = Math.max(20, initialBox.height + dy);
      } else if (dragMode === 'n') {
        y = initialBox.y + dy;
        height = Math.max(20, initialBox.height - dy);
      } else if (dragMode === 'w') {
        x = initialBox.x + dx;
        width = Math.max(20, initialBox.width - dx);
      }

      const updatedBox: HighlightConfig = {
        ...initialBox,
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
        color: initialBox.color || selectedColor,
        style: 'border'
      };

      const updatedList = getHighlights().map((b) =>
        b.id === selectedBoxId ? updatedBox : b
      );
      onUpdateStep({
        highlights: updatedList,
        highlight: updatedList[0]
      });
    }
  };

  const handleMouseUp = () => {
    if (!dragMode) return;

    if (dragMode === 'new-arrow' && currentArrow) {
      const dist = Math.hypot(currentArrow.endX - currentArrow.startX, currentArrow.endY - currentArrow.startY);
      if (dist >= 15) {
        const newArrow: ArrowAnnotation = {
          id: 'arrow_' + Date.now(),
          startX: currentArrow.startX,
          startY: currentArrow.startY,
          endX: currentArrow.endX,
          endY: currentArrow.endY,
          color: selectedColor
        };
        const updated = [...(step.arrows || []), newArrow];
        pushNewSnapshot({
          ...captureCurrentSnapshot(),
          arrows: updated
        });
        onUpdateStep({ arrows: updated });
        setSelectedArrowId(newArrow.id);
        setSelectedBoxId(null);
        setSelectedBadgeId(null);
      }
      setCurrentArrow(null);
      setActiveTool('none');
    } else if (dragMode === 'new' && currentBox && currentBox.w > 15 && currentBox.h > 15) {
      if (activeTool === 'highlight') {
        const newBox: HighlightConfig = {
          id: 'box_' + Date.now(),
          x: currentBox.x,
          y: currentBox.y,
          width: currentBox.w,
          height: currentBox.h,
          color: selectedColor,
          style: 'border'
        };
        const updated = [...getHighlights(), newBox];
        pushNewSnapshot({
          ...captureCurrentSnapshot(),
          highlights: updated
        });
        onUpdateStep({
          highlights: updated,
          highlight: updated[0]
        });
        setSelectedBoxId(newBox.id || null);
        setSelectedBadgeId(null);
        setSelectedArrowId(null);
        setActiveTool('none');
      } else if (activeTool === 'blur') {
        const newRegion: BlurRegion = {
          id: 'blur_' + Date.now(),
          x: currentBox.x,
          y: currentBox.y,
          width: currentBox.w,
          height: currentBox.h
        };
        const updated = [...(step.blurRegions || []), newRegion];
        pushNewSnapshot({
          ...captureCurrentSnapshot(),
          blurRegions: updated
        });
        onUpdateStep({ blurRegions: updated });
        setActiveTool('none');
      } else if (activeTool === 'crop') {
        setCropSelection(currentBox);
      }
    } else if (
      dragMode === 'move' ||
      dragMode === 'nw' || dragMode === 'ne' || dragMode === 'se' || dragMode === 'sw' ||
      dragMode === 'n' || dragMode === 's' || dragMode === 'e' || dragMode === 'w' ||
      dragMode === 'badge-move' ||
      dragMode === 'badge-resize' ||
      dragMode === 'arrow-start' || dragMode === 'arrow-end' || dragMode === 'arrow-move'
    ) {
      pushNewSnapshot(captureCurrentSnapshot());
    }

    setDragMode(null);
    setBadgeResizeHandle(null);
    setCurrentBox(null);
    setStartPos(null);
    setInitialBox(null);
    setInitialBadge(null);
    setInitialArrow(null);
  };

  // Delete Highlight Box
  const handleDeleteBox = () => {
    if (!selectedBoxId) return;
    const remaining = getHighlights().filter((b) => b.id !== selectedBoxId);
    pushNewSnapshot({
      ...captureCurrentSnapshot(),
      highlights: remaining
    });
    onUpdateStep({
      highlights: remaining,
      highlight: remaining[0] || undefined
    });
    setSelectedBoxId(null);
  };

  // Delete Number Badge
  const handleDeleteBadge = () => {
    if (!selectedBadgeId) return;
    const remaining = getBadges().filter((b) => b.id !== selectedBadgeId);
    pushNewSnapshot({
      ...captureCurrentSnapshot(),
      numberBadges: remaining
    });
    onUpdateStep({ numberBadges: remaining });
    setSelectedBadgeId(null);
  };

  // Update Number Badge value
  const handleUpdateBadgeNumber = (num: number) => {
    if (!selectedBadgeId) return;
    const updated = getBadges().map((b) =>
      b.id === selectedBadgeId ? { ...b, number: Math.max(1, num) } : b
    );
    pushNewSnapshot({
      ...captureCurrentSnapshot(),
      numberBadges: updated
    });
    onUpdateStep({ numberBadges: updated });
  };

  // Update Number Badge size (besar/kecil bulatan angka)
  const handleUpdateBadgeSize = (newSize: number) => {
    if (!selectedBadgeId) return;
    const clamped = Math.max(20, Math.min(220, newSize));
    const updated = getBadges().map((b) =>
      b.id === selectedBadgeId ? { ...b, size: clamped } : b
    );
    pushNewSnapshot({
      ...captureCurrentSnapshot(),
      numberBadges: updated
    });
    onUpdateStep({ numberBadges: updated });
  };

  // Delete Selected Arrow
  const handleDeleteArrow = () => {
    if (!selectedArrowId || !step.arrows) return;
    const remaining = step.arrows.filter((a) => a.id !== selectedArrowId);
    pushNewSnapshot({
      ...captureCurrentSnapshot(),
      arrows: remaining
    });
    onUpdateStep({ arrows: remaining });
    setSelectedArrowId(null);
  };

  // Add preset arrow pointing to the focus box or center
  const handleAddPresetArrow = () => {
    if (!canvasRef.current) return;
    const cw = canvasRef.current.width;
    const ch = canvasRef.current.height;

    let startX = Math.round(cw * 0.35);
    let startY = Math.round(ch * 0.35);
    let endX = Math.round(cw * 0.48);
    let endY = Math.round(ch * 0.48);

    const boxes = getHighlights();
    const targetBox = (selectedBoxId && boxes.find((b) => b.id === selectedBoxId)) || boxes[0];

    if (targetBox) {
      startX = Math.max(15, Math.round(targetBox.x - Math.max(60, cw * 0.08)));
      startY = Math.max(15, Math.round(targetBox.y - Math.max(60, ch * 0.08)));
      endX = Math.round(targetBox.x + Math.min(10, targetBox.width * 0.2));
      endY = Math.round(targetBox.y + Math.min(10, targetBox.height * 0.2));
    }

    const newArrow: ArrowAnnotation = {
      id: 'arrow_' + Date.now(),
      startX,
      startY,
      endX,
      endY,
      color: selectedColor
    };

    const updated = [...(step.arrows || []), newArrow];
    pushNewSnapshot({
      ...captureCurrentSnapshot(),
      arrows: updated
    });
    onUpdateStep({ arrows: updated });
    setSelectedArrowId(newArrow.id);
    setSelectedBoxId(null);
    setSelectedBadgeId(null);
    setActiveTool('none');
  };

  // Apply Crop
  const applyCrop = () => {
    if (!cropSelection || !imageObjRef.current) return;
    const img = imageObjRef.current;

    const naturalW = img.naturalWidth || img.width;
    const naturalH = img.naturalHeight || img.height;

    const cropX = Math.max(0, Math.min(naturalW, Math.round(cropSelection.x)));
    const cropY = Math.max(0, Math.min(naturalH, Math.round(cropSelection.y)));
    const cropW = Math.max(1, Math.min(naturalW - cropX, Math.round(cropSelection.w)));
    const cropH = Math.max(1, Math.min(naturalH - cropY, Math.round(cropSelection.h)));

    if (cropW <= 0 || cropH <= 0) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropW;
    tempCanvas.height = cropH;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(
      img,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH
    );

    const croppedDataUrl = tempCanvas.toDataURL('image/png');
    const originalBackup = step.originalScreenshot || step.screenshot;

    const newSnap: CanvasSnapshot = {
      originalScreenshot: originalBackup,
      screenshot: croppedDataUrl,
      annotatedScreenshot: croppedDataUrl,
      highlights: [],
      numberBadges: [],
      blurRegions: [],
      arrows: []
    };
    pushNewSnapshot(newSnap);

    onUpdateStep({
      originalScreenshot: originalBackup,
      screenshot: croppedDataUrl,
      annotatedScreenshot: croppedDataUrl,
      highlight: undefined,
      highlights: [],
      numberBadges: [],
      blurRegions: [],
      arrows: []
    });

    setCropSelection(null);
    setActiveTool('none');
    setSelectedBoxId(null);
    setSelectedBadgeId(null);
    setSelectedArrowId(null);
  };

  // Reset to Original Screenshot
  const handleResetToOriginal = () => {
    const original = step.originalScreenshot || step.screenshot;
    if (original) {
      const newSnap: CanvasSnapshot = {
        screenshot: original,
        originalScreenshot: original,
        annotatedScreenshot: original,
        highlights: [],
        numberBadges: [],
        blurRegions: [],
        arrows: []
      };
      pushNewSnapshot(newSnap);

      onUpdateStep({
        screenshot: original,
        originalScreenshot: original,
        annotatedScreenshot: original,
        highlight: undefined,
        highlights: [],
        numberBadges: [],
        blurRegions: [],
        arrows: []
      });
      setCropSelection(null);
      setSelectedBoxId(null);
      setSelectedBadgeId(null);
      setSelectedArrowId(null);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        const newSnap: CanvasSnapshot = {
          screenshot: dataUrl,
          originalScreenshot: dataUrl,
          annotatedScreenshot: dataUrl,
          highlights: [],
          numberBadges: [],
          blurRegions: [],
          arrows: []
        };
        pushNewSnapshot(newSnap);

        onUpdateStep({
          screenshot: dataUrl,
          originalScreenshot: dataUrl,
          annotatedScreenshot: dataUrl,
          highlight: undefined,
          highlights: [],
          numberBadges: [],
          blurRegions: [],
          arrows: []
        });
        setSelectedBoxId(null);
        setSelectedBadgeId(null);
        setSelectedArrowId(null);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Paste from Clipboard Button Handler
  const handlePasteClick = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
              const dataUrl = uploadEvent.target?.result as string;
              if (dataUrl) {
                const newSnap: CanvasSnapshot = {
                  screenshot: dataUrl,
                  originalScreenshot: dataUrl,
                  annotatedScreenshot: dataUrl,
                  highlights: [],
                  numberBadges: [],
                  blurRegions: [],
                  arrows: []
                };
                pushNewSnapshot(newSnap);

                onUpdateStep({
                  screenshot: dataUrl,
                  originalScreenshot: dataUrl,
                  annotatedScreenshot: dataUrl,
                  highlight: undefined,
                  highlights: [],
                  numberBadges: [],
                  blurRegions: [],
                  arrows: []
                });
                setSelectedBoxId(null);
                setSelectedBadgeId(null);
                setSelectedArrowId(null);
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      alert('Tidak ada gambar di clipboard. Silakan copy gambar/screenshot terlebih dahulu.');
    } catch {
      alert('Tekan shortcut Ctrl + V pada keyboard Anda untuk menempelkan screenshot secara langsung.');
    }
  };

  // Active color to highlight in the palette
  const activeSelectedBadge = selectedBadgeId ? getBadges().find((b) => b.id === selectedBadgeId) : null;
  const activeSelectedBox = selectedBoxId ? getHighlights().find((b) => b.id === selectedBoxId) : null;
  const activeSelectedArrow = selectedArrowId && step.arrows ? step.arrows.find((a) => a.id === selectedArrowId) : null;

  const currentActiveColor =
    activeSelectedBadge?.color ||
    activeSelectedBox?.color ||
    activeSelectedArrow?.color ||
    selectedColor;

  const hasImage = Boolean(step.screenshot || step.originalScreenshot);
  const boxes = getHighlights();
  const badges = getBadges();

  return (
    <div className="flex flex-col gap-3">
      {/* Visual Annotation & Editing Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* Tool Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo (Ctrl + Z)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-35 disabled:hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            <Undo2 size={13} strokeWidth={2.5} />
            <span>Undo</span>
          </button>

          {/* Redo Button */}
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo (Ctrl + Y)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-35 disabled:hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            <Redo2 size={13} strokeWidth={2.5} />
            <span>Redo</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

          {/* Highlight Box Button */}
          <button
            onClick={() => {
              if (activeTool === 'highlight') {
                setActiveTool('none');
              } else {
                setActiveTool('highlight');
                setSelectedBadgeId(null);
                setSelectedArrowId(null);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'highlight' || selectedBoxId
                ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Square size={13} strokeWidth={2.5} />
            <span>Kotak Fokus {boxes.length > 0 ? `(${boxes.length})` : ''}</span>
          </button>

          {/* Number Badge Button (NEW!) */}
          <button
            onClick={() => {
              if (activeTool === 'badge') {
                setActiveTool('none');
              } else {
                setActiveTool('badge');
                setSelectedBoxId(null);
                setSelectedArrowId(null);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'badge' || selectedBadgeId
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CircleDot size={14} strokeWidth={2.5} />
            <span>Nomor Langkah {badges.length > 0 ? `(${badges.length})` : ''}</span>
          </button>

          {/* Arrow Tool Button */}
          <button
            onClick={() => {
              if (activeTool === 'arrow') {
                setActiveTool('none');
              } else {
                setActiveTool('arrow');
                setSelectedBoxId(null);
                setSelectedBadgeId(null);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'arrow' || selectedArrowId
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ArrowUpRight size={14} strokeWidth={2.5} />
            <span>Panah Petunjuk</span>
          </button>

          {/* Quick Preset: Add arrow to focus box */}
          {boxes.length > 0 && (
            <button
              onClick={handleAddPresetArrow}
              title="Tambahkan panah otomatis yang menunjuk ke kotak fokus"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition-all"
            >
              <ArrowUpRight size={12} /> + Panah Fokus
            </button>
          )}

          {/* Crop Tool Button */}
          <button
            onClick={() => {
              setActiveTool(activeTool === 'crop' ? 'none' : 'crop');
              setSelectedBoxId(null);
              setSelectedBadgeId(null);
              setSelectedArrowId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'crop'
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Crop size={13} strokeWidth={2.5} />
            <span>Crop Foto</span>
          </button>

          {/* Blur Tool Button */}
          <button
            onClick={() => {
              setActiveTool(activeTool === 'blur' ? 'none' : 'blur');
              setSelectedBoxId(null);
              setSelectedBadgeId(null);
              setSelectedArrowId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'blur'
                ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <EyeOff size={13} strokeWidth={2.5} />
            <span>Sensor / Blur</span>
          </button>

          {/* Badge Number Stepper & Size Stepper (When a badge is selected) */}
          {activeSelectedBadge && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-[11px] font-bold text-indigo-900 mr-0.5">Nomor:</span>
              <button
                onClick={() => handleUpdateBadgeNumber(activeSelectedBadge.number - 1)}
                className="p-1 hover:bg-indigo-100 rounded text-indigo-700"
                title="Kurangi Angka"
              >
                <Minus size={11} strokeWidth={3} />
              </button>
              <span className="text-xs font-bold text-indigo-950 px-1">{activeSelectedBadge.number}</span>
              <button
                onClick={() => handleUpdateBadgeNumber(activeSelectedBadge.number + 1)}
                className="p-1 hover:bg-indigo-100 rounded text-indigo-700"
                title="Tambah Angka"
              >
                <Plus size={11} strokeWidth={3} />
              </button>

              <div className="h-3 w-[1px] bg-indigo-200 mx-0.5" />

              <span className="text-[11px] font-bold text-indigo-900 mr-0.5">Ukuran:</span>
              <button
                onClick={() => handleUpdateBadgeSize(Math.max(20, (activeSelectedBadge.size || 34) - 6))}
                className="p-1 hover:bg-indigo-100 rounded text-indigo-700"
                title="Perkecil Ukuran Bulatan"
              >
                <Minus size={11} strokeWidth={3} />
              </button>
              <span className="text-[10px] font-bold text-indigo-950 px-1">
                {activeSelectedBadge.size ? `${activeSelectedBadge.size}px` : 'Normal'}
              </span>
              <button
                onClick={() => handleUpdateBadgeSize(Math.min(180, (activeSelectedBadge.size || 34) + 6))}
                className="p-1 hover:bg-indigo-100 rounded text-indigo-700"
                title="Perbesar Ukuran Bulatan"
              >
                <Plus size={11} strokeWidth={3} />
              </button>
            </div>
          )}

          {/* Delete Number Badge Button */}
          {selectedBadgeId && (
            <button
              onClick={handleDeleteBadge}
              title="Hapus Nomor (atau tekan tombol Delete)"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all ml-1"
            >
              <Trash2 size={12} /> Hapus Nomor
            </button>
          )}

          {/* Delete Highlight Box Button */}
          {selectedBoxId && (
            <button
              onClick={handleDeleteBox}
              title="Hapus Kotak Terpilih (atau tekan tombol Delete)"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all ml-1"
            >
              <Trash2 size={12} /> Hapus Kotak
            </button>
          )}

          {/* Delete Selected Arrow Button */}
          {selectedArrowId && (
            <button
              onClick={handleDeleteArrow}
              title="Hapus Panah Terpilih (atau tekan tombol Delete)"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all ml-1"
            >
              <Trash2 size={12} /> Hapus Panah
            </button>
          )}

          {/* Color Palette (Active for selected box, badge, or arrow) */}
          {(selectedBoxId || selectedBadgeId || selectedArrowId) && (
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
              {HIGHLIGHT_COLORS.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => {
                    setSelectedColor(col.hex);
                    if (selectedBadgeId) {
                      const updated = getBadges().map((b) =>
                        b.id === selectedBadgeId ? { ...b, color: col.hex } : b
                      );
                      pushNewSnapshot({
                        ...captureCurrentSnapshot(),
                        numberBadges: updated
                      });
                      onUpdateStep({ numberBadges: updated });
                    } else if (selectedBoxId) {
                      const updated = getHighlights().map((b) =>
                        b.id === selectedBoxId ? { ...b, color: col.hex } : b
                      );
                      pushNewSnapshot({
                        ...captureCurrentSnapshot(),
                        highlights: updated
                      });
                      onUpdateStep({ highlights: updated, highlight: updated[0] });
                    } else if (selectedArrowId && step.arrows) {
                      const updated = step.arrows.map((a) =>
                        a.id === selectedArrowId ? { ...a, color: col.hex } : a
                      );
                      pushNewSnapshot({
                        ...captureCurrentSnapshot(),
                        arrows: updated
                      });
                      onUpdateStep({ arrows: updated });
                    }
                  }}
                  title={col.name}
                  style={{ backgroundColor: col.hex }}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    currentActiveColor === col.hex ? 'scale-125 ring-2 ring-offset-1 ring-slate-400' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right side: Replace image / Crop confirmation / Reset */}
        <div className="flex items-center gap-2">
          {hasImage && (
            <>
              {/* Replace Image Button */}
              <label
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Ganti gambar screenshot ini dengan file lain"
              >
                <Upload size={12} /> Ganti Foto
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {cropSelection ? (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 p-1 rounded-xl">
                  <button
                    onClick={applyCrop}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                  >
                    <Check size={13} /> Terapkan Crop
                  </button>
                  <button
                    onClick={() => setCropSelection(null)}
                    className="p-1 hover:bg-slate-200 text-slate-600 rounded-lg text-xs"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleResetToOriginal}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <RotateCcw size={12} /> Reset Foto Asli
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Instructions / Status hint */}
      <div className="text-[11px] text-slate-500 px-1 font-medium flex items-center justify-between">
        <span>
          {activeTool === 'highlight' && '👉 Tarik kotak baru di atas gambar untuk membuat kotak fokus.'}
          {activeTool === 'badge' && '👉 Klik di mana saja pada gambar untuk menempatkan bulatan nomor langkah.'}
          {activeTool === 'arrow' && '👉 Klik dan seret (drag) mouse dari pangkal ke arah target untuk menggambar panah.'}
          {activeTool === 'crop' && '👉 Tarik kotak area foto yang ingin Anda pertahankan.'}
          {activeTool === 'blur' && '👉 Tarik kotak di atas data sensitif (password/email) untuk memburamkannya.'}
          {activeTool === 'none' &&
            (selectedBadgeId
              ? '💡 Nomor Langkah aktif: Tarik titik sudut untuk atur ukuran (besar/kecil), geser bulatan, atau tekan Delete.'
              : selectedArrowId
              ? '💡 Panah aktif: Tarik ujung panah untuk ubah arah/panjang, geser garisnya, atau tekan Delete untuk menghapus.'
              : selectedBoxId
              ? '💡 Kotak aktif: Tarik titik untuk ubah ukuran, geser bagian dalam, atau tekan Delete untuk menghapus.'
              : '💡 Tekan Ctrl + Z untuk Undo, Ctrl + Y untuk Redo. Klik "Kotak Fokus", "Nomor Langkah", atau "Panah" untuk menambah penunjuk visual.')}
        </span>
        <div className="flex items-center gap-2">
          {boxes.length > 0 && (
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <Move size={11} /> {boxes.length} Kotak Fokus
            </span>
          )}
          {badges.length > 0 && (
            <span className="text-indigo-600 font-semibold flex items-center gap-1">
              <CircleDot size={11} /> {badges.length} Nomor Langkah
            </span>
          )}
          {step.arrows && step.arrows.length > 0 && (
            <span className="text-blue-600 font-semibold flex items-center gap-1">
              <ArrowUpRight size={11} /> {step.arrows.length} Panah
            </span>
          )}
        </div>
      </div>

      {/* Screenshot Canvas Viewer / Empty State */}
      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        className={`relative bg-slate-900/95 rounded-2xl overflow-hidden shadow-sm border border-slate-800 flex items-center justify-center p-3 sm:p-4 min-h-[380px] ${
          hasImage ? 'w-fit max-w-full mx-auto' : 'w-full'
        }`}
      >
        {!hasImage ? (
          /* Empty Page Dropzone */
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/60 text-center max-w-lg w-full my-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 shadow-sm">
              <Upload size={32} />
            </div>
            <h3 className="text-base font-bold text-white">Halaman Baru Masih Kosong</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              Upload gambar screenshot dari komputer, atau cukup tekan{' '}
              <kbd className="px-2 py-0.5 bg-slate-700 border border-slate-600 rounded text-orange-300 font-bold shadow-xs">
                Ctrl + V
              </kbd>{' '}
              pada keyboard untuk langsung menempelkan tangkapan layar.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5C35] hover:bg-[#E54A24] text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-all">
                <Upload size={14} /> Pilih File Gambar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <button
                onClick={handlePasteClick}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <ClipboardPaste size={14} /> Paste dari Clipboard
              </button>
            </div>
          </div>
        ) : (
          <div className="relative inline-flex items-center justify-center max-w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ cursor: hoverCursor }}
              className="block max-w-full max-h-[620px] object-contain rounded-xl"
            />

            {/* Live Dragging Arrow Preview Overlay */}
            {dragMode === 'new-arrow' && currentArrow && canvasRef.current && (
              <svg
                className="absolute inset-0 pointer-events-none w-full h-full"
                viewBox={`0 0 ${canvasRef.current.width} ${canvasRef.current.height}`}
              >
                <defs>
                  <marker
                    id="preview-arrowhead"
                    markerWidth="12"
                    markerHeight="8"
                    refX="10"
                    refY="4"
                    orient="auto"
                  >
                    <polygon points="0 0, 12 4, 0 8" fill={selectedColor} />
                  </marker>
                </defs>
                <line
                  x1={currentArrow.startX}
                  y1={currentArrow.startY}
                  x2={currentArrow.endX}
                  y2={currentArrow.endY}
                  stroke={selectedColor}
                  strokeWidth={Math.max(4, Math.round(canvasRef.current.width * 0.0035))}
                  strokeLinecap="round"
                  markerEnd="url(#preview-arrowhead)"
                />
              </svg>
            )}

            {/* Live Dragging Box Overlay */}
            {dragMode === 'new' && currentBox && canvasRef.current && (
              <div
                style={{
                  position: 'absolute',
                  left: `${(currentBox.x / canvasRef.current.width) * 100}%`,
                  top: `${(currentBox.y / canvasRef.current.height) * 100}%`,
                  width: `${(currentBox.w / canvasRef.current.width) * 100}%`,
                  height: `${(currentBox.h / canvasRef.current.height) * 100}%`,
                  border: `2px dashed ${
                    activeTool === 'crop'
                      ? '#F59E0B'
                      : activeTool === 'blur'
                      ? '#A855F7'
                      : selectedColor
                  }`,
                  backgroundColor:
                    activeTool === 'crop'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : activeTool === 'blur'
                      ? 'rgba(168, 85, 247, 0.2)'
                      : selectedColor + '20',
                  pointerEvents: 'none'
                }}
              />
            )}

            {/* Waiting for Crop Confirmation Overlay */}
            {cropSelection && canvasRef.current && (
              <div
                style={{
                  position: 'absolute',
                  left: `${(cropSelection.x / canvasRef.current.width) * 100}%`,
                  top: `${(cropSelection.y / canvasRef.current.height) * 100}%`,
                  width: `${(cropSelection.w / canvasRef.current.width) * 100}%`,
                  height: `${(cropSelection.h / canvasRef.current.height) * 100}%`,
                  border: '2px solid #F59E0B',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
