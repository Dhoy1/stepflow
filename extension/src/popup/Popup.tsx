import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Square,
  ExternalLink,
  FileText,
  ChevronRight,
  Sparkles,
  Tag,
  PlusCircle,
  Clock,
  Trash2,
  FolderPlus
} from 'lucide-react';
import { getAllWorkflows, deleteWorkflow } from '../lib/db';
import { DEFAULT_WORKFLOWS_API } from '../lib/config';
import type { Workflow, RecordingStatus } from '../types';

const DEFAULT_CATEGORIES = [
  'General',
  'HR & People',
  'Finance & Accounting',
  'IT & Systems',
  'Operations',
  'Sales & Marketing'
];

export const Popup: React.FC = () => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [stepCount, setStepCount] = useState(0);
  const [activeTabTitle, setActiveTabTitle] = useState('');
  const [recentWorkflows, setRecentWorkflows] = useState<Workflow[]>([]);

  // Recording Mode: 'new' vs 'append'
  const [recordMode, setRecordMode] = useState<'new' | 'append'>('new');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [appendToWorkflowId, setAppendToWorkflowId] = useState('');

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (res) => {
      if (res) {
        setStatus(res.status || 'idle');
        setStepCount(res.stepCount || 0);
      }
    });

    const messageListener = (msg: any) => {
      if (msg.type === 'RECORDING_STATUS_CHANGED' && msg.payload) {
        setStatus(msg.payload.status);
        setStepCount(msg.payload.stepCount || 0);
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setActiveTabTitle(tabs[0].title || 'Current Tab');
        setCustomTitle(tabs[0].title || 'New Workflow Guide');
      }
    });

    loadWorkflows();

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const loadWorkflows = async () => {
    try {
      const localList = await getAllWorkflows();
      let list = localList;

      // Ambil daftar panduan dari Cloud Portal agar teman tim bisa langsung memilih & melanjutkannya
      try {
        const res = await fetch(DEFAULT_WORKFLOWS_API);
        if (res.ok) {
          const cloudList: Workflow[] = await res.json();
          if (Array.isArray(cloudList) && cloudList.length > 0) {
            const map = new Map<string, Workflow>();
            cloudList.forEach((w) => map.set(w.id, w));
            localList.forEach((w) => map.set(w.id, w));
            list = Array.from(map.values()).sort(
              (a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0)
            );
          }
        }
      } catch { }

      setRecentWorkflows(list);
      if (list.length > 0 && !appendToWorkflowId) {
        setAppendToWorkflowId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startRecording = () => {
    const category = customCategory.trim() || selectedCategory;
    const payload =
      recordMode === 'append' && appendToWorkflowId
        ? { appendToId: appendToWorkflowId }
        : {
          title: customTitle.trim() || activeTabTitle || 'Panduan Alur Baru',
          category
        };

    chrome.runtime.sendMessage({ type: 'START_RECORDING', payload }, (res) => {
      if (chrome.runtime.lastError) {
        alert('Gagal memulai rekaman: ' + chrome.runtime.lastError.message);
        return;
      }
      if (res && res.error) {
        alert('Perhatian:\n' + res.error);
        return;
      }
      if (res && res.status) {
        setStatus(res.status);
        window.close();
      }
    });
  };

  const stopRecording = () => {
    chrome.runtime.sendMessage({ type: 'STOP_RECORDING' }, (res) => {
      if (chrome.runtime.lastError) {
        alert('Gagal menyelesaikan rekaman: ' + chrome.runtime.lastError.message);
        return;
      }
      if (res && res.workflowId) {
        setStatus('idle');
        window.close();
      }
    });
  };

  const discardRecording = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan rekaman ini? Semua langkah yang telah terekam akan dihapus.')) {
      chrome.runtime.sendMessage({ type: 'DISCARD_RECORDING' }, () => {
        setStatus('idle');
        setStepCount(0);
        window.close();
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Hapus panduan ini?')) {
      await deleteWorkflow(id);
      loadWorkflows();
    }
  };

  const openEditor = (id?: string) => {
    chrome.runtime.sendMessage({ type: 'OPEN_EDITOR', payload: { id } });
    window.close();
  };

  return (
    <div className="flex flex-col min-h-[500px] bg-slate-50 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF5C35] to-[#FF8C66] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">StepFlow</h1>
            <p className="text-[10px] text-slate-400 font-medium">Kanmo Workflow Recorder</p>
          </div>
        </div>
        <button
          onClick={() => openEditor()}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
        >
          Studio <ExternalLink size={12} />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {status === 'recording' || status === 'paused' ? (
          /* Ongoing Recording Card */
          <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-orange-600 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                {status === 'recording' ? 'Sedang Merekam' : 'Dijeda'}
              </span>
              <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                {stepCount} Langkah
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-1">
              Target: <span className="text-slate-700 font-medium">{activeTabTitle}</span>
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={stopRecording}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
              >
                <Square size={13} fill="currentColor" /> Selesai
              </button>
              <button
                onClick={() => {
                  chrome.runtime.sendMessage(
                    {
                      type: status === 'recording' ? 'PAUSE_RECORDING' : 'RESUME_RECORDING'
                    },
                    (res) => setStatus(res.status)
                  );
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
              >
                {status === 'recording' ? (
                  <>
                    <Pause size={13} /> Jeda
                  </>
                ) : (
                  <>
                    <Play size={13} fill="currentColor" /> Lanjut
                  </>
                )}
              </button>
            </div>

            <button
              onClick={discardRecording}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-medium text-xs transition-all border border-rose-100 hover:border-rose-200"
            >
              <Trash2 size={13} /> Batalkan Rekaman
            </button>
          </div>
        ) : (
          /* Ready to Record - Mode & Category Selector */
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex flex-col gap-3">
              {/* Mode Toggle: Baru vs Lanjutkan */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setRecordMode('new')}
                  className={`flex-1 py-1.5 rounded-md transition-all ${recordMode === 'new'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  ● Rekam Baru
                </button>
                <button
                  onClick={() => setRecordMode('append')}
                  disabled={recentWorkflows.length === 0}
                  className={`flex-1 py-1.5 rounded-md transition-all disabled:opacity-40 ${recordMode === 'append'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  ➕ Lanjut Sebelumnya
                </button>
              </div>

              {recordMode === 'new' ? (
                <>
                  {/* Category Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Tag size={12} /> Pilih / Tambah Kategori
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="custom">+ Kategori Kustom...</option>
                    </select>

                    {selectedCategory === 'custom' && (
                      <input
                        type="text"
                        placeholder="Ketik nama kategori baru..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="text-xs border border-orange-200 rounded-lg p-2 bg-orange-50/40 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    )}
                  </div>
                </>
              ) : (
                /* Append to Existing Workflow */
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-500">
                    Pilih Panduan yang Mau Ditambah Langkahnya:
                  </label>
                  <select
                    value={appendToWorkflowId}
                    onChange={(e) => setAppendToWorkflowId(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {recentWorkflows.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.title} ({w.steps.length} langkah)
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400">
                    Langkah baru akan ditambahkan di urutan akhir panduan ini.
                  </span>
                </div>
              )}

              <button
                onClick={startRecording}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FF5C35] hover:bg-[#E54A24] text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98]"
              >
                <Play size={14} fill="currentColor" />
                {recordMode === 'new' ? 'Mulai Rekam Alur' : 'Lanjutkan Merekam'}
              </button>
            </div>
          </div>
        )}

        {/* Saved Workflows & Delete capability */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Daftar Panduan ({recentWorkflows.length})
            </span>
            <button onClick={() => openEditor()} className="text-[11px] text-orange-600 hover:underline font-medium">
              Kelola Semua
            </button>
          </div>

          <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
            {recentWorkflows.length === 0 ? (
              <div className="bg-white rounded-lg p-3 text-center border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">Belum ada panduan tersimpan.</p>
              </div>
            ) : (
              recentWorkflows.map((wf) => (
                <div
                  key={wf.id}
                  onClick={() => openEditor(wf.id)}
                  className="flex items-center justify-between p-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-6 h-6 rounded bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                      <FileText size={12} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-orange-600">
                        {wf.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium text-[9px]">
                          {wf.category || 'Umum'}
                        </span>
                        <span>•</span>
                        <span>{wf.steps.length} langkah</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDelete(e, wf.id)}
                      title="Hapus Panduan"
                      className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-rose-50"
                    >
                      <Trash2 size={13} />
                    </button>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
