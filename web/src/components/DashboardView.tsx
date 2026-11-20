'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Sparkles,
  ExternalLink,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  Tag,
  Filter,
  Lock,
  Unlock,
  Edit,
  ChevronDown,
  Check
} from 'lucide-react';
import { isEditorAuthenticated, logoutEditor, getActiveTeam, getStoredEditorName, type TeamProfile } from '@/lib/auth';
import { PinModal } from './PinModal';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import type { Workflow } from '@/types';

interface DashboardViewProps {
  initialWorkflows: Workflow[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ initialWorkflows }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [activeTeam, setActiveTeam] = useState<TeamProfile | null>(null);
  const [editorName, setEditorName] = useState<string>('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const authStatus = isEditorAuthenticated();
    setIsAuth(authStatus);
    if (authStatus) {
      setActiveTeam(getActiveTeam());
      setEditorName(getStoredEditorName());
    }
  }, []);

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract all unique categories
  const categories = ['Semua', ...Array.from(new Set(workflows.map((w) => w.category || 'Umum')))];

  // Menghitung jumlah panduan di tiap kategori
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: workflows.length };
    workflows.forEach((w) => {
      const cat = w.category || 'Umum';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [workflows]);

  // Filter workflows
  const filteredWorkflows = workflows.filter((w) => {
    const matchesCategory = selectedCategory === 'Semua' || (w.category || 'Umum') === selectedCategory;
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus panduan "${title}"?`)) {
      try {
        const res = await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setWorkflows((prev) => prev.filter((w) => w.id !== id));
        } else {
          alert('Gagal menghapus panduan.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 sm:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5C35] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            S
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">StepFlow Hub</h1>
            <p className="text-[11px] text-slate-400 font-medium">Koleksi Panduan & SOP Tim</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-orange-50 text-orange-700 font-semibold px-3 py-1.5 rounded-full border border-orange-200">
            {workflows.length} Panduan Tersedia
          </span>

          {/* tombol pilihan bahasa */}
          <LanguageSwitcher />

          {/* Team PIN Access */}
          {isAuth ? (
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border shadow-xs ${activeTeam?.badgeColor === 'blue'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : activeTeam?.badgeColor === 'purple'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
              >
                <Unlock size={13} />
                <span>{activeTeam ? activeTeam.name : 'Tim Editor Aktif'}</span>
                {editorName && (
                  <span className="font-medium text-slate-500 ml-0.5">• {editorName}</span>
                )}
              </span>
              <button
                onClick={() => {
                  logoutEditor();
                  setIsAuth(false);
                  setActiveTeam(null);
                  setEditorName('');
                }}
                className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg font-semibold px-2 py-1 transition-all"
                title="Kunci Akses Editor"
              >
                Kunci
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPinModal(true)}
              className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
            >
              <Lock size={13} /> Akses Tim
            </button>
          )}
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-10 px-6 sm:px-12 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            <Sparkles size={13} />
            <span>Pusat Dokumentasi & Onboarding Tim</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Semua panduan alur website dalam satu tempat
            <br />
            "KANMOGROUP"
          </h2>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto p-6 sm:p-12 flex-1 flex flex-col gap-6">
        {/* Controls: Search & Category Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-30">
          {/* Category Dropdown (PILIH PANDUAN) */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`flex items-center justify-between sm:justify-start gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-2xs w-full sm:w-auto ${
                selectedCategory !== 'Semua'
                  ? 'bg-orange-50/90 text-[#FF5C35] border-orange-200 ring-2 ring-orange-500/10'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
              title="Pilih Kategori Panduan"
            >
              <div className="flex items-center gap-2 truncate">
                <Layers
                  size={14}
                  className={`shrink-0 ${selectedCategory !== 'Semua' ? 'text-[#FF5C35]' : 'text-slate-400'}`}
                />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                  PILIH PANDUAN:
                </span>
                <span className="truncate max-w-[170px] sm:max-w-[260px] font-extrabold text-slate-800">
                  {selectedCategory}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    selectedCategory !== 'Semua'
                      ? 'bg-[#FF5C35] text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {categoryCounts[selectedCategory] || 0}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-slate-600' : ''
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Floating Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-72 overflow-y-auto">
                <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Daftar Kategori Panduan</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {categories.length - 1} Kategori
                  </span>
                </div>

                <div className="py-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const count = categoryCounts[cat] || 0;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors ${
                          isSelected
                            ? 'bg-orange-50/90 text-[#FF5C35] font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isSelected ? 'bg-[#FF5C35]' : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate">{cat}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                              isSelected
                                ? 'bg-orange-100 text-[#FF5C35]'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {count}
                          </span>
                          {isSelected && <Check size={13} className="text-[#FF5C35] shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul panduan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Workflow Cards Grid */}
        {filteredWorkflows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <FileText size={28} />
            </div>
            <h4 className="text-base font-bold text-slate-800">
              {searchQuery || selectedCategory !== 'Semua'
                ? 'Tidak Ada Panduan yang Sesuai'
                : 'Belum Ada Panduan yang Dibagikan'}
            </h4>
            <p className="text-xs text-slate-400 max-w-md">
              {searchQuery || selectedCategory !== 'Semua'
                ? 'Coba ganti kata kunci pencarian atau pilih kategori lain.'
                : 'Gunakan ekstensi browser StepFlow untuk merekam alur website, lalu klik "Bagikan Link Online" untuk mempublikasikannya ke sini.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((wf) => (
              <div
                key={wf.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100 flex items-center gap-1">
                      <Tag size={10} /> {wf.category || 'Umum'}
                    </span>
                    {isAuth && (
                      <button
                        onClick={() => handleDelete(wf.id, wf.title)}
                        title="Hapus Panduan Ini"
                        className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {wf.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {wf.description || 'Tidak ada deskripsi'}
                    </p>
                  </div>

                  {/* Internal Only: Last Edited Log (Hidden from public audience) */}
                  {isAuth && (wf.lastEditedBy || wf.author) && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      <span className="text-slate-400">Diedit oleh:</span>
                      <strong className="text-slate-700">{wf.lastEditedBy || wf.author}</strong>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {wf.steps?.length || 0} Langkah
                  </span>
                  <div className="flex items-center gap-3">
                    {isAuth && (
                      <a
                        href={`/guide/${wf.id}/edit`}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-orange-600"
                      >
                        <Edit size={12} /> Edit
                      </a>
                    )}
                    <a
                      href={`/guide/${wf.id}`}
                      className="flex items-center gap-1 text-xs font-bold text-[#FF5C35] hover:underline"
                    >
                      Buka Panduan <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        © 2026 StepFlow by Kanmo Group. All rights reserved.
      </footer>

      {/* Team PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={(team) => {
          setShowPinModal(false);
          setIsAuth(true);
          setActiveTeam(team || getActiveTeam());
          setEditorName(getStoredEditorName());
        }}
      />
    </div>
  );
};

