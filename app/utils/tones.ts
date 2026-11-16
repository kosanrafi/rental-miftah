export const PLATFORMS = ['PS3', 'PS4', 'PS5']

/** Pilihan warna kartu. Warna asli (foto) selalu menimpa warna ini kalau foto sudah diupload. */
export const TONES: Record<string, { label: string; card: string; poster: string }> = {
  brand:   { label: 'Biru',      card: 'from-brand-600 via-ink-800 to-ink-900',   poster: 'linear-gradient(160deg,#2F6BFF 0%,#17358F 52%,#060B1E 100%)' },
  indigo:  { label: 'Indigo',    card: 'from-indigo-700 via-ink-800 to-ink-900',  poster: 'linear-gradient(160deg,#5B5BD6 0%,#2A2A78 52%,#0D0D26 100%)' },
  teal:    { label: 'Teal',      card: 'from-teal-700 via-ink-800 to-ink-900',    poster: 'linear-gradient(160deg,#2CB8A6 0%,#0F5A55 52%,#061E1D 100%)' },
  emerald: { label: 'Hijau',     card: 'from-emerald-700 via-ink-800 to-ink-900', poster: 'linear-gradient(160deg,#10B981 0%,#065F46 52%,#04201A 100%)' },
  amber:   { label: 'Kuning',    card: 'from-amber-700 via-ink-800 to-ink-900',   poster: 'linear-gradient(160deg,#D9931B 0%,#7A4A0B 52%,#1E1206 100%)' },
  violet:  { label: 'Ungu',      card: 'from-violet-700 via-ink-800 to-ink-900',  poster: 'linear-gradient(160deg,#8B5CF6 0%,#4C2A9A 52%,#150B33 100%)' },
  slate:   { label: 'Abu-abu',   card: 'from-slate-600 via-ink-800 to-ink-900',   poster: 'linear-gradient(160deg,#64748B 0%,#2A3345 52%,#0A0D14 100%)' }
}
export const TONE_KEYS = Object.keys(TONES)

/** Ambil warna sesuai pilihan; kalau kosong, pilih otomatis berdasarkan teks supaya konsisten. */
export function toneOf(key?: string, seed = '') {
  if (key && TONES[key]) return TONES[key]
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return TONES[TONE_KEYS[h % TONE_KEYS.length]]
}

export const mediaUrl = (id: number, thumb = false) => `/api/media/${id}${thumb ? '?t=1' : ''}`
