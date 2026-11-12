'use client';

import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, X, CheckCircle2, AlertCircle, User } from 'lucide-react';
import {
  loginWithPin,
  getStoredEditorName,
  findTeamByPin,
  fetchTeamAccounts,
  getTeamAccountsCache,
  type TeamProfile
} from '@/lib/auth';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (team?: TeamProfile) => void;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [editorName, setEditorName] = useState('');
  const [error, setError] = useState(false);
  const [detectedTeam, setDetectedTeam] = useState<TeamProfile | null>(null);
  const [teamList, setTeamList] = useState<TeamProfile[]>(() => getTeamAccountsCache());

  useEffect(() => {
    if (isOpen) {
      setEditorName(getStoredEditorName() || '');
      setPin('');
      setError(false);
      setDetectedTeam(null);

      // Ambil daftar akun tim terkini dari database MySQL via API
      fetchTeamAccounts().then((teams) => {
        if (teams && teams.length > 0) {
          setTeamList(teams);
        }
      });
    }
  }, [isOpen]);

  // Deteksi tim secara real-time saat user mengetik PIN
  const handlePinChange = (val: string) => {
    setPin(val);
    setError(false);
    const matched = findTeamByPin(val, teamList);
    setDetectedTeam(matched);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveName = editorName.trim() || (detectedTeam ? detectedTeam.name : 'Editor Tim');
    if (loginWithPin(pin, effectiveName, teamList)) {
      setError(false);
      const team = findTeamByPin(pin, teamList) || undefined;
      setPin('');
      onSuccess(team);
    } else {
      setError(true);
      setDetectedTeam(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5C35] flex items-center justify-center shadow-xs">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Akses Editor Tim</h3>
              <p className="text-[11px] text-slate-400">Masukkan Nama & PIN untuk membuka kunci.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">Nama Anda (Editor):</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">PIN</label>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                maxLength={10}
                placeholder="Masukkan PIN tim Anda..."
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                autoFocus
                className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-sm font-semibold tracking-wider text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                    : detectedTeam
                      ? 'border-emerald-400 focus:ring-emerald-400 bg-emerald-50/20'
                      : 'border-slate-200 focus:ring-orange-500'
                }`}
              />
            </div>

            {/* Live Detected Team Feedback */}
            {detectedTeam && !error && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Terverifikasi sebagai: <strong>{detectedTeam.name}</strong></span>
              </div>
            )}

            {error && (
              <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle size={12} className="shrink-0" /> PIN salah atau tidak terdaftar.
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF5C35] hover:bg-[#E54A24] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Buka Kunci Akses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
