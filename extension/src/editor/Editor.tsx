import React, { useEffect, useState } from 'react';
import {
  FileDown,
  FileText,
  Presentation,
  FileCheck,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Save,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Loader2,
  Share2,
  ExternalLink,
  Copy,
  User
} from 'lucide-react';
import { db, getWorkflow, saveWorkflow, getAllWorkflows } from '../lib/db';
import { createDemoWorkflow } from '../lib/demoData';
import { exportToWord } from '../lib/exporters/docxExporter';
import { exportToPptx } from '../lib/exporters/pptxExporter';
import { exportToPdf } from '../lib/exporters/pdfExporter';
import { StepCanvas } from './StepCanvas';
import type { Workflow, Step } from '../types';

export const Editor: React.FC = () => {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [allWorkflows, setAllWorkflows] = useState<Workflow[]>([]);
  const [shareModalUrl, setShareModalUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [apiUrl, setApiUrl] = useState<string>(() => {
    return 'https://support.kanmoemployeeportal.com/api/workflows';
  });
  const [editorName, setEditorName] = useState<string>(() => {
    return localStorage.getItem('stepflow_editor_name') || 'Tim Perusahaan';
  });

  useEffect(() => {
    // 1. Check URL param ?id=...
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    loadInitialWorkflow(id);
  }, []);

  const loadInitialWorkflow = async (id: string | null) => {
    let list = await getAllWorkflows();

    if (id) {
      let found = await getWorkflow(id);
      if (!found) {
        try {
          const res = await fetch(`https://support.kanmoemployeeportal.com/api/workflows/${id}`);
          if (res.ok) {
            found = await res.json();
            if (found) {
              await saveWorkflow(found);
              list = await getAllWorkflows();
            }
          }
        } catch { }
      }

      if (found) {
        setAllWorkflows(list);
        setWorkflow(found);
        return;
      }
    }

    setAllWorkflows(list);
    // Default to latest workflow if available
    if (list.length > 0) {
      setWorkflow(list[0]);
    }
  };

  // Auto-save changes to IndexedDB
  const handleUpdateWorkflow = async (updated: Partial<Workflow>) => {
    if (!workflow) return;
    setSaveStatus('saving');
    const newWf: Workflow = {
      ...workflow,
      ...updated,
      updatedAt: Date.now()
    };
    setWorkflow(newWf);
    await saveWorkflow(newWf);
    try {
      if (chrome?.runtime?.id) {
        chrome.runtime.sendMessage({
          type: 'WORKFLOW_UPDATED',
          payload: { workflow: newWf }
        });
      }
    } catch { }
    setTimeout(() => setSaveStatus('saved'), 300);
  };

  // Update a single step by ID
  const handleUpdateStepById = (stepId: string, updated: Partial<Step>) => {
    if (!workflow) return;
    const newSteps = workflow.steps.map((st) =>
      st.id === stepId ? { ...st, ...updated } : st
    );
    handleUpdateWorkflow({ steps: newSteps });
  };

  // Delete entire workflow
  const handleDeleteWorkflow = async () => {
    if (!workflow) return;
    if (confirm(`Apakah Anda yakin ingin menghapus seluruh panduan "${workflow.title}"?`)) {
      await db.workflows.delete(workflow.id);
      const remaining = await getAllWorkflows();
      setAllWorkflows(remaining);
      setWorkflow(remaining.length > 0 ? remaining[0] : null);
    }
  };
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (!workflow) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= workflow.steps.length) return;

    const newSteps = [...workflow.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    // Recalculate order numbers
    newSteps.forEach((s, idx) => (s.order = idx + 1));

    handleUpdateWorkflow({ steps: newSteps });
    setSelectedStepIndex(targetIndex);
  };

  // Delete step
  const deleteStep = (index: number) => {
    if (!workflow) return;
    if (workflow.steps.length <= 1) {
      alert('Minimal harus ada 1 langkah dalam panduan.');
      return;
    }
    if (confirm(`Hapus langkah ${index + 1}?`)) {
      const stepToDelete = workflow.steps[index];
      const newSteps = workflow.steps.filter((st) => st.id !== stepToDelete.id);
      newSteps.forEach((s, idx) => (s.order = idx + 1));
      handleUpdateWorkflow({ steps: newSteps });
      if (selectedStepIndex >= newSteps.length) {
        setSelectedStepIndex(Math.max(0, newSteps.length - 1));
      }
    }
  };

  // Add manual step
  const addManualStep = () => {
    if (!workflow) return;
    const newStepIndex = workflow.steps.length + 1;
    const newStep: Step = {
      id: 'step_manual_' + Date.now(),
      order: newStepIndex,
      actionType: 'manual',
      title: `Langkah ${newStepIndex}`,
      description: 'Tuliskan instruksi atau catatan untuk langkah ini.',
      url: workflow.targetUrl || '',
      pageTitle: workflow.title || '',
      screenshot: '', // Kosong agar user bisa upload atau paste gambar
      originalScreenshot: '',
      annotatedScreenshot: '',
      highlights: [],
      numberBadges: [],
      arrows: [],
      blurRegions: [],
      callout: { type: 'none', text: '' }
    };
    const newSteps = [...workflow.steps, newStep];
    handleUpdateWorkflow({ steps: newSteps });
    setSelectedStepIndex(newSteps.length - 1);
  };

  // Publish to Cloud Web App
  const handlePublish = async () => {
    if (!workflow || workflow.steps.length === 0) {
      alert('Tidak ada langkah untuk dibagikan.');
      return;
    }

    let targetApiUrl = (apiUrl || 'https://support.kanmoemployeeportal.com/api/workflows').trim();
    if (!targetApiUrl.includes('/api/workflows')) {
      targetApiUrl = targetApiUrl.replace(/\/+$/, '') + '/api/workflows';
    }

    try {
      setIsPublishing(true);
      const payload = {
        ...workflow,
        lastEditedBy: editorName || workflow.author || 'Tim Perusahaan',
        author: workflow.author || editorName || 'Tim Perusahaan'
      };
      const res = await fetch(targetApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errorMsg = `Server merespons status ${res.status}`;
        try {
          const errData = await res.json();
          if (errData && errData.error) errorMsg += ` - ${errData.error}`;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (data.shareUrl) {
        setShareModalUrl(data.shareUrl);
        navigator.clipboard.writeText(data.shareUrl);
      }
    } catch (err: any) {
      alert(`Gagal mempublikasikan ke cloud: ${err.message}\nPastikan server web app (Next.js) sedang berjalan di ${targetApiUrl}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Export handlers
  const handleExport = async (format: 'word' | 'pptx' | 'pdf') => {
    if (!workflow || workflow.steps.length === 0) {
      alert('Tidak ada langkah untuk diekspor.');
      return;
    }

    try {
      setIsExporting(format);
      if (format === 'word') {
        await exportToWord(workflow);
      } else if (format === 'pptx') {
        await exportToPptx(workflow);
      } else if (format === 'pdf') {
        await exportToPdf(workflow);
      }
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengekspor: ' + err.message);
    } finally {
      setIsExporting(null);
    }
  };

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-600 p-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 shadow-sm">
          <FileText size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Belum Ada Rekaman Alur</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-sm text-center">
          Silakan buka website yang ingin Anda buatkan tutorialnya, lalu klik ikon StepFlow dan pilih "Mulai Rekam Alur".
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={async () => {
              const demo = createDemoWorkflow();
              await saveWorkflow(demo);
              setWorkflow(demo);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5C35] hover:bg-[#E54A24] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles size={14} /> Muat Contoh Panduan (Demo Data)
          </button>
          <span className="text-[11px] text-slate-400">
            Gunakan data contoh untuk menguji ekspor Word, PowerPoint, & PDF secara instan
          </span>
        </div>
      </div>
    );
  }

  const currentStep = workflow.steps[selectedStepIndex];

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5C35] to-[#FF8C66] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={workflow.title}
                onChange={(e) => handleUpdateWorkflow({ title: e.target.value })}
                className="text-lg font-bold text-slate-900 border-none bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 rounded px-1.5 py-0.5 -ml-1.5 transition-all outline-none"
                placeholder="Judul Panduan / Tutorial..."
              />
              <input
                type="text"
                value={workflow.category || 'Umum'}
                onChange={(e) => handleUpdateWorkflow({ category: e.target.value })}
                title="Klik untuk mengubah kategori"
                className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hover:border-orange-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 max-w-[140px]"
                placeholder="Kategori..."
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>{workflow.steps.length} Langkah</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {saveStatus === 'saved' ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-500" /> Tersimpan di Browser
                  </>
                ) : (
                  <>
                    <Loader2 size={12} className="animate-spin text-orange-500" /> Menyimpan...
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Export Buttons Group */}
        <div className="flex items-center gap-2.5">
          {/* Editor Name Input */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <User size={13} className="text-slate-400" />
            <span className="text-slate-400 text-[11px]">Editor:</span>
            <input
              type="text"
              value={editorName}
              onChange={(e) => {
                setEditorName(e.target.value);
                localStorage.setItem('stepflow_editor_name', e.target.value);
              }}
              placeholder="Nama Anda"
              className="bg-transparent font-semibold text-slate-700 outline-none w-28 text-xs"
            />
          </div>

          {/* Cloud Share / Publish */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all border border-emerald-200 shadow-sm disabled:opacity-50"
          >
            {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
            Bagikan Link Online
          </button>

          {/* Word Export */}
          <button
            onClick={() => handleExport('word')}
            disabled={isExporting !== null}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-all border border-blue-200 disabled:opacity-50"
          >
            {isExporting === 'word' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
            Word (.docx)
          </button>

          {/* PPT Export */}
          <button
            onClick={() => handleExport('pptx')}
            disabled={isExporting !== null}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-semibold transition-all border border-amber-200 disabled:opacity-50"
          >
            {isExporting === 'pptx' ? <Loader2 size={14} className="animate-spin" /> : <Presentation size={14} />}
            PowerPoint (.pptx)
          </button>

          {/* PDF Export */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting !== null}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF5C35] hover:bg-[#E54A24] text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            {isExporting === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
            Ekspor PDF
          </button>

          {/* Delete Entire Guide Button */}
          <button
            onClick={handleDeleteWorkflow}
            title="Hapus Seluruh Panduan Ini"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1 border border-slate-200"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Step Thumbnails */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Langkah</span>
            <button
              onClick={addManualStep}
              className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold"
            >
              <Plus size={14} /> Tambah
            </button>
          </div>

          <div className="p-3 space-y-2 flex-1">
            {workflow.steps.map((st, idx) => {
              const isSelected = idx === selectedStepIndex;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStepIndex(idx)}
                  className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                    ? 'bg-orange-50/60 border-orange-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-xs font-semibold truncate ${isSelected ? 'text-orange-950' : 'text-slate-800'
                          }`}
                      >
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{st.description}</p>
                    </div>
                  </div>

                  {/* Reorder and Delete Controls on Hover */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStep(idx, 'up');
                      }}
                      disabled={idx === 0}
                      title="Geser ke Atas"
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStep(idx, 'down');
                      }}
                      disabled={idx === workflow.steps.length - 1}
                      title="Geser ke Bawah"
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStep(idx);
                      }}
                      title="Hapus Langkah"
                      className="p-1 rounded hover:bg-rose-100 text-rose-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center Canvas & Step Editor */}
        <main className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto flex flex-col gap-6">
          {currentStep && (
            <>
              {/* Step Title & Instruction Input */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-orange-500 text-white font-bold text-xs px-2.5 py-1 rounded-full">
                      Langkah {selectedStepIndex + 1} dari {workflow.steps.length}
                    </span>
                    <span className="text-xs text-slate-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-500">Tipe Aksi:</label>
                      <input
                        type="text"
                        list="actionTypesList"
                        value={currentStep.actionType || ''}
                        onChange={(e) => handleUpdateStepById(currentStep.id, { actionType: e.target.value })}
                        placeholder="click, input..."
                        className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-lg px-2.5 py-1 w-28 focus:w-36 transition-all focus:outline-none focus:ring-1 focus:ring-orange-500"
                        title="Klik untuk memilih atau ketik tipe aksi manual"
                      />
                      <datalist id="actionTypesList">
                        <option value="click" label="Click (Klik)" />
                        <option value="input" label="Input (Ketik)" />
                        <option value="change" label="Change (Ubah Nilai)" />
                        <option value="select" label="Select (Pilih Opsi)" />
                        <option value="navigation" label="Navigation (Buka URL)" />
                        <option value="manual" label="Manual (Aksi Manual)" />
                      </datalist>
                    </div>
                  </div>

                  {/* Next / Prev Navigation */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedStepIndex(Math.max(0, selectedStepIndex - 1))}
                      disabled={selectedStepIndex === 0}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedStepIndex(Math.min(workflow.steps.length - 1, selectedStepIndex + 1))
                      }
                      disabled={selectedStepIndex === workflow.steps.length - 1}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Judul Instruksi Langkah</label>
                  <input
                    type="text"
                    value={currentStep.title}
                    onChange={(e) => handleUpdateStepById(currentStep.id, { title: e.target.value })}
                    className="text-base font-semibold text-slate-900 border border-slate-200 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Contoh: Klik tombol 'Simpan'"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Deskripsi / Penjelasan Tambahan</label>
                  <textarea
                    rows={2}
                    value={currentStep.description}
                    onChange={(e) => handleUpdateStepById(currentStep.id, { description: e.target.value })}
                    className="text-sm text-slate-700 border border-slate-200 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                    placeholder="Contoh: Pastikan semua data telah terisi sebelum menekan tombol simpan."
                  />
                </div>

                {/* Callout / Tips Picker */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Catatan Khusus (Callout):</span>
                    {(['none', 'tip', 'warning', 'info'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          handleUpdateStepById(currentStep.id, {
                            callout: {
                              type,
                              text: currentStep.callout?.text || ''
                            }
                          })
                        }
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${(currentStep.callout?.type || 'none') === type
                          ? 'bg-orange-100 text-orange-700 font-bold'
                          : 'text-slate-500 hover:bg-slate-100'
                          }`}
                      >
                        {type === 'none'
                          ? 'Tidak Ada'
                          : type === 'tip'
                            ? '💡 Tips'
                            : type === 'warning'
                              ? '⚠️ Peringatan'
                              : 'ℹ️ Info'}
                      </button>
                    ))}
                  </div>

                  {currentStep.callout && currentStep.callout.type !== 'none' && (
                    <input
                      type="text"
                      value={currentStep.callout.text}
                      onChange={(e) =>
                        handleUpdateStepById(currentStep.id, {
                          callout: {
                            type: currentStep.callout?.type || 'tip',
                            text: e.target.value
                          }
                        })
                      }
                      placeholder={`Tuliskan pesan ${currentStep.callout.type}...`}
                      className="text-xs border border-orange-200 bg-orange-50/40 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  )}
                </div>
              </div>

              {/* Screenshot & Canvas Tool */}
              <StepCanvas
                key={currentStep.id}
                step={currentStep}
                onUpdateStep={(updated) => handleUpdateStepById(currentStep.id, updated)}
              />
            </>
          )}
        </main>
      </div>

      {/* Share to Cloud Modal */}
      {shareModalUrl && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Berhasil Dipublikasikan!</h3>
                <p className="text-xs text-slate-500">Tautan panduan online Anda siap dibagikan ke teman/tim.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="text"
                readOnly
                value={shareModalUrl}
                className="bg-transparent text-xs text-slate-700 font-medium flex-1 outline-none truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareModalUrl);
                  alert('Tautan disalin ke clipboard!');
                }}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Copy size={12} /> Salin
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShareModalUrl(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <a
                href={shareModalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FF5C35] hover:bg-[#E54A24] text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Buka Panduan <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
