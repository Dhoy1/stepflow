'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Globe, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

// Membersihkan seluruh variasi cookie googtrans di semua cakupan domain dan path
const clearAllGoogleCookies = () => {
  if (typeof window === 'undefined') return;
  const domain = window.location.hostname;
  const domains = ['', domain, `.${domain}`];
  const parts = domain.split('.');
  if (parts.length > 2) {
    domains.push(`.${parts.slice(-2).join('.')}`);
  }

  domains.forEach((d) => {
    const domAttr = d && d !== 'localhost' && d !== '127.0.0.1' ? ` domain=${d};` : '';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domAttr}`;
  });
};

// Memasang cookie terjemahan bahasa Inggris (/id/en dan /auto/en)
const setGoogleEnglishCookies = () => {
  if (typeof window === 'undefined') return;
  const domain = window.location.hostname;
  const domains = ['', domain, `.${domain}`];
  const parts = domain.split('.');
  if (parts.length > 2) {
    domains.push(`.${parts.slice(-2).join('.')}`);
  }

  domains.forEach((d) => {
    const domAttr = d && d !== 'localhost' && d !== '127.0.0.1' ? ` domain=${d};` : '';
    document.cookie = `googtrans=/id/en; path=/;${domAttr}`;
    document.cookie = `googtrans=/auto/en; path=/;${domAttr}`;
  });
};

// Memanipulasi elemen select bawaan Google Translate (.goog-te-combo) secara terprogram
const triggerCombo = (targetLang: 'id' | 'en'): boolean => {
  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (!combo) return false;

  const targetValue = targetLang === 'en' ? 'en' : '';
  combo.value = targetValue;
  combo.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
};

export const LanguageSwitcher: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<'id' | 'en'>('id');
  const [isTranslating, setIsTranslating] = useState(false);
  const lockRef = useRef(false);

  // Fungsi menunggu hingga Google Translate benar-benar selesai mengubah DOM
  const waitForTranslationState = (
    targetLang: 'id' | 'en',
    onComplete: (success: boolean) => void,
    maxWaitMs = 4000
  ) => {
    const startTime = Date.now();

    const isDone = () => {
      if (targetLang === 'en') {
        const hasClass =
          document.documentElement.classList.contains('translated-ltr') ||
          document.documentElement.classList.contains('translated-rtl');
        const hasFontTags = document.querySelector('font[color]') !== null;
        return hasClass || hasFontTags;
      } else {
        const hasClass =
          document.documentElement.classList.contains('translated-ltr') ||
          document.documentElement.classList.contains('translated-rtl');
        return !hasClass;
      }
    };

    if (isDone()) {
      onComplete(true);
      return;
    }

    const checkInterval = setInterval(() => {
      if (isDone()) {
        clearInterval(checkInterval);
        onComplete(true);
      } else if (Date.now() - startTime >= maxWaitMs) {
        clearInterval(checkInterval);
        onComplete(false);
      }
    }, 60);
  };

  useEffect(() => {
    // 1. Cek sesi saat ini: Default SELALU ke ID jika sesi baru atau pertama kali buka web
    const sessionLang =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('stepflow_session_lang')
        : null;

    if (sessionLang === 'en') {
      setCurrentLang('en');
      setGoogleEnglishCookies();

      // Aktifkan overlay hingga terjemahan selesai dimuat di layar
      document.body.classList.add('page-translating');
      setIsTranslating(true);
      lockRef.current = true;

      waitForTranslationState(
        'en',
        (success) => {
          if (!success) {
            triggerCombo('en');
          }
          setTimeout(() => {
            document.body.classList.remove('page-translating');
            setIsTranslating(false);
            lockRef.current = false;
          }, 150);
        },
        3000
      );
    } else {
      // Pastikan bersih ke ID
      clearAllGoogleCookies();
      sessionStorage.setItem('stepflow_session_lang', 'id');
      setCurrentLang('id');
      document.body.classList.remove('page-translating');
      setIsTranslating(false);
      lockRef.current = false;
    }

    // 2. Inisialisasi Google Translate Widget
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'id',
            includedLanguages: 'en,id',
            autoDisplay: false
          },
          'google_translate_element'
        );

        // Jika sesi saat ini EN, trigger otomatis
        if (sessionStorage.getItem('stepflow_session_lang') === 'en') {
          setTimeout(() => triggerCombo('en'), 100);
        }
      }
    };

    // 3. Muat script Google Translate jika belum ada
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (
      window.google?.translate &&
      sessionStorage.getItem('stepflow_session_lang') === 'en'
    ) {
      triggerCombo('en');
    }
  }, []);

  const changeLanguage = (lang: 'id' | 'en') => {
    // Kunci anti-spam: Jangan proses jika sedang dalam proses transisi atau memilih bahasa yang sama
    if (lockRef.current || isTranslating) return;
    if (lang === currentLang) return;

    lockRef.current = true;
    setIsTranslating(true);
    document.body.classList.add('page-translating');

    setCurrentLang(lang);
    sessionStorage.setItem('stepflow_session_lang', lang);

    if (lang === 'en') {
      setGoogleEnglishCookies();

      // 1. Coba langsung via combo tanpa reload (sangat instan & mulus)
      let triggered = triggerCombo('en');

      if (!triggered) {
        let attempts = 0;
        const comboTimer = setInterval(() => {
          attempts++;
          if (triggerCombo('en') || attempts > 25) {
            clearInterval(comboTimer);
          }
        }, 50);
      }

      // 2. Tahan overlay kabut putih hingga terjemahan benar-benar diterapkan di DOM
      waitForTranslationState(
        'en',
        (success) => {
          if (!success) {
            // Jika dalam batas waktu in-memory tidak merespons, lakukan fallback reload aman
            window.location.reload();
            return;
          }

          // Efek visual halus sebelum menutup overlay
          setTimeout(() => {
            document.body.classList.remove('page-translating');
            setIsTranslating(false);
            lockRef.current = false;
          }, 180);
        },
        3500
      );
    } else {
      // Kembali ke Bahasa Indonesia Asli
      clearAllGoogleCookies();

      triggerCombo('id');

      // Cari tombol reset/restore bawaan frame Google Translate jika ada
      const iframes = document.querySelectorAll(
        'iframe.goog-te-banner-frame, iframe.skiptranslate'
      );
      iframes.forEach((iframe: any) => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          const restoreBtn = doc?.querySelector(
            '.goog-te-button button, [id*="restore"]'
          );
          if (restoreBtn) restoreBtn.click();
        } catch (e) {}
      });

      waitForTranslationState(
        'id',
        (success) => {
          if (!success) {
            // Jika Google tidak dapat merestore struktur teks in-memory, reload bersih ke ID asli
            window.location.reload();
            return;
          }

          setTimeout(() => {
            document.body.classList.remove('page-translating');
            setIsTranslating(false);
            lockRef.current = false;
          }, 180);
        },
        600
      );
    }
  };

  return (
    <div className="flex items-center notranslate select-none">
      {/* Wadah Google Translate: Tersembunyi rapi dan aman */}
      <div
        id="google_translate_element"
        style={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      />

      {/* Tombol Sakelar Segmented [ 🌐 ID | EN ] */}
      <div
        className={`flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold shadow-2xs gap-0.5 transition-opacity duration-200 ${
          isTranslating ? 'opacity-70 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Globe
          size={13}
          className={`hidden sm:inline-block ml-1 mr-0.5 shrink-0 transition-all duration-300 ${
            isTranslating ? 'text-[#FF5C35] animate-pulse' : 'text-slate-400'
          }`}
        />

        {/* Tombol ID */}
        <button
          type="button"
          disabled={isTranslating}
          onClick={() => changeLanguage('id')}
          className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1 ${
            currentLang === 'id'
              ? 'bg-[#FF5C35] text-white shadow-xs scale-[1.03]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          }`}
          title="Tampilkan dalam Bahasa Indonesia (Asli)"
        >
          {isTranslating && currentLang === 'id' && (
            <Loader2 size={11} className="animate-spin text-white" />
          )}
          <span>ID</span>
        </button>

        {/* Tombol EN */}
        <button
          type="button"
          disabled={isTranslating}
          onClick={() => changeLanguage('en')}
          className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1 ${
            currentLang === 'en'
              ? 'bg-[#FF5C35] text-white shadow-xs scale-[1.03]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          }`}
          title="Translate to English"
        >
          {isTranslating && currentLang === 'en' && (
            <Loader2 size={11} className="animate-spin text-white" />
          )}
          <span>EN</span>
        </button>
      </div>
    </div>
  );
};
