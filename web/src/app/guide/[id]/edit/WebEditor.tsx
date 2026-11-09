'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Lock,
  Sparkles,
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Loader2,
  Tag,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { isEditorAuthenticated, logoutEditor, getStoredEditorName, getActiveTeam, type TeamProfile } from '@/lib/auth';
import { PinModal } from '@/components/PinModal';
import { StepCanvas } from '@/components/StepCanvas';
import type { Workflow, Step } from '@/types';
import { ShieldCheck, History, Unlock } from 'lucide-react';

interface WebEditorProps {
  initialWorkflow: Workflow;
}

const CATEGORIES = [
  'Human Resources',
  'Finance & Accounting',
  'IT & Operations',
  'Customer Support',
  'Sales & Marketing',
  'General SOP'
];

export const WebEditor: React.FC<WebEditorProps> = ({ initialWorkflow }) => {
  const router = useRouter();
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showPinModal, setShowPinModal] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [activeTeam, setActiveTeam] = useState<TeamProfile | null>(null);

  useEffect(() => {
    if (!isEditorAuthenticated()) {
      setShowPinModal(true);
    } else {
      setIsAuth(true);
      setActiveTeam(getActiveTeam());
    }
  }, []);

  const handlePinSuccess = (team?: TeamProfile) => {
    setIsAuth(true);
    setActiveTeam(team || getActiveTeam());
    setShowPinModal(false);
  };

  const handlePinCancel = () => {
    setShowPinModal(false);
    if (!isAuth) {
      router.push(`/guide/${initialWorkflow.id}`);
    }
  };

  const currentStep = workflow.steps[selectedStepIndex] || workflow.steps[0];

  // Save changes to Cloud (API)
  const handleSaveToCloud = async (wfToSave?: Workflow) => {
    const editor = getStoredEditorName();
    const team = activeTeam || getActiveTeam();

    let authorSignature = 'Tim Perusahaan';
    if (editor && team) {
      authorSignature = (editor.trim().toLowerCase() === team.name.trim().toLowerCase())
        ? editor.trim()
        : `${editor.trim()} (${team.name.trim()})`;
    } else if (team) {
      authorSignature = team.name.trim();
    } else if (editor) {
      authorSignature = editor.trim();
    }

    const target = { ...(wfToSave || workflow), lastEditedBy: authorSignature, updatedAt: Date.now() };
    try {
      setSaveStatus('saving');
      const res = await fetch(`/api/workflows/${target.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(target)
      });
      if (res.ok) {
        setSaveStatus('saved');
        setWorkflow(target);
        router.refresh();
      } else {
        alert('Gagal menyimpan perubahan ke server.');
        setSaveStatus('unsaved');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('unsaved');
    }
  };

  // Update workflow fields
  const handleUpdateWorkflow = (updated: Partial<Workflow>, autoSave = false) => {
    const newWf: Workflow = {
      ...workflow,
      ...updated,
      updatedAt: Date.now()
    };
    setWorkflow(newWf);
    setSaveStatus('unsaved');
    if (autoSave) {
      handleSaveToCloud(newWf);
    }
  };

  // Update a step by ID
  const handleUpdateStepById = (stepId: string, updated: Partial<Step>) => {
    const newSteps = workflow.steps.map((st) =>
      st.id === stepId ? { ...st, ...updated } : st
    );
    handleUpdateWorkflow({ steps: newSteps });
  };

  // Reorder steps
  const moveStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= workflow.steps.length) return;

    const newSteps = [...workflow.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    newSteps.forEach((s, idx) => (s.order = idx + 1));
    handleUpdateWorkflow({ steps: newSteps });
    setSelectedStepIndex(targetIndex);
  };

  // Delete step
  const deleteStep = (index: number) => {
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

  const handleLogout = () => {
    if (confirm('Keluar dari Akses Editor Tim?')) {
      logoutEditor();
      router.push(`/guide/${workflow.id}`);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <PinModal
          isOpen={showPinModal}
          onClose={handlePinCancel}
          onSuccess={handlePinSuccess}
        />
        <div className="text-white text-sm flex items-center gap-2">
          <Loader2 className="animate-spin text-orange-500" size={18} />
          <span>Memverifikasi izin akses editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Top Studio Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/guide/${workflow.id}`}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
          <div className="h-5 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
              Studio Web
            </span>
            <input
              type="text"
              value={workflow.title}
              onChange={(e) => handleUpdateWorkflow({ title: e.target.value })}
              className="text-sm font-bold text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-1 rounded border border-transparent focus:border-slate-300 focus:outline-none transition-all truncate max-w-xs sm:max-w-md"
              placeholder="Judul Panduan..."
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Active Team Badge */}
          {activeTeam && (
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Unlock size={12} className="text-emerald-600" />
              <span>{activeTeam.name}</span>
            </div>
          )}

          {/* Internal Last Edited Badge */}
          {workflow.lastEditedBy && (
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Diedit: <strong className="text-slate-700">{workflow.lastEditedBy}</strong></span>
            </div>
          )}

          {/* Category Dropdown */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <Tag size={13} className="text-slate-400" />
            <select
              value={workflow.category || 'General SOP'}
              onChange={(e) => handleUpdateWorkflow({ category: e.target.value }, true)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg">
            {saveStatus === 'saving' && (
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Loader2 size={13} className="animate-spin text-orange-500" /> Menyimpan...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={14} /> Tersimpan
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="text-amber-600 flex items-center gap-1 font-semibold">
                ● Belum Disimpan
              </span>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={() => handleSaveToCloud()}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF5C35] hover:bg-[#E54A24] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <Save size={14} />
            <span>Simpan</span>
          </button>

          {/* View Guide Button */}
          <Link
            href={`/guide/${workflow.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Lihat Hasil</span>
          </Link>

          {/* Lock / Exit Editor */}
          <button
            onClick={handleLogout}
            title="Keluar dari mode editor"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <Lock size={15} />
          </button>
        </div>
      </nav>

      {/* Sub Bar: Guide Description / Subtitle */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-2 text-xs flex-shrink-0 z-30 shadow-xs">
        <span className="font-bold text-slate-600 shrink-0 flex items-center gap-1.5">
          <FileText size={13} className="text-[#FF5C35]" /> Subtitle / Deskripsi:
        </span>
        <input
          type="text"
          value={workflow.description || ''}
          onChange={(e) => handleUpdateWorkflow({ description: e.target.value })}
          placeholder="Tuliskan keterangan / subtitle panduan di sini (otomatis tersinkronisasi ke PDF, PPT, dan Word)..."
          className="flex-1 bg-white hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-[#FF5C35] focus:ring-1 focus:ring-[#FF5C35] rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-medium"
        />
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left Sidebar: Step Thumbnails */}
        <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-10 shadow-sm">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Daftar Langkah ({workflow.steps.length})
            </span>
            <button
              onClick={addManualStep}
              className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-[#FF5C35] text-[11px] font-bold rounded-lg transition-colors border border-orange-200"
            >
              <Plus size={13} /> Tambah
            </button>
          </div>

          {/* Step Thumbnails Scroll */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
            {workflow.steps.map((st, idx) => (
              <div
                key={st.id || idx}
                onClick={() => setSelectedStepIndex(idx)}
                className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  selectedStepIndex === idx
                    ? 'bg-orange-50/60 border-orange-400 shadow-sm ring-1 ring-orange-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center w-6 text-slate-400">
                  <span className="text-xs font-extrabold text-slate-700">{idx + 1}</span>
                </div>

                {st.screenshot && (
                  <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 relative">
                    <img
                      src={st.screenshot}
                      alt={`Step ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {st.title || `Langkah ${idx + 1}`}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {st.description || 'Tanpa keterangan'}
                  </p>
                </div>

                {/* Quick Reorder & Delete */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveStep(idx, 'up');
                    }}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveStep(idx, 'down');
                    }}
                    disabled={idx === workflow.steps.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStep(idx);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Canvas Workspace & Bottom Inspector */}
        <div className="flex-1 flex flex-col bg-slate-100 overflow-y-auto">
          {/* Main Visual Canvas Area */}
          <div className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full">
              {currentStep ? (
                <StepCanvas
                  key={currentStep.id}
                  step={currentStep}
                  onUpdateStep={(updated) => handleUpdateStepById(currentStep.id, updated)}
                />
              ) : (
                <div className="bg-white rounded-2xl border p-12 text-center text-slate-400">
                  Tidak ada langkah yang dipilih.
                </div>
              )}
            </div>
          </div>

          {/* Bottom Inspector Form: Step Title, Description, Callout */}
          {currentStep && (
            <div className="bg-white border-t border-slate-200 p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
              <div className="max-w-4xl w-full mx-auto flex flex-col gap-4">
                {/* Stepper Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                      {selectedStepIndex + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">Pengaturan Keterangan Langkah</span>
                    <span className="text-xs text-slate-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Tipe Aksi:</label>
                      <input
                        type="text"
                        list="webActionTypesList"
                        value={currentStep.actionType || ''}
                        onChange={(e) => handleUpdateStepById(currentStep.id, { actionType: e.target.value })}
                        placeholder="click, input..."
                        className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-lg px-2.5 py-0.5 w-28 focus:w-36 transition-all focus:outline-none focus:ring-1 focus:ring-orange-500"
                        title="Klik untuk memilih atau ketik tipe aksi manual"
                      />
                      <datalist id="webActionTypesList">
                        <option value="click" label="Click (Klik)" />
                        <option value="input" label="Input (Ketik)" />
                        <option value="change" label="Change (Ubah Nilai)" />
                        <option value="select" label="Select (Pilih Opsi)" />
                        <option value="navigation" label="Navigation (Buka URL)" />
                        <option value="manual" label="Manual (Aksi Manual)" />
                      </datalist>
                    </div>
                  </div>

                  {/* Prev / Next controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedStepIndex((prev) => Math.max(0, prev - 1))}
                      disabled={selectedStepIndex === 0}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-600 flex items-center gap-1"
                    >
                      <ChevronLeft size={14} /> Sebelumnya
                    </button>
                    <button
                      onClick={() => setSelectedStepIndex((prev) => Math.min(workflow.steps.length - 1, prev + 1))}
                      disabled={selectedStepIndex === workflow.steps.length - 1}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-600 flex items-center gap-1"
                    >
                      Berikutnya <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Title & Action Type */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">Judul Instruksi:</label>
                      <input
                        type="text"
                        value={currentStep.title || ''}
                        onChange={(e) => handleUpdateStepById(currentStep.id, { title: e.target.value })}
                        placeholder="Contoh: Click on 'Submit Application' button"
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">Deskripsi / Penjelasan:</label>
                      <textarea
                        rows={2}
                        value={currentStep.description || ''}
                        onChange={(e) => handleUpdateStepById(currentStep.id, { description: e.target.value })}
                        placeholder="Contoh: Ensure all required fields are filled before submitting the form..."
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed resize-none"
                      />
                    </div>
                  </div>

                  {/* Callout Notes */}
                  <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-orange-500" /> Catatan Tambahan (Callout)
                    </label>

                    <div className="grid grid-cols-4 gap-1">
                      {(['none', 'tip', 'info', 'warning'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            const newCallout = {
                              type,
                              text: currentStep.callout?.text || ''
                            };
                            handleUpdateStepById(currentStep.id, { callout: newCallout });
                          }}
                          className={`py-1 text-[10px] font-bold rounded-lg border capitalize transition-all ${
                            (currentStep.callout?.type || 'none') === type
                              ? 'bg-white border-orange-500 text-orange-600 shadow-xs'
                              : 'border-slate-200 text-slate-500 hover:bg-white'
                          }`}
                        >
                          {type === 'none' ? 'Tidak' : type}
                        </button>
                      ))}
                    </div>

                    {currentStep.callout?.type && currentStep.callout.type !== 'none' && (
                      <textarea
                        rows={2}
                        value={currentStep.callout.text || ''}
                        onChange={(e) => {
                          const newCallout = {
                            type: currentStep.callout?.type || 'tip',
                            text: e.target.value
                          };
                          handleUpdateStepById(currentStep.id, { callout: newCallout });
                        }}
                        placeholder={`Tulis catatan ${currentStep.callout.type}...`}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 mt-1 resize-none"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

