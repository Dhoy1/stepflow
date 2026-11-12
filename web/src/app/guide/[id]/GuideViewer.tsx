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
  Edit,
  Lock,
  Globe,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { exportToWord } from '@/lib/exporters/docxExporter';
import { exportToPptx } from '@/lib/exporters/pptxExporter';
import { exportToPdf } from '@/lib/exporters/pdfExporter';
import { isEditorAuthenticated, getActiveTeam, getStoredEditorName } from '@/lib/auth';
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
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExport = async (format: 'word' | 'pptx' | 'pdf') => {
    try {
      setIsExporting(format);
      if (format === 'word') await exportToWord(workflow);
      if (format === 'pptx') await exportToPptx(workflow);
      if (format === 'pdf') await exportToPdf(workflow);
    } catch (e: any) {
      alert('Gagal mengekspor: ' + e.message);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Semua Panduan</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#FF5C35] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              S
            </div>
            <h1 className="text-sm font-bold text-slate-900 truncate">
              {workflow.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('scroll')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${viewMode === 'scroll'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Mode Gulir
            </button>
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${viewMode === 'interactive'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Mode Interaktif
            </button>
          </div>

          {/* Edit Guide Button (Protected by PIN) */}
          <button
            onClick={handleEditClick}
            title="Edit judul, keterangan langkah, atau gambar (Perlu PIN Tim)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#FF5C35] transition-all shadow-xs"
          >
            <Edit size={14} />
            <span>Edit Panduan & Teks</span>
          </button>

          {/* Copy Share Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            <span>{isCopied ? 'Tersalin!' : 'Bagikan'}</span>
          </button>

          {/* Export Group */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleExport('word')}
              disabled={isExporting !== null}
              title="Unduh format Word"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isExporting === 'word' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              <span className="hidden sm:inline">Word</span>
            </button>

            <button
              onClick={() => handleExport('pptx')}
              disabled={isExporting !== null}
              title="Unduh format PowerPoint"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isExporting === 'pptx' ? <Loader2 size={14} className="animate-spin" /> : <Presentation size={14} />}
              <span className="hidden sm:inline">PPT</span>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting !== null}
              title="Unduh format PDF"
              className="px-3 py-1.5 rounded-lg bg-[#FF5C35] hover:bg-[#E54A24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              {isExporting === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
              <span>PDF</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-8">
        {/* Document Header Card */}
        <header className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
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

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {workflow.title}
          </h1>

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
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-[#FF5C35] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        {idx + 1}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        {step.title}
                      </h2>
                    </div>
                    {isAuth && (
                      <button
                        onClick={handleEditClick}
                        className="text-xs text-slate-400 hover:text-orange-600 flex items-center gap-1 font-semibold px-2 py-1 rounded-md hover:bg-orange-50 transition-colors"
                        title="Edit teks instruksi atau gambar langkah ini"
                      >
                        <Edit size={12} /> Edit Teks
                      </button>
                    )}
                  </div>

                  {step.description && (
                    <p className="text-xs sm:text-sm text-slate-600 ml-9 leading-relaxed">
                      {step.description}
                    </p>
                  )}

                  {/* Callout */}
                  {step.callout && step.callout.type !== 'none' && step.callout.text && (
                    <div
                      className={`ml-9 mt-1 p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${step.callout.type === 'tip'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : step.callout.type === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : 'bg-blue-50 border-blue-200 text-blue-800'
                        }`}
                    >
                      <Sparkles size={14} className="flex-shrink-0 mt-0.5" />
                      <span>{step.callout.text}</span>
                    </div>
                  )}
                </div>

                {/* Screenshot Visual */}
                <div className="bg-slate-950/5 p-4 sm:p-6 flex items-center justify-center">
                  <img
                    src={step.annotatedScreenshot || step.screenshot}
                    alt={step.title}
                    className="max-w-full rounded-xl shadow-md border border-slate-200 object-contain max-h-[550px]"
                    loading="lazy"
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Mode: Interactive Stepper Carousel */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FF5C35] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {activeStepIndex + 1}
                </span>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Langkah {activeStepIndex + 1} dari {workflow.steps.length}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    {workflow.steps[activeStepIndex]?.title}
                  </h2>
                </div>
              </div>

              {/* Step Navigation Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                  disabled={activeStepIndex === 0}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setActiveStepIndex(Math.min(workflow.steps.length - 1, activeStepIndex + 1))
                  }
                  disabled={activeStepIndex === workflow.steps.length - 1}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors"
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
              <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex flex-col gap-2.5">
                {workflow.steps[activeStepIndex]?.description && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {workflow.steps[activeStepIndex].description}
                  </p>
                )}
                {workflow.steps[activeStepIndex]?.callout &&
                  workflow.steps[activeStepIndex].callout?.type !== 'none' &&
                  workflow.steps[activeStepIndex].callout?.text && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                        workflow.steps[activeStepIndex].callout!.type === 'tip'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : workflow.steps[activeStepIndex].callout!.type === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : 'bg-blue-50 border-blue-200 text-blue-800'
                      }`}
                    >
                      <Sparkles size={14} className="flex-shrink-0 mt-0.5" />
                      <span>{workflow.steps[activeStepIndex].callout!.text}</span>
                    </div>
                  )}
              </div>
            )}

            {/* Screenshot */}
            <div className="bg-slate-950/5 p-6 flex items-center justify-center min-h-[400px]">
              <img
                src={
                  workflow.steps[activeStepIndex]?.annotatedScreenshot ||
                  workflow.steps[activeStepIndex]?.screenshot
                }
                alt={workflow.steps[activeStepIndex]?.title}
                className="max-w-full rounded-xl shadow-md border border-slate-200 object-contain max-h-[580px]"
              />
            </div>

            {/* Bottom Stepper Progress Bar */}
            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                Kemajuan: {Math.round(((activeStepIndex + 1) / workflow.steps.length) * 100)}%
              </span>
              <div className="flex items-center gap-1">
                {workflow.steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStepIndex(i)}
                    className={`h-2 rounded-full transition-all ${i === activeStepIndex ? 'w-6 bg-[#FF5C35]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        Platform Dokumentasi Internal oleh <span className="font-semibold text-slate-700">StepFlow</span> • Copyright © {new Date().getFullYear()} Kanmo Group
      </footer>


      {/* Team PIN Modal for Editor Access */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
      />
    </div>
  );
};

