// Helper for Editor Role Access using Multi-Team PINs and Session Storage
// Team profiles and access PINs are dynamically loaded from MySQL database (table: team_accounts)

export interface TeamProfile {
  id: string;
  name: string;
  pin: string;
  badgeColor: string; // e.g. 'emerald', 'blue', 'purple', 'amber', 'orange'
  role?: string;
  isActive?: boolean;
}

// Konfigurasi Default Tim (Fallback jika database belum siap / offline)
export const TEAMS_CONFIG: TeamProfile[] = [
  {
    id: 'team_1',
    name: process.env.NEXT_PUBLIC_TEAM_1_NAME || 'Ridho',
    pin: process.env.NEXT_PUBLIC_TEAM_1_PIN || '24170',
    badgeColor: 'emerald',
    role: 'editor'
  },
  {
    id: 'team_2',
    name: process.env.NEXT_PUBLIC_TEAM_2_NAME || 'Hikam',
    pin: process.env.NEXT_PUBLIC_TEAM_2_PIN || '23721',
    badgeColor: 'blue',
    role: 'editor'
  },
  {
    id: 'team_3',
    name: process.env.NEXT_PUBLIC_TEAM_3_NAME || 'Fazril',
    pin: process.env.NEXT_PUBLIC_TEAM_3_PIN || '20642',
    badgeColor: 'purple',
    role: 'editor'
  }
];

export const DEFAULT_PIN = process.env.NEXT_PUBLIC_EDITOR_PIN || '1234';

const AUTH_KEY = 'stepflow_editor_token';
const EDITOR_NAME_KEY = 'stepflow_editor_name';
const ACTIVE_TEAM_KEY = 'stepflow_active_team';
const TEAMS_CACHE_KEY = 'stepflow_teams_cache';

let dynamicTeamsCache: TeamProfile[] | null = null;

/**
 * Mengambil daftar tim secara dinamis dari database MySQL via API (/api/teams).
 * Hasilnya di-cache di memori dan sessionStorage untuk performa kilat.
 */
export async function fetchTeamAccounts(): Promise<TeamProfile[]> {
  if (typeof window === 'undefined') return TEAMS_CONFIG;

  try {
    const res = await fetch('/api/teams', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.teams) && data.teams.length > 0) {
        dynamicTeamsCache = data.teams;
        try {
          sessionStorage.setItem(TEAMS_CACHE_KEY, JSON.stringify(data.teams));
        } catch {}
        return data.teams;
      }
    }
  } catch (err) {
    console.warn('Could not fetch team accounts from /api/teams, using cached/fallback:', err);
  }

  return getTeamAccountsCache();
}

/**
 * Mendapatkan cache tim saat ini (sinkron).
 */
export function getTeamAccountsCache(): TeamProfile[] {
  if (dynamicTeamsCache && dynamicTeamsCache.length > 0) {
    return dynamicTeamsCache;
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(TEAMS_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dynamicTeamsCache = parsed;
          return parsed;
        }
      }
    } catch {}
  }

  return TEAMS_CONFIG;
}

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
 * Mendukung pencarian dari daftar dinamis (database) maupun fallback default.
 */
export function findTeamByPin(inputPin: string, customTeams?: TeamProfile[]): TeamProfile | null {
  const cleanPin = inputPin.trim();
  if (!cleanPin) return null;

  const list = customTeams && customTeams.length > 0 ? customTeams : getTeamAccountsCache();

  // 1. Cek terhadap daftar tim di database MySQL
  const foundTeam = list.find((t) => String(t.pin).trim() === cleanPin);
  if (foundTeam) return foundTeam;

  // 2. Fallback untuk master/default PIN jika disetel
  if (DEFAULT_PIN && cleanPin === DEFAULT_PIN.trim()) {
    return list[0] || TEAMS_CONFIG[0];
  }

  return null;
}

/**
 * Login dengan memvalidasi PIN terhadap daftar Tim dari database MySQL.
 * Sesi hanya disimpan di sessionStorage (auto-lock saat browser/tab ditutup).
 */
export function loginWithPin(inputPin: string, editorName?: string, customTeams?: TeamProfile[]): boolean {
  if (typeof window === 'undefined') return false;

  const matchedTeam = findTeamByPin(inputPin, customTeams);
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
