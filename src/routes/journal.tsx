import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  PenLine, Sparkles, Search, Plus, Mic, Camera, Bot, Star, Flame, RefreshCw,
  BookOpen, Archive, Lock, ChevronRight, BarChart3, Tag, Palette,
} from "lucide-react";
import { AppShell, palette } from "@/components/AppShell";
import {
  loadEntries, newEntry, upsertEntry, computeStreak, weekMoodTrend,
  type JournalEntry, type Mood,
} from "@/lib/journal-store";
import { journalAI } from "@/lib/journal-ai.functions";

export const Route = createFileRoute("/journal")({ component: JournalHome });

const { surface, surface2, border, ink, muted, primary, soft, lavender } = palette;

const MOOD_META: Record<Mood, { label: string; emoji: string; color: string }> = {
  radiant: { label: "radiant", emoji: "☀️", color: "#F5C97A" },
  calm:    { label: "calm",    emoji: "🌿", color: "#9FC7A8" },
  okay:    { label: "okay",    emoji: "🌤", color: "#AFC9F5" },
  low:     { label: "low",     emoji: "🌧", color: "#B7BFD9" },
  heavy:   { label: "heavy",   emoji: "🌫", color: "#8A93B0" },
};

function JournalHome() {
  const navigate = useNavigate();
  const askAI = useServerFn(journalAI);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [query, setQuery] = useState("");
  const [prompt, setPrompt] = useState("what is one small thing that steadied you today?");
  const [promptLoading, setPromptLoading] = useState(false);
  const [reflection, setReflection] = useState<string>("");
  const [reflectLoading, setReflectLoading] = useState(false);

  useEffect(() => { setEntries(loadEntries()); }, []);

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const trend = useMemo(() => weekMoodTrend(entries), [entries]);
  const draft = useMemo(() => entries.find((e) => e.status === "draft"), [entries]);
  const saved = useMemo(() => entries.filter((e) => e.status === "saved" && !e.archived), [entries]);
  const recent = useMemo(() => {
    const q = query.trim().toLowerCase();
    const src = saved;
    if (!q) return src.slice(0, 6);
    return src.filter((e) =>
      (e.title + " " + e.body + " " + e.tags.join(" ")).toLowerCase().includes(q)
    ).slice(0, 12);
  }, [saved, query]);

  const todayMood = useMemo(() => {
    const today = new Date().toDateString();
    return entries.find((e) => new Date(e.createdAt).toDateString() === today)?.mood ?? null;
  }, [entries]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 5 ? "still up" : hour < 12 ? "good morning" : hour < 17 ? "good afternoon" : hour < 21 ? "good evening" : "quiet night";

  async function refreshPrompt() {
    setPromptLoading(true);
    try {
      const res = await askAI({ data: { kind: "prompt", mood: todayMood ?? "" } });
      if (res.text) setPrompt(res.text.replace(/^["'\s]+|["'\s]+$/g, ""));
    } catch { /* keep last */ }
    finally { setPromptLoading(false); }
  }

  async function generateReflection() {
    if (!saved.length) return;
    setReflectLoading(true);
    try {
      const seed = saved.slice(0, 3).map((e) => e.body).join("\n\n---\n\n").slice(0, 4000);
      const res = await askAI({ data: { kind: "reflect", text: seed } });
      setReflection(res.text || "");
    } catch (e) { setReflection("peace bot is resting. try again in a moment."); }
    finally { setReflectLoading(false); }
  }

  function createEntry(kind: "quick" | "guided") {
    const e = newEntry(kind, kind === "guided" ? { title: prompt } : {});
    upsertEntry(e);
    navigate({ to: "/journal/$id", params: { id: e.id } });
  }

  return (
    <AppShell>
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 lg:pt-10 pb-24 font-['DM_Sans',sans-serif]" style={{ color: ink }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[32px] p-6 sm:p-10 mb-8"
          style={{ background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}` }}>
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full blur-3xl opacity-40" style={{ background: lavender }} />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: soft }} />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-end">
            <div>
              <div className="text-[10px] tracking-[0.4em] uppercase opacity-50">
                {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <h1 className="font-['Fraunces',serif] text-[38px] sm:text-[54px] leading-[1.02] font-light mt-2">
                {greeting}, <span className="italic" style={{ color: primary }}>keya.</span>
              </h1>
              <p className="mt-4 text-[15px] max-w-xl opacity-80">
                a quiet page is waiting. write a line, or let peace ask you something soft.
              </p>

              {/* today's prompt */}
              <div className="mt-6 flex items-start gap-3 p-5 rounded-2xl backdrop-blur-md"
                style={{ background: "rgba(255,255,255,0.6)", border: `1px solid ${border}` }}>
                <Sparkles className="w-4 h-4 mt-1 shrink-0" style={{ color: primary }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] tracking-[0.3em] uppercase opacity-50 mb-1">today's prompt</div>
                  <div className="font-['Fraunces',serif] text-[19px] italic leading-snug">{prompt}</div>
                </div>
                <button onClick={refreshPrompt} disabled={promptLoading}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background: surface, border: `1px solid ${border}` }} aria-label="new prompt">
                  <RefreshCw className={`w-3.5 h-3.5 ${promptLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* actions */}
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => createEntry("quick")}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[13px] transition hover:-translate-y-0.5"
                  style={{ background: ink, color: "#fff" }}>
                  <Plus className="w-4 h-4" /> new entry
                </button>
                <button onClick={() => createEntry("guided")}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[13px] transition hover:-translate-y-0.5"
                  style={{ background: surface, border: `1px solid ${border}` }}>
                  <Bot className="w-4 h-4" /> ai guided
                </button>
                {draft && (
                  <Link to="/journal/$id" params={{ id: draft.id }}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[13px] transition hover:-translate-y-0.5"
                    style={{ background: surface2, color: primary }}>
                    <PenLine className="w-4 h-4" /> continue writing
                  </Link>
                )}
              </div>
            </div>

            {/* streak ring */}
            <div className="relative aspect-square rounded-3xl p-6 flex flex-col items-center justify-center"
              style={{ background: "rgba(255,255,255,0.55)", border: `1px solid ${border}` }}>
              <StreakRing current={streak.current} longest={streak.longest} total={streak.totalDays} />
            </div>
          </div>
        </section>

        {/* ── MOOD + REFLECTION ───────────────────────────── */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] mb-8">
          <Card>
            <CardHeader icon={<BarChart3 className="w-4 h-4" />} kicker="mood timeline" title="this week" />
            <div className="flex items-end justify-between gap-2 h-32 mt-4 mb-2">
              {trend.map((d, i) => {
                const h = d.value ? (d.value / 5) * 100 : 6;
                const color = d.mood ? MOOD_META[d.mood].color : border;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full rounded-full transition-all" style={{ height: `${h}%`, background: color, opacity: d.value ? 0.9 : 0.5 }} />
                    <div className="text-[10px] opacity-60">{d.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(Object.keys(MOOD_META) as Mood[]).map((m) => (
                <button key={m}
                  onClick={() => {
                    const today = new Date().toDateString();
                    const list = loadEntries();
                    let target = list.find((e) => new Date(e.createdAt).toDateString() === today);
                    if (!target) target = newEntry("quick");
                    target.mood = m;
                    target.status = target.body.trim() ? "saved" : target.status;
                    upsertEntry(target);
                    setEntries(loadEntries());
                  }}
                  className="text-[11px] px-2.5 h-7 rounded-full inline-flex items-center gap-1.5 transition hover:-translate-y-0.5"
                  style={{
                    background: todayMood === m ? MOOD_META[m].color : surface2,
                    color: todayMood === m ? "#fff" : ink,
                    border: `1px solid ${border}`,
                  }}>
                  <span>{MOOD_META[m].emoji}</span>{MOOD_META[m].label}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader icon={<Sparkles className="w-4 h-4" />} kicker="ai reflection" title="what peace notices"
              action={
                <button onClick={generateReflection} disabled={reflectLoading || !saved.length}
                  className="text-[11px] px-3 h-7 rounded-full inline-flex items-center gap-1.5 disabled:opacity-40"
                  style={{ background: surface2, color: primary }}>
                  <RefreshCw className={`w-3 h-3 ${reflectLoading ? "animate-spin" : ""}`} /> reflect
                </button>
              } />
            <div className="mt-3">
              {reflection ? (
                <div className="space-y-2 font-['Fraunces',serif]">
                  {reflection.split("\n").filter(Boolean).slice(0, 3).map((line, i) => (
                    <p key={i} className="text-[15px] italic leading-snug opacity-90">— {line.replace(/^[-•]\s*/, "")}</p>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] opacity-60 italic">
                  {saved.length ? "tap reflect to hear a soft summary of your recent entries." : "write your first entry — peace will listen."}
                </p>
              )}
            </div>
          </Card>
        </section>

        {/* ── RECENT ──────────────────────────────────────── */}
        <section className="mb-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[10px] tracking-[0.4em] uppercase opacity-50">recent</div>
              <h2 className="font-['Fraunces',serif] text-[28px] font-light mt-1">your quiet pages</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full px-3 h-9" style={{ background: surface, border: `1px solid ${border}` }}>
              <Search className="w-3.5 h-3.5 opacity-50" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search entries…"
                className="bg-transparent outline-none text-[12px] w-40 sm:w-56 placeholder:opacity-40" />
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="rounded-3xl p-10 text-center" style={{ background: surface, border: `1px dashed ${border}` }}>
              <BookOpen className="w-6 h-6 mx-auto opacity-40" />
              <p className="mt-3 font-['Fraunces',serif] italic text-[17px]">no pages yet.</p>
              <p className="text-[12px] opacity-60 mt-1">your first entry begins here.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((e) => <EntryCard key={e.id} entry={e} />)}
            </div>
          )}
        </section>

        {/* ── COLLECTIONS + TAGS ──────────────────────────── */}
        <section className="grid gap-4 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader icon={<BookOpen className="w-4 h-4" />} kicker="collections" title="find a room" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              {["All", "Favorites", "College", "Personal", "Gratitude", "Dreams"].map((c) => {
                const count = c === "All" ? saved.length
                  : c === "Favorites" ? saved.filter((x) => x.favorite).length
                  : saved.filter((x) => x.collection === c).length;
                return (
                  <button key={c}
                    className="flex flex-col items-start p-3 rounded-2xl text-left transition hover:-translate-y-0.5"
                    style={{ background: surface2, border: `1px solid ${border}` }}>
                    <span className="text-[12px]">{c}</span>
                    <span className="text-[10px] opacity-60 mt-1">{count} {count === 1 ? "page" : "pages"}</span>
                  </button>
                );
              })}
            </div>
          </Card>
          <Card>
            <CardHeader icon={<Tag className="w-4 h-4" />} kicker="tags" title="soft threads" />
            <div className="flex flex-wrap gap-2 mt-4">
              {["exam", "friends", "family", "anxiety", "motivation", "hostel", "classes", "placement", "health", "random"].map((t) => (
                <span key={t} className="text-[11px] px-3 h-7 rounded-full inline-flex items-center"
                  style={{ background: surface2, color: muted, border: `1px solid ${border}` }}>#{t}</span>
              ))}
            </div>
          </Card>
        </section>

        {/* ── UTILITY ROW ─────────────────────────────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-24">
          {[
            { icon: BarChart3, label: "insights" },
            { icon: Palette,   label: "themes" },
            { icon: Lock,      label: "privacy" },
            { icon: Archive,   label: "archived" },
          ].map((t) => (
            <button key={t.label} className="flex items-center gap-3 h-14 px-4 rounded-2xl transition hover:-translate-y-0.5"
              style={{ background: surface, border: `1px solid ${border}` }}>
              <t.icon className="w-4 h-4 opacity-70" />
              <span className="text-[12px]">{t.label}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
            </button>
          ))}
        </section>
      </main>

      {/* ── floating quick actions ───────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        {[
          { icon: Mic, label: "voice" },
          { icon: Camera, label: "photo" },
          { icon: Bot, label: "ai" },
        ].map((q) => (
          <button key={q.label} title={q.label}
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition hover:-translate-y-0.5"
            style={{ background: surface, border: `1px solid ${border}` }}>
            <q.icon className="w-4 h-4 opacity-70" />
          </button>
        ))}
        <button onClick={() => createEntry("quick")} aria-label="new entry"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition hover:-translate-y-0.5"
          style={{ background: ink, color: "#fff" }}>
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </AppShell>
  );
}

// ── components ───────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl p-5 sm:p-6 backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.72)", border: `1px solid ${border}` }}>
      {children}
    </div>
  );
}

function CardHeader({ icon, kicker, title, action }: { icon: React.ReactNode; kicker: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 opacity-60">
          {icon}
          <span className="text-[9px] tracking-[0.32em] uppercase">{kicker}</span>
        </div>
        <h3 className="font-['Fraunces',serif] text-[22px] font-light mt-1">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function StreakRing({ current, longest, total }: { current: number; longest: number; total: number }) {
  const size = 180, stroke = 10, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const goal = Math.max(7, longest || 7);
  const pct = Math.min(1, current / goal);
  return (
    <div className="relative">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={surface2} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={primary} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Flame className="w-4 h-4 mb-1" style={{ color: primary }} strokeWidth={1.5} />
        <div className="font-['Fraunces',serif] text-[40px] leading-none font-light">{current}</div>
        <div className="text-[9px] tracking-[0.3em] uppercase opacity-60 mt-1">day streak</div>
        <div className="text-[10px] opacity-50 mt-2">longest {longest} · total {total}</div>
      </div>
    </div>
  );
}

function EntryCard({ entry }: { entry: JournalEntry }) {
  const preview = entry.body.slice(0, 140);
  const d = new Date(entry.createdAt);
  return (
    <Link to="/journal/$id" params={{ id: entry.id }}
      className="group rounded-3xl p-5 flex flex-col transition hover:-translate-y-1"
      style={{ background: surface, border: `1px solid ${border}`, minHeight: 180 }}>
      <div className="flex items-center justify-between text-[10px] opacity-60">
        <span>{d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
        <div className="flex items-center gap-2">
          {entry.mood && <span>{MOOD_META[entry.mood].emoji}</span>}
          {entry.favorite && <Star className="w-3 h-3" style={{ color: primary }} fill={primary} />}
        </div>
      </div>
      <h4 className="font-['Fraunces',serif] text-[19px] leading-snug mt-2 line-clamp-2">
        {entry.title || preview.slice(0, 40) || "untitled"}
      </h4>
      <p className="text-[12.5px] opacity-70 mt-2 line-clamp-3 leading-relaxed">
        {preview || "…"}
      </p>
      <div className="mt-auto pt-3 flex items-center gap-1.5 flex-wrap">
        {entry.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-[10px] px-2 h-5 rounded-full inline-flex items-center"
            style={{ background: surface2, color: muted }}>#{t}</span>
        ))}
      </div>
    </Link>
  );
}
