// Local-first journal persistence.
export type Mood = "radiant" | "calm" | "okay" | "low" | "heavy";
export type JournalKind = "quick" | "guided" | "voice";

export type JournalEntry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  body: string;         // plain text, newline preserved
  mood: Mood | null;
  energy: number;       // 0..5
  gratitude: string[];
  wins: string[];
  challenges: string[];
  tags: string[];
  collection: string;   // e.g. "Personal", "College"
  favorite: boolean;
  archived: boolean;
  weather?: string;
  location?: string;
  kind: JournalKind;
  status: "draft" | "saved";
  aiSummary?: string;
};

const KEY = "peacecode.journal.entries.v1";
const PREF = "peacecode.journal.prefs.v1";

export type JournalPrefs = {
  theme: "paper" | "linen" | "sky" | "lavender" | "forest" | "midnight" | "white" | "cozy";
  fontScale: 1 | 1.1 | 1.25;
  lockEnabled: boolean;
};

export const defaultPrefs: JournalPrefs = { theme: "sky", fontScale: 1, lockEnabled: false };

export function loadEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as JournalEntry[];
    return arr.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch { return []; }
}

export function saveEntries(list: JournalEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function upsertEntry(entry: JournalEntry) {
  const list = loadEntries();
  const idx = list.findIndex((e) => e.id === entry.id);
  const next = { ...entry, updatedAt: new Date().toISOString() };
  if (idx >= 0) list[idx] = next; else list.unshift(next);
  saveEntries(list);
  return next;
}

export function deleteEntry(id: string) {
  saveEntries(loadEntries().filter((e) => e.id !== id));
}

export function getEntry(id: string): JournalEntry | undefined {
  return loadEntries().find((e) => e.id === id);
}

export function newEntry(kind: JournalKind = "quick", seed?: Partial<JournalEntry>): JournalEntry {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    title: "",
    body: "",
    mood: null,
    energy: 3,
    gratitude: [],
    wins: [],
    challenges: [],
    tags: [],
    collection: "Personal",
    favorite: false,
    archived: false,
    kind,
    status: "draft",
    ...seed,
  };
}

export function loadPrefs(): JournalPrefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const raw = window.localStorage.getItem(PREF);
    return raw ? { ...defaultPrefs, ...JSON.parse(raw) } : defaultPrefs;
  } catch { return defaultPrefs; }
}
export function savePrefs(p: JournalPrefs) {
  window.localStorage.setItem(PREF, JSON.stringify(p));
}

// ── derived stats ─────────────────────────────────────────────
export function dayKey(d: Date | string) {
  const x = typeof d === "string" ? new Date(d) : d;
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}

export function computeStreak(entries: JournalEntry[]) {
  const days = new Set(entries.filter((e) => e.status === "saved").map((e) => dayKey(e.createdAt)));
  let current = 0, longest = 0, run = 0;
  const today = new Date();
  // current streak
  for (let i = 0; i < 400; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    if (days.has(dayKey(d))) current++; else break;
  }
  // longest across last year
  const sorted = Array.from(days).sort();
  let prev: string | null = null;
  for (const k of sorted) {
    if (prev) {
      const a = new Date(prev), b = new Date(k);
      const diff = Math.round((+b - +a) / 86400000);
      run = diff === 1 ? run + 1 : 1;
    } else run = 1;
    longest = Math.max(longest, run);
    prev = k;
  }
  return { current, longest, totalDays: days.size };
}

export function weekMoodTrend(entries: JournalEntry[]) {
  const score: Record<Mood, number> = { radiant: 5, calm: 4, okay: 3, low: 2, heavy: 1 };
  const out: { day: string; label: string; value: number | null; mood: Mood | null }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const k = dayKey(d);
    const day = entries.find((e) => dayKey(e.createdAt) === k && e.mood);
    out.push({
      day: k,
      label: d.toLocaleDateString(undefined, { weekday: "short" })[0],
      value: day?.mood ? score[day.mood] : null,
      mood: day?.mood ?? null,
    });
  }
  return out;
}
