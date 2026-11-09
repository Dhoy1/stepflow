// Helper for Editor Role Access using Multi-Team PINs and Session Storage

export interface TeamProfile {
  id: string;
  name: string;
  pin: string;
  badgeColor: string; // e.g. 'emerald', 'blue', 'purple'
}

// Konfigurasi 3 Tim dengan PIN dan Nama Masing-masing
export const TEAMS_CONFIG: TeamProfile[] = [
  {
    id: 'team_1',
    name: process.env.NEXT_PUBLIC_TEAM_1_NAME || 'Tim IT & Operations',
    pin: process.env.NEXT_PUBLIC_TEAM_1_PIN || '1122',
    badgeColor: 'emerald'
  },
  {
    id: 'team_2',
    name: process.env.NEXT_PUBLIC_TEAM_2_NAME || 'Tim Human Resources',
    pin: process.env.NEXT_PUBLIC_TEAM_2_PIN || '3344',
    badgeColor: 'blue'
  },
  {
    id: 'team_3',
    name: process.env.NEXT_PUBLIC_TEAM_3_NAME || 'Tim Finance & Accounting',
    pin: process.env.NEXT_PUBLIC_TEAM_3_PIN || '5566',
    badgeColor: 'purple'
  }
];

export const DEFAULT_PIN = process.env.NEXT_PUBLIC_EDITOR_PIN || '1234';

const AUTH_KEY = 'stepflow_editor_token';
const EDITOR_NAME_KEY = 'stepflow_editor_name';
const ACTIVE_TEAM_KEY = 'stepflow_active_team';

/**
 * Cek apakah user saat ini terautentikasi dalam sesi aktif.
 * Menggunakan sessionStorage agar otomatis terkunci kembali saat tab / browser ditutup.
 */
export function isEditorAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Mengambil profil tim yang sedang aktif pada sesi ini.
 */
export function getActiveTeam(): TeamProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ACTIVE_TEAM_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Mengambil nama editor (disimpan di localStorage untuk kenyamanan pre-fill nama).
 */
export function getStoredEditorName(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(EDITOR_NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredEditorName(name: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EDITOR_NAME_KEY, name.trim());
  } catch {}
}

/**
 * Mencari tim yang cocok berdasarkan PIN yang dimasukkan.
 */
export function findTeamByPin(inputPin: string): TeamProfile | null {
  const cleanPin = inputPin.trim();
  if (!cleanPin) return null;

  // 1. Cek terhadap 3 tim
  const foundTeam = TEAMS_CONFIG.find((t) => t.pin.trim() === cleanPin);
  if (foundTeam) return foundTeam;

  // 2. Fallback untuk master/default PIN jika disetel
  if (DEFAULT_PIN && cleanPin === DEFAULT_PIN.trim()) {
    return TEAMS_CONFIG[0]; // Kaitkan ke tim utama (Tim 1)
  }

  return null;
}

/**
 * Login dengan memvalidasi PIN terhadap daftar 3 Tim.
 * Sesi hanya disimpan di sessionStorage (auto-lock saat browser/tab ditutup).
 */
export function loginWithPin(inputPin: string, editorName?: string): boolean {
  if (typeof window === 'undefined') return false;

  const matchedTeam = findTeamByPin(inputPin);
  if (!matchedTeam) {
    return false;
  }

  try {
    // Simpan token otentikasi dan tim aktif ke sessionStorage
    sessionStorage.setItem(AUTH_KEY, 'true');
    sessionStorage.setItem(ACTIVE_TEAM_KEY, JSON.stringify(matchedTeam));

    // Bersihkan kunci lama di localStorage jika ada
    localStorage.removeItem(AUTH_KEY);

    // Simpan nama editor untuk riwayat
    if (editorName && editorName.trim()) {
      setStoredEditorName(editorName.trim());
    }

    return true;
  } catch (err) {
    console.error('Failed to set session authentication:', err);
    return false;
  }
}

/**
 * Mengunci akses (logout) dan menghapus sesi aktif.
 */
export function logoutEditor(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(ACTIVE_TEAM_KEY);
    localStorage.removeItem(AUTH_KEY);
  } catch {}
}

export function getStoredPin(): string {
  return DEFAULT_PIN;
}
