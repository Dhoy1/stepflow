'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Presentation,
  FileDown,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowLeft,
  Loader2,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  Info,
  Edit,
  Lock,
  Globe,
  Tag,
  CheckCircle2,
  X,
  ZoomIn,
  MoreVertical
} from 'lucide-react';
import { exportToWord } from '@/lib/exporters/docxExporter';
import { exportToPptx } from '@/lib/exporters/pptxExporter';
import { exportToPdf } from '@/lib/exporters/pdfExporter';
import { isEditorAuthenticated, getActiveTeam, getStoredEditorName } from '@/lib/auth';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { PinModal } from '@/components/PinModal';
import type { Workflow } from '@/types';

interface GuideViewerProps {
  workflow: Workflow;
}

export const GuideViewer: React.FC<GuideViewerProps> = ({ workflow: initialWorkflow }) => {
  const router = useRouter();
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'scroll' | 'interactive'>('scroll');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  // Mobile Action Menu & Image Lightbox state
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  // Inline Subtitle / Description Editing
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState(initialWorkflow.description || '');
  const [isSavingDesc, setIsSavingDesc] = useState(false);

  // Inline Target URL Editing
  const [isEditingTargetUrl, setIsEditingTargetUrl] = useState(false);
  const [targetUrlInput, setTargetUrlInput] = useState(initialWorkflow.targetUrl || '');
  const [isSavingTargetUrl, setIsSavingTargetUrl] = useState(false);

  // Inline Category Editing
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryInput, setCategoryInput] = useState(initialWorkflow.category || 'General SOP');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Navigating to WebEditor state
  const [isNavigatingToEdit, setIsNavigatingToEdit] = useState(false);

  const [pendingAction, setPendingAction] = useState<'editor' | 'inlineDesc' | 'targetUrl' | 'category' | null>(null);

  useEffect(() => {
    setWorkflow(initialWorkflow);
    setDescInput(initialWorkflow.description || '');
    setTargetUrlInput(initialWorkflow.targetUrl || '');
    setCategoryInput(initialWorkflow.category || 'General SOP');
  }, [initialWorkflow]);

  useEffect(() => {
    setIsAuth(isEditorAuthenticated());
  }, []);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxImage]);

  const getAuthorSignature = () => {
    const activeTeam = getActiveTeam();
    const editor = getStoredEditorName();
    let authorSignature = workflow.lastEditedBy || '';
    if (editor && activeTeam) {
      if (editor.trim().toLowerCase() === activeTeam.name.trim().toLowerCase()) {
        authorSignature = editor.trim();
      } else {
        authorSignature = `${editor.trim()} (${activeTeam.name})`;
      }
    } else if (activeTeam) {
      authorSignature = activeTeam.name;
    } else if (editor) {
      authorSignature = editor.trim();
    }
    return authorSignature;
  };

  const handleEditClick = () => {
    if (isEditorAuthenticated()) {
      setIsNavigatingToEdit(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('stepflow-start-progress'));
      }
      router.push(`/guide/${workflow.id}/edit`);
    } else {
      setPendingAction('editor');
      setShowPinModal(true);
    }
  };

  const handleStartEditDesc = () => {
    if (isEditorAuthenticated()) {
      setDescInput(workflow.description || '');
      setIsEditingDesc(true);
    } else {
      setPendingAction('inlineDesc');
      setShowPinModal(true);
    }
  };

  const handleStartEditTargetUrl = () => {
    if (isEditorAuthenticated()) {
      setTargetUrlInput(workflow.targetUrl || '');
      setIsEditingTargetUrl(true);
    } else {
      setPendingAction('targetUrl');
      setShowPinModal(true);
    }
  };

  const handleStartEditCategory = () => {
    if (isEditorAuthenticated()) {
      setCategoryInput(workflow.category || 'General SOP');
      setIsEditingCategory(true);
    } else {
      setPendingAction('category');
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setIsAuth(true);
    if (pendingAction === 'inlineDesc') {
      setIsEditingDesc(true);
      setPendingAction(null);
    } else if (pendingAction === 'targetUrl') {
      setTargetUrlInput(workflow.targetUrl || '');
      setIsEditingTargetUrl(true);
      setPendingAction(null);
    } else if (pendingAction === 'category') {
      setCategoryInput(workflow.category || 'General SOP');
      setIsEditingCategory(true);
      setPendingAction(null);
    } else {
      setIsNavigatingToEdit(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('stepflow-start-progress'));
      }
      router.push(`/guide/${workflow.id}/edit`);
    }
  };

  const handleSaveDescription = async () => {
    setIsSavingDesc(true);
    const authorSignature = getAuthorSignature();

    const updatedWorkflow: Workflow = {
      ...workflow,
      description: descInput.trim(),
      lastEditedBy: authorSignature,
      updatedAt: Date.now()
    };

    try {
      const res = await fetch(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWorkflow)
      });
      if (res.ok) {
        setWorkflow(updatedWorkflow);
        setIsEditingDesc(false);
        router.refresh();
      } else {
        alert('Gagal menyimpan deskripsi panduan ke server.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan deskripsi.');
    } finally {
      setIsSavingDesc(false);
    }
  };

  const handleSaveTargetUrl = async () => {
    setIsSavingTargetUrl(true);
    const authorSignature = getAuthorSignature();

    const updatedWorkflow: Workflow = {
      ...workflow,
      targetUrl: targetUrlInput.trim(),
      lastEditedBy: authorSignature,
      updatedAt: Date.now()
    };

    try {
      const res = await fetch(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWorkflow)
      });
      if (res.ok) {
        setWorkflow(updatedWorkflow);
        setIsEditingTargetUrl(false);
        router.refresh();
      } else {
        alert('Gagal menyimpan tautan target ke server.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan tautan target.');
    } finally {
      setIsSavingTargetUrl(false);
    }
  };

  const handleSaveCategory = async () => {
    setIsSavingCategory(true);
    const authorSignature = getAuthorSignature();

    const updatedWorkflow: Workflow = {
      ...workflow,
      category: categoryInput.trim() || 'General SOP',
      lastEditedBy: authorSignature,
      updatedAt: Date.now()
    };

    try {
      const res = await fetch(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWorkflow)
      });
      if (res.ok) {
        setWorkflow(updatedWorkflow);
        setIsEditingCategory(false);
        router.refresh();
      } else {
        alert('Gagal menyimpan kategori ke server.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan kategori.');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/guide/${workflow.id}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getWorkflowForExport = (): Workflow => {
    const isEnglish =
      (typeof window !== 'undefined' && sessionStorage.getItem('stepflow_session_lang') === 'en') ||
      (typeof document !== 'undefined' && document.cookie.includes('googtrans=/id/en'));
    // Jika sedang dalam bahasa Indonesia asli, langsung kirim data asli
    if (!isEnglish) return workflow;
    // Jika sedang dalam bahasa Inggris, ambil teks terjemahan dari layar
    const titleEl = document.getElementById('export-doc-title');
    const descEl = document.getElementById('export-doc-desc');
    const catEl = document.getElementById('export-doc-category');
    return {
      ...workflow,
      title: titleEl?.textContent?.trim() || workflow.title,
      description: descEl?.textContent?.trim() || workflow.description,
      category: catEl?.textContent?.trim() || workflow.category,
      steps: workflow.steps.map((st) => {
        const stepWrap = document.getElementById(`export-step-${st.id}`);
        if (!stepWrap) return st;
        const stTitle = stepWrap.querySelector('.export-step-title')?.textContent?.trim();
        const stDesc = stepWrap.querySelector('.export-step-desc')?.textContent?.trim();
        const stCallout = stepWrap.querySelector('.export-step-callout')?.textContent?.trim();
        return {
          ...st,
          title: stTitle || st.title,
          description: stDesc !== undefined && stDesc !== '' ? stDesc : st.description,
          callout: st.callout
            ? {
              ...st.callout,
              text: stCallout || st.callout.text
            }
            : undefined
        };
      })
    };
  };
  const handleExport = async (format: 'word' | 'pptx' | 'pdf') => {
    try {
      setIsExporting(format);
      const targetWorkflow = getWorkflowForExport();
      if (format === 'word') await exportToWord(targetWorkflow);
      if (format === 'pptx') await exportToPptx(targetWorkflow);
      if (format === 'pdf') await exportToPdf(targetWorkflow);
    } catch (e: any) {
      alert('Gagal mengekspor: ' + e.message);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2 overflow-hidden">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            title="Semua Panduan"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Semua Panduan</span>
          </a>
          <div className="h-4 w-[1px] bg-slate-200 shrink-0" />
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-[#FF5C35] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              S
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate min-w-0 flex-1">
              {workflow.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Tombol pilihan bahasa */}
          <LanguageSwitcher />

          {/* Mode Switcher (Desktop) */}
          <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('scroll')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${viewMode === 'scroll'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Mode Gulir
            </button>
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${viewMode === 'interactive'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Mode Interaktif
            </button>
          </div>

          {/* Edit Guide Button (Protected by PIN) - Dihapus di HP sesuai instruksi, tampil di desktop sm:flex */}
          <button
            type="button"
            onClick={handleEditClick}
            disabled={isNavigatingToEdit}
            title="Edit judul, keterangan langkah, atau gambar (Perlu PIN Tim)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#FF5C35] transition-all shadow-xs disabled:opacity-60"
          >
            {isNavigatingToEdit ? (
              <>
                <Loader2 size={14} className="animate-spin text-[#FF5C35]" />
                <span>Membuka Editor...</span>
              </>
            ) : (
              <>
                <Edit size={14} />
                <span>Edit Panduan & Teks</span>
              </>
            )}
          </button>

          {/* Copy Share Link (Desktop) */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            <span>{isCopied ? 'Tersalin!' : 'Bagikan'}</span>
          </button>

          {/* Export Group (Desktop) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleExport('word')}
              disabled={isExporting !== null}
              title="Unduh format Word"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isExporting === 'word' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              <span className="hidden sm:inline">Word</span>
            </button>

            <button
              type="button"
              onClick={() => handleExport('pptx')}
              disabled={isExporting !== null}
              title="Unduh format PowerPoint"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isExporting === 'pptx' ? <Loader2 size={14} className="animate-spin" /> : <Presentation size={14} />}
              <span className="hidden sm:inline">PPT</span>
            </button>

            <button
              type="button"
              onClick={() => handleExport('pdf')}
              disabled={isExporting !== null}
              title="Unduh format PDF"
              className="px-3 py-1.5 rounded-lg bg-[#FF5C35] hover:bg-[#E54A24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              {isExporting === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
              <span>PDF</span>
            </button>
          </div>

          {/* Mobile Action Menu (sm:hidden) */}
          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 active:bg-slate-100 text-xs font-semibold shadow-xs transition-colors"
              title="Opsi & Unduh Panduan"
            >
              <MoreVertical size={14} />
              <span>Aksi</span>
            </button>

            {showMobileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-2xs cursor-pointer"
                  onClick={() => setShowMobileMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 z-50 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 flex flex-col gap-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyLink();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-medium transition-colors text-left"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} className="text-slate-500" />}
                    <span>{isCopied ? 'Tautan Tersalin!' : 'Salin Tautan'}</span>
                  </button>

                  <div className="h-[1px] bg-slate-100 my-0.5" />
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Unduh Dokumen
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleExport('pdf');
                      setShowMobileMenu(false);
                    }}
                    disabled={isExporting !== null}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 active:bg-orange-100 text-slate-700 hover:text-[#FF5C35] font-medium transition-colors text-left disabled:opacity-50"
                  >
                    {isExporting === 'pdf' ? <Loader2 size={14} className="animate-spin text-[#FF5C35]" /> : <FileDown size={14} className="text-[#FF5C35]" />}
                    <span>Unduh PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleExport('word');
                      setShowMobileMenu(false);
                    }}
                    disabled={isExporting !== null}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 active:bg-blue-100 text-slate-700 hover:text-blue-600 font-medium transition-colors text-left disabled:opacity-50"
                  >
                    {isExporting === 'word' ? <Loader2 size={14} className="animate-spin text-blue-600" /> : <FileText size={14} className="text-blue-600" />}
                    <span>Unduh Dokumen Word</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleExport('pptx');
                      setShowMobileMenu(false);
                    }}
                    disabled={isExporting !== null}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 active:bg-amber-100 text-slate-700 hover:text-amber-600 font-medium transition-colors text-left disabled:opacity-50"
                  >
                    {isExporting === 'pptx' ? <Loader2 size={14} className="animate-spin text-amber-600" /> : <Presentation size={14} className="text-amber-600" />}
                    <span>Unduh PowerPoint</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 sm:p-8 flex flex-col gap-6 sm:gap-8">
        {/* Document Header Card */}
        <header className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {workflow.steps.length} Langkah
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Dipublikasikan: {new Date(workflow.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>

            {/* Category Badge & Inline Edit */}
            {isEditingCategory ? (
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1 shadow-xs">
                <Tag size={12} className="text-[#FF5C35] shrink-0" />
                <input
                  list="guide-category-suggestions"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Kategori..."
                  className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-300 focus:border-[#FF5C35] focus:outline-none w-36 sm:w-44 text-slate-800"
                />
                <datalist id="guide-category-suggestions">
                  <option value="General SOP" />
                  <option value="Human Resources" />
                  <option value="Finance & Accounting" />
                  <option value="IT & Operations" />
                  <option value="Customer Support" />
                  <option value="Sales & Marketing" />
                </datalist>
                <button
                  type="button"
                  onClick={handleSaveCategory}
                  disabled={isSavingCategory}
                  className="px-2.5 py-1 bg-[#FF5C35] hover:bg-[#E54A24] text-white text-[11px] font-bold rounded flex items-center gap-1 disabled:opacity-50 transition-colors shadow-xs"
                  title="Simpan kategori"
                >
                  {isSavingCategory ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                  <span>Simpan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryInput(workflow.category || 'General SOP');
                    setIsEditingCategory(false);
                  }}
                  className="px-2 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-semibold rounded hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
              </div>
            ) : (
              <div className="group/cat flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors">
                <Tag size={11} className="text-slate-500 shrink-0" />
                <span>{workflow.category || 'General SOP'}</span>
                <button
                  type="button"
                  onClick={handleStartEditCategory}
                  className="text-slate-400 hover:text-[#FF5C35] transition-colors ml-0.5"
                  title="Ubah Kategori (memerlukan PIN editor)"
                >
                  <Edit size={11} />
                </button>
              </div>
            )}

            {/* Internal Only: Editor Log Badge (Hidden from public audience) */}
            {isAuth && workflow.lastEditedBy && (
              <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                🔒 Log Tim: Diedit oleh {workflow.lastEditedBy}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {workflow.title}
          </h1>

          {/* Mode Switcher untuk Layar Ponsel (sm:hidden) */}
          <div className="flex sm:hidden items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('scroll')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all text-center ${viewMode === 'scroll'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              📜 Mode Gulir
            </button>
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all text-center ${viewMode === 'interactive'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              👆 Interaktif
            </button>
          </div>

          {/* Subtitle / Description Section with Edit Capability */}
          {isEditingDesc ? (
            <div className="my-1 p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                  <Edit size={13} className="text-[#FF5C35]" /> Edit Keterangan / Subtitle Panduan:
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Teks terbaru akan otomatis tercetak di PDF, PPT, dan Word
                </span>
              </div>
              <textarea
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                placeholder="Tuliskan keterangan / subtitle panduan di sini..."
                rows={2}
                className="w-full text-sm text-slate-800 bg-white border border-slate-300 focus:border-[#FF5C35] focus:ring-1 focus:ring-[#FF5C35] rounded-lg p-2.5 outline-none font-medium transition-all resize-y shadow-xs"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDescInput(workflow.description || '');
                    setIsEditingDesc(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveDescription}
                  disabled={isSavingDesc}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF5C35] hover:bg-[#E54A24] text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSavingDesc ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  <span>Simpan Keterangan</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="group flex items-start justify-between gap-3">
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-1">
                {workflow.description || (
                  <span className="italic text-slate-400">Belum ada keterangan / subtitle.</span>
                )}
              </p>
              <button
                type="button"
                onClick={handleStartEditDesc}
                className="opacity-75 group-hover:opacity-100 hover:text-[#FF5C35] text-slate-400 px-2 py-1 rounded-md hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0"
                title="Edit teks subtitle ini"
              >
                <Edit size={13} />
                <span>Edit Subtitle</span>
              </button>
            </div>
          )}

          {/* Target URL with Edit Capability (Protected by Team PIN) */}
          {isEditingTargetUrl ? (
            <div className="pt-3 flex flex-col gap-2.5 p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <Globe size={13} className="text-purple-600" /> Edit Link Target Aplikasi / Halaman:
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Contoh: https://portal.internal.com/modul
                </span>
              </div>
              <input
                type="url"
                value={targetUrlInput}
                onChange={(e) => setTargetUrlInput(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs text-slate-800 bg-white border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-lg p-2.5 outline-none font-medium transition-all shadow-xs"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTargetUrlInput(workflow.targetUrl || '');
                    setIsEditingTargetUrl(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveTargetUrl}
                  disabled={isSavingTargetUrl}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSavingTargetUrl ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  <span>Simpan Link</span>
                </button>
              </div>
            </div>
          ) : workflow.targetUrl ? (
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <div className="group/target flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl hover:border-purple-300 transition-colors">
                <Globe size={13} className="text-purple-600 flex-shrink-0" />
                <span className="text-slate-400 font-medium">Target:</span>
                <a
                  href={workflow.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-700 hover:text-purple-900 hover:underline font-semibold truncate max-w-xs sm:max-w-md flex items-center gap-1"
                  title={workflow.targetUrl}
                >
                  {workflow.targetUrl}
                  <ExternalLink size={11} className="flex-shrink-0 text-slate-400" />
                </a>
                <button
                  type="button"
                  onClick={handleStartEditTargetUrl}
                  className="opacity-70 group-hover/target:opacity-100 text-slate-400 hover:text-purple-700 transition-all p-1 hover:bg-purple-50 rounded ml-1"
                  title="Edit tautan target aplikasi (memerlukan PIN editor)"
                >
                  <Edit size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartEditTargetUrl}
                className="text-xs text-slate-400 hover:text-purple-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all font-medium"
                title="Tambahkan link target aplikasi (memerlukan PIN editor)"
              >
                <Globe size={13} className="text-slate-400" />
                <span>+ Tambah Link Target URL</span>
              </button>
            </div>
          )}
        </header>

        {/* Mode: Scrollable Timeline */}
        {viewMode === 'scroll' ? (
          <div className="space-y-8">
            {workflow.steps.map((step, idx) => (
              <article
                key={step.id || idx}
                id={`step-${idx + 1}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Step Header */}
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-full bg-[#FF5C35] text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                        {idx + 1}
                      </span>
                      <h2 className="text-sm sm:text-lg font-bold text-slate-900 leading-snug">
                        {step.title}
                      </h2>
                    </div>
                    {isAuth && (
                      <button
                        onClick={handleEditClick}
                        className="text-xs text-slate-400 hover:text-orange-600 flex items-center gap-1 font-semibold px-2 py-1 rounded-md hover:bg-orange-50 transition-colors shrink-0"
                        title="Edit teks instruksi atau gambar langkah ini"
                      >
                        <Edit size={12} /> <span className="hidden sm:inline">Edit Teks</span>
                      </button>
                    )}
                  </div>

                  {step.description && (
                    <p className="text-xs sm:text-sm text-slate-600 ml-0 mt-1 sm:ml-9 sm:mt-0 leading-relaxed">
                      {step.description}
                    </p>
                  )}

                  {/* Callout */}
                  {step.callout && step.callout.type !== 'none' && step.callout.text && (
                    <div
                      className={`ml-0 mt-2 sm:ml-9 sm:mt-1.5 p-2.5 sm:p-3 rounded-xl border text-xs flex items-start gap-2.5 shadow-2xs ${step.callout.type === 'tip'
                        ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                        : step.callout.type === 'warning'
                          ? 'bg-amber-50/90 border-amber-200 text-amber-900'
                          : 'bg-blue-50/90 border-blue-200 text-blue-900'
                        }`}
                    >
                      {step.callout.type === 'tip' && (
                        <Lightbulb size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      )}
                      {step.callout.type === 'warning' && (
                        <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      {step.callout.type === 'info' && (
                        <Info size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 flex flex-wrap items-center gap-1.5 leading-relaxed">
                        <span
                          className={`font-extrabold uppercase tracking-wide text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${step.callout.type === 'tip'
                            ? 'bg-emerald-200/80 text-emerald-900'
                            : step.callout.type === 'warning'
                              ? 'bg-amber-200/80 text-amber-900'
                              : 'bg-blue-200/80 text-blue-900'
                            }`}
                        >
                          {step.callout.type === 'tip'
                            ? 'TIPS'
                            : step.callout.type === 'warning'
                              ? 'PERINGATAN'
                              : 'INFO'}
                        </span>
                        <span className="font-medium text-slate-800">{step.callout.text}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Screenshot Visual */}
                <div className="bg-slate-950/5 p-2.5 sm:p-6 flex flex-col items-center justify-center">
                  <img
                    src={step.annotatedScreenshot || step.screenshot}
                    alt={step.title}
                    onClick={() => setLightboxImage({
                      src: step.annotatedScreenshot || step.screenshot,
                      title: `${idx + 1}. ${step.title}`
                    })}
                    className="max-w-full rounded-xl shadow-md border border-slate-200 object-contain max-h-[550px] cursor-zoom-in active:scale-[0.99] transition-transform"
                    loading="lazy"
                  />
                  <div
                    onClick={() => setLightboxImage({
                      src: step.annotatedScreenshot || step.screenshot,
                      title: `${idx + 1}. ${step.title}`
                    })}
                    className="sm:hidden mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium cursor-pointer active:text-[#FF5C35]"
                  >
                    <ZoomIn size={13} className="text-[#FF5C35]" />
                    <span>Ketuk gambar untuk memperbesar</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Mode: Interactive Stepper Carousel */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FF5C35] text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                  {activeStepIndex + 1}
                </span>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Langkah {activeStepIndex + 1} dari {workflow.steps.length}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {workflow.steps[activeStepIndex]?.title}
                  </h2>
                </div>
              </div>

              {/* Step Navigation Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                  disabled={activeStepIndex === 0}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  title="Langkah sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveStepIndex(Math.min(workflow.steps.length - 1, activeStepIndex + 1))
                  }
                  disabled={activeStepIndex === workflow.steps.length - 1}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  title="Langkah berikutnya"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Description & Callout (TIPS, WARNING, INFO) */}
            {(workflow.steps[activeStepIndex]?.description ||
              (workflow.steps[activeStepIndex]?.callout &&
                workflow.steps[activeStepIndex].callout?.type !== 'none' &&
                workflow.steps[activeStepIndex].callout?.text)) && (
                <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-50 border-b border-slate-100 flex flex-col gap-2">
                  {workflow.steps[activeStepIndex]?.description && (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {workflow.steps[activeStepIndex].description}
                    </p>
                  )}
                  {workflow.steps[activeStepIndex]?.callout &&
                    workflow.steps[activeStepIndex].callout?.type !== 'none' &&
                    workflow.steps[activeStepIndex].callout?.text && (
                      <div
                        className={`p-2.5 sm:p-3 rounded-xl border text-xs flex items-start gap-2.5 shadow-2xs ${workflow.steps[activeStepIndex].callout!.type === 'tip'
                          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                          : workflow.steps[activeStepIndex].callout!.type === 'warning'
                            ? 'bg-amber-50/90 border-amber-200 text-amber-900'
                            : 'bg-blue-50/90 border-blue-200 text-blue-900'
                          }`}
                      >
                        {workflow.steps[activeStepIndex].callout!.type === 'tip' && (
                          <Lightbulb size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        )}
                        {workflow.steps[activeStepIndex].callout!.type === 'warning' && (
                          <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        )}
                        {workflow.steps[activeStepIndex].callout!.type === 'info' && (
                          <Info size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 flex flex-wrap items-center gap-1.5 leading-relaxed">
                          <span
                            className={`font-extrabold uppercase tracking-wide text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${workflow.steps[activeStepIndex].callout!.type === 'tip'
                              ? 'bg-emerald-200/80 text-emerald-900'
                              : workflow.steps[activeStepIndex].callout!.type === 'warning'
                                ? 'bg-amber-200/80 text-amber-900'
                                : 'bg-blue-200/80 text-blue-900'
                              }`}
                          >
                            {workflow.steps[activeStepIndex].callout!.type === 'tip'
                              ? 'TIPS'
                              : workflow.steps[activeStepIndex].callout!.type === 'warning'
                                ? 'PERINGATAN'
                                : 'INFO'}
                          </span>
                          <span className="font-medium text-slate-800">
                            {workflow.steps[activeStepIndex].callout!.text}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              )}

            {/* Screenshot */}
            <div className="bg-slate-950/5 p-2.5 sm:p-6 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[400px]">
              <img
                src={
                  workflow.steps[activeStepIndex]?.annotatedScreenshot ||
                  workflow.steps[activeStepIndex]?.screenshot
                }
                alt={workflow.steps[activeStepIndex]?.title}
                onClick={() => {
                  const activeStep = workflow.steps[activeStepIndex];
                  if (activeStep) {
                    setLightboxImage({
                      src: activeStep.annotatedScreenshot || activeStep.screenshot,
                      title: `${activeStepIndex + 1}. ${activeStep.title}`
                    });
                  }
                }}
                className="max-w-full rounded-xl shadow-md border border-slate-200 object-contain max-h-[580px] cursor-zoom-in active:scale-[0.99] transition-transform"
              />
              <div
                onClick={() => {
                  const activeStep = workflow.steps[activeStepIndex];
                  if (activeStep) {
                    setLightboxImage({
                      src: activeStep.annotatedScreenshot || activeStep.screenshot,
                      title: `${activeStepIndex + 1}. ${activeStep.title}`
                    });
                  }
                }}
                className="sm:hidden mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium cursor-pointer active:text-[#FF5C35]"
              >
                <ZoomIn size={13} className="text-[#FF5C35]" />
                <span>Ketuk gambar untuk memperbesar</span>
              </div>
            </div>

            {/* Bottom Stepper Progress Bar & Mobile Navigation */}
            <div className="p-3.5 sm:p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
              {/* Mobile Thumb-Friendly Navigation Buttons (sm:hidden) */}
              <div className="flex sm:hidden items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                  disabled={activeStepIndex === 0}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 active:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveStepIndex(Math.min(workflow.steps.length - 1, activeStepIndex + 1))
                  }
                  disabled={activeStepIndex === workflow.steps.length - 1}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF5C35] active:bg-[#E54A24] text-white disabled:opacity-40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Progress Bar & Dots */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Kemajuan: {Math.round(((activeStepIndex + 1) / workflow.steps.length) * 100)}%
                </span>
                <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none py-1">
                  {workflow.steps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveStepIndex(i)}
                      className={`h-2 rounded-full transition-all shrink-0 ${i === activeStepIndex ? 'w-6 bg-[#FF5C35]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                        }`}
                      title={`Ke langkah ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        Platform Dokumentasi Internal oleh <span className="font-semibold text-slate-700">StepFlow</span> • Copyright © {new Date().getFullYear()} Kanmo Group
      </footer>

      {/* Lightbox Modal Fullscreen */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col justify-between p-3 sm:p-6 select-none animate-in fade-in duration-150"
          onClick={() => setLightboxImage(null)}
        >
          {/* Top Bar inside Lightbox */}
          <div
            className="flex items-center justify-between text-white w-full max-w-5xl mx-auto py-1 sm:py-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0 pr-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C35] shrink-0" />
              <p className="text-xs sm:text-sm font-semibold truncate text-slate-200">
                {lightboxImage.title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-xs font-bold transition-colors shrink-0 shadow-lg cursor-pointer"
            >
              <X size={15} />
              <span>Tutup</span>
            </button>
          </div>

          {/* Image Centered */}
          <div
            className="flex-1 flex items-center justify-center overflow-auto p-1 sm:p-4"
            onClick={() => setLightboxImage(null)}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[98vw] sm:max-w-[92vw] object-contain rounded-lg shadow-2xl transition-transform"
            />
          </div>

          {/* Footer hint */}
          <div className="text-center text-[11px] text-slate-400 py-1 sm:py-2">
            Ketuk area luar atau tombol Tutup untuk kembali
          </div>
        </div>
      )}


      {/* Team PIN Modal for Editor Access */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
      />

      <div
        id="export-dom-extractor"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      >
        <div id="export-doc-title">{workflow.title}</div>
        <div id="export-doc-desc">{workflow.description || ''}</div>
        <div id="export-doc-category">{workflow.category || 'General SOP'}</div>
        {workflow.steps.map((st) => (
          <div key={st.id} id={`export-step-${st.id}`}>
            <div className="export-step-title">{st.title}</div>
            <div className="export-step-desc">{st.description || ''}</div>
            <div className="export-step-callout">{st.callout?.text || ''}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

