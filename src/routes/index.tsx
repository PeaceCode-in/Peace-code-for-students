// PeaceCode — Dashboard Overview.
// Minimal editorial mental-wellness dashboard inspired by SentiQ,
// re-cast in the PeaceCode blue → lavender gradient. Every card opens
// into its dedicated module while sharing one calm visual language.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, Bell, ChevronLeft, ChevronRight, Maximize2,
  MoreHorizontal, Search, Sparkles, TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

import * as journal from "@/lib/journal-store";
import * as gratitude from "@/lib/gratitude-store";
import * as breathe from "@/lib/breathe-store";
import * as focus from "@/lib/focus-store";
import * as counselling from "@/lib/counselling-store";
import * as screening from "@/lib/screening-store";
import { useMindGym, ensureBootstrapped, brainOverall, weeklyStats } from "@/lib/mindgym-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Overview — PeaceCode" },
      { name: "description", content: "Your calm, minimal mental wellness dashboard — mood, focus, streaks and emotional trends at a glance." },
      { property: "og:title", content: "Dashboard Overview — PeaceCode" },
      { property: "og:description", content: "A quiet overview of your mind, day, and next step." },
    ],
  }),
  component: () => (<AppShell><DashboardInner /></AppShell>),
});

// ─── data ────────────────────────────────────────────────────────────
function useData() {
  const [d, setD] = useState<any>({ ready: false });
  useEffect(() => {
    try {
      const j = journal.loadEntries();
      const g = gratitude.loadEntries();
      const b = breathe.loadSessions();
      const f = focus.loadSessions();
      const scr = screening.loadSessions();
      const appts = counselling.listAppointments().sort((a,b) => a.scheduledFor - b.scheduledFor);
      setD({
        ready: true,
        journalStreak: journal.computeStreak(j).current,
        journalWeek: j.filter((e:any)=>e.status==="saved" && Date.now()-new Date(e.updatedAt||e.createdAt).getTime()<7*864e5).length,
        moodTrend: journal.weekMoodTrend(j), // array of 7
        gratitudeStreak: gratitude.computeStreak(g).current,
        gratitudeToday: gratitude.todayCount(g),
        breatheStreak: breathe.computeStreak(b).current,
        breatheToday: b.filter((s:any)=>breathe.dayKey(s.completedAt)===breathe.dayKey(new Date())).length,
        focusWeekMin: Math.round(f.filter((s:any)=>Date.now()-new Date(s.completedAt).getTime()<7*864e5).reduce((a:number,s:any)=>a+(s.planned||0)/60,0)),
        focusStreak: focus.computeStreaks(f).current,
        nextAppt: appts.find(a=>a.status!=="cancelled" && a.scheduledFor>Date.now()),
        wellness: screening.overallWellness(scr),
      });
    } catch { setD({ ready: true }); }
  }, []);
  return d;
}

// ─── Dashboard ───────────────────────────────────────────────────────
function DashboardInner() {
  const data = useData();
  const mg = useMindGym();
  useEffect(() => { ensureBootstrapped(); }, []);

  const hour = new Date().getHours();
  const greet = hour < 5 ? "Still Awake" : hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : hour < 21 ? "Good Evening" : "Quiet Night";

  const overall = brainOverall(mg.brain);
  const week = weeklyStats();

  // Derived stats
  const peace = useMemo(() => {
    const base = overall;
    const streakBoost = Math.min(12, ((mg.streak.current||0) + (data.breatheStreak||0)));
    const act = Math.min(10, ((data.journalWeek||0) + (data.breatheToday||0)) * 2);
    return Math.round(Math.min(100, base * 0.7 + streakBoost + act)) || 50;
  }, [overall, mg.streak.current, data.breatheStreak, data.journalWeek, data.breatheToday]);

  const goalPct = Math.min(100, Math.round(((week.count || 0) / 5) * 100));
  const habitPct = Math.min(100, Math.round(((mg.streak.current || 0) / 21) * 100)) || 24;
  const projectAlloc = Math.min(100, Math.round(((data.focusWeekMin || 0) / 300) * 100)) || 50;
  const emoStability = Math.round(50 + (peace - 50) * 0.6);
  const focusedMind = Math.min(95, 40 + Math.round((data.focusStreak || 0) * 4));
  const freeMind = 100 - focusedMind;

  const goodMood = (data.moodTrend || []).filter((v:number)=>v>=0.5).length * 14 || 60;
  const badMood = (data.moodTrend || []).filter((v:number)=>v<0.3).length * 14 || 20;
  const controlMood = 100 - goodMood - badMood;

  const [dayIdx, setDayIdx] = useState(0);
  const daysAgo = new Date(Date.now() - dayIdx * 864e5);
  const dayLabel = `Day ${String(dayIdx+1).padStart(2,"0")} — ${daysAgo.toLocaleDateString("en-US",{weekday:"long"})}`;

  return (
    <main className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Ambient dots */}
      <AmbientDots />

      {/* Header row */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <div className="text-[10px] tracking-[0.32em] uppercase mb-1" style={{color:"var(--pc-muted)"}}>Overview</div>
          <h1 className="font-serif text-[26px] sm:text-[38px] leading-[1.05] truncate" style={{color:"var(--pc-ink)", letterSpacing:"-0.02em"}}>
            Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="hidden md:flex items-center gap-2 h-10 px-4 rounded-full text-[12px] transition hover:bg-[var(--pc-surface2)]"
            style={{background:"var(--pc-surface)", border:"1px solid var(--pc-border)", color:"var(--pc-ink)"}}>
            Monthly <ChevronRight className="w-3.5 h-3.5 rotate-90"/>
          </button>
          <Link to="/focus" className="group flex items-center gap-2 h-10 px-4 sm:px-5 rounded-full text-[13px] font-medium text-white transition hover:shadow-lg hover:-translate-y-[1px]"
            style={{background:"linear-gradient(135deg,var(--pc-primary),var(--pc-lavender))"}}>
            Start Session <ArrowUpRight className="w-4 h-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
          </Link>
        </div>
      </header>

      {/* Row 1 — Greeting + Mindful score + Mood + Focus */}
      <section className="grid grid-cols-12 gap-4 sm:gap-5">
        {/* Greeting + streak (spans wide) */}
        <Card as={Link} to="/peacebot" className="col-span-12 lg:col-span-6 relative overflow-hidden group">
          <BlurDot className="top-[-40px] right-[-30px]" size={220} />
          <div className="text-[10px] tracking-[0.32em] uppercase mb-4" style={{color:"var(--pc-muted)"}}>Today</div>
          <div className="font-serif text-[38px] sm:text-[54px] leading-[1.02]" style={{color:"var(--pc-ink)", letterSpacing:"-0.025em"}}>
            {greet},<br/><span className="italic opacity-90">Jai.</span>
          </div>
          <div className="mt-8">
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:"var(--pc-surface2)"}}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{width:`${Math.min(100, ((mg.streak.current||0)/7)*100)}%`, background:"linear-gradient(90deg,var(--pc-primary),var(--pc-lavender))"}}/>
            </div>
            <div className="mt-3 text-[13px]" style={{color:"var(--pc-muted)"}}>
              You're on a <span style={{color:"var(--pc-ink)", fontWeight:500}}>{mg.streak.current || 0}-day streak</span> of mindful focus — keep it soft.
            </div>
          </div>
          <ArrowOpen/>
        </Card>

        {/* Daily Mindful Score — gradient hero card */}
        <Link to="/mindgym" className="col-span-12 sm:col-span-6 lg:col-span-3 relative rounded-3xl p-6 overflow-hidden text-white transition hover:-translate-y-[2px] hover:shadow-xl"
          style={{background:"linear-gradient(150deg,var(--pc-primary) 0%,var(--pc-lavender) 100%)"}}>
          <BlurDot className="top-[-20px] right-[-20px]" size={160} color="rgba(255,255,255,0.35)"/>
          <BlurDot className="bottom-[-30px] left-[-20px]" size={140} color="rgba(255,255,255,0.18)"/>
          <div className="relative">
            <div className="text-[11px] tracking-[0.28em] uppercase opacity-85">Daily Mindful</div>
            <div className="text-[11px] tracking-[0.28em] uppercase opacity-85">Score</div>
            <div className="mt-10 font-serif text-[52px] leading-none flex items-baseline gap-1">
              {peace}<span className="text-[24px]">%</span>
              <TrendingUp className="w-4 h-4 ml-1 opacity-90"/>
            </div>
            <div className="mt-2 text-[12px] opacity-90">Mind-Productivity</div>
          </div>
        </Link>

        {/* Focus Session Progress */}
        <Card as={Link} to="/focus" className="col-span-12 sm:col-span-6 lg:col-span-3 group">
          <div className="flex items-start justify-between">
            <div className="text-[13px] font-medium" style={{color:"var(--pc-ink)"}}>Focus Session Progress</div>
            <div className="flex items-center gap-1 opacity-60">
              <Maximize2 className="w-3.5 h-3.5"/>
              <MoreHorizontal className="w-3.5 h-3.5"/>
            </div>
          </div>
          <div className="mt-5 font-serif text-[40px] leading-none" style={{color:"var(--pc-ink)"}}>{goalPct}%</div>
          <div className="text-[11px] mt-1" style={{color:"var(--pc-muted)"}}>Positivity Growth</div>
          <div className="mt-5 h-1.5 rounded-full overflow-hidden" style={{background:"var(--pc-surface2)"}}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{width:`${goalPct}%`, background:"linear-gradient(90deg,var(--pc-primary),var(--pc-lavender))"}}/>
          </div>
          <div className="mt-5 pt-4 border-t text-[13px] font-medium" style={{borderColor:"var(--pc-border)", color:"var(--pc-ink)"}}>App Engagement</div>
          <div className="text-[11px] mt-1" style={{color:"var(--pc-muted)"}}>
            <span style={{color:"var(--pc-ink)", fontWeight:500}}>{Math.min(99, 40+((mg.streak.current||0)*3))}%</span> of sessions inside productive tools
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {["🧘","📓","🌱","🫁"].map((e,i)=>(
              <div key={i} className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px]"
                style={{background:"var(--pc-surface2)", border:"1px solid var(--pc-border)"}}>{e}</div>
            ))}
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px]"
              style={{background:"var(--pc-surface2)", border:"1px solid var(--pc-border)", color:"var(--pc-muted)"}}>+14</div>
          </div>
        </Card>
      </section>

      {/* Row 2 — Day pill + Mood + habit/goal/allocation + emotional trend */}
      <section className="mt-4 sm:mt-5 grid grid-cols-12 gap-4 sm:gap-5">
        {/* Day selector + Mood overview */}
        <Card className="col-span-12 lg:col-span-4 relative overflow-hidden">
          <div className="flex items-center justify-between rounded-full h-9 px-3"
            style={{background:"var(--pc-surface2)"}}>
            <button onClick={()=>setDayIdx(i=>Math.min(6,i+1))} className="opacity-60 hover:opacity-100 transition">
              <ChevronLeft className="w-4 h-4"/>
            </button>
            <div className="text-[12px]" style={{color:"var(--pc-ink)"}}>{dayLabel}</div>
            <button onClick={()=>setDayIdx(i=>Math.max(0,i-1))} className="opacity-60 hover:opacity-100 transition">
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>

          <Link to="/journal" className="mt-5 flex items-start justify-between group">
            <div>
              <div className="text-[15px] font-medium" style={{color:"var(--pc-ink)"}}>Mood Overview</div>
              <div className="text-[11px] mt-0.5" style={{color:"var(--pc-muted)"}}>Tap to log a moment</div>
            </div>
            <Maximize2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition"/>
          </Link>

          <div className="mt-6">
            <div className="text-[12px]" style={{color:"var(--pc-ink)"}}>Control Mood</div>
            <div className="text-[11px]" style={{color:"var(--pc-muted)"}}>Middle</div>
            <div className="mt-3 h-2 rounded-full overflow-hidden flex" style={{background:"var(--pc-surface2)"}}>
              <div style={{width:`${controlMood}%`, background:"var(--pc-soft)"}}/>
              <div style={{width:`${goodMood}%`, background:"linear-gradient(90deg,var(--pc-primary),var(--pc-lavender))"}}/>
              <div style={{width:`${badMood}%`, background:"var(--pc-border)"}}/>
            </div>
            <div className="mt-4 flex items-center gap-5 text-[11px]" style={{color:"var(--pc-muted)"}}>
              <span className="flex items-center gap-1.5"><Dot color="linear-gradient(90deg,var(--pc-primary),var(--pc-lavender))"/> Good Mood <b className="ml-1" style={{color:"var(--pc-ink)"}}>{goodMood}%</b></span>
              <span className="flex items-center gap-1.5"><Dot color="var(--pc-border)"/> Bad Mood <b className="ml-1" style={{color:"var(--pc-ink)"}}>{badMood}%</b></span>
            </div>
          </div>
        </Card>

        {/* Positive Habit Streak — half donut */}
        <Card as={Link} to="/breathe" className="col-span-6 lg:col-span-2 flex flex-col">
          <div className="text-[13px] font-medium" style={{color:"var(--pc-ink)"}}>Positive Habit<br/>Streak</div>
          <div className="mt-auto flex flex-col items-center">
            <HalfDonut pct={Math.max(habitPct, 34)} label={`${Math.max(habitPct,34)}%`} sub="Positivity Growth"/>
          </div>
        </Card>

        {/* Goal Completion */}
        <Card as={Link} to="/mindgym" className="col-span-6 lg:col-span-2 flex flex-col">
          <div className="text-[13px] font-medium" style={{color:"var(--pc-ink)"}}>Goal Completion<br/>Rate</div>
          <div className="mt-auto flex flex-col items-center">
            <FullDonut pct={goalPct||64} label={`${goalPct||64}%`} sub="Weekly Goal"/>
            <div className="mt-3 flex items-center gap-3 text-[10px]" style={{color:"var(--pc-muted)"}}>
              <span className="flex items-center gap-1"><Dot color="var(--pc-border)"/> Missed {100-(goalPct||64)}%</span>
              <span className="flex items-center gap-1"><Dot color="linear-gradient(90deg,var(--pc-primary),var(--pc-lavender))"/> Done {goalPct||64}%</span>
            </div>
          </div>
        </Card>

        {/* Personal Project Allocation */}
        <Card as={Link} to="/gratitude" className="col-span-12 lg:col-span-4 relative overflow-hidden">
          <BlurDot className="bottom-[-40px] right-[-30px]" size={180}/>
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-medium" style={{color:"var(--pc-ink)"}}>Personal Project<br/>Allocation</div>
            <Maximize2 className="w-3.5 h-3.5 opacity-60"/>
          </div>
          <div className="mt-6 font-serif text-[52px] leading-none" style={{color:"var(--pc-ink)"}}>{projectAlloc}%</div>
          <div className="mt-3 text-[12px] max-w-[240px]" style={{color:"var(--pc-muted)"}}>
            Time spent on self-growth vs external commitments
          </div>
          <div className="mt-5 flex items-center gap-1.5">
            {Array.from({length:20}).map((_,i)=>{
              const active = i < Math.round(projectAlloc/5);
              return <div key={i} className="h-6 flex-1 rounded-full transition"
                style={{background: active ? "linear-gradient(180deg,var(--pc-primary),var(--pc-lavender))" : "var(--pc-surface2)"}}/>;
            })}
          </div>
        </Card>
      </section>

      {/* Row 3 — Emotional Trend + Mindspace + peripheral cards */}
      <section className="mt-4 sm:mt-5 grid grid-cols-12 gap-4 sm:gap-5">
        {/* Emotional Trend Report — bar chart */}
        <Card as={Link} to="/screening" className="col-span-12 lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[15px] font-medium" style={{color:"var(--pc-ink)"}}>Emotional Trend Report</div>
              <div className="text-[11px] mt-0.5" style={{color:"var(--pc-muted)"}}>Wellness across the week</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 px-3 rounded-full text-[11px] flex items-center gap-1"
                style={{background:"var(--pc-surface2)", color:"var(--pc-muted)"}}>Monthly <ChevronRight className="w-3 h-3 rotate-90"/></div>
              <Maximize2 className="w-3.5 h-3.5 opacity-60"/>
            </div>
          </div>

          <div className="mt-4 flex items-end gap-6">
            <div>
              <div className="font-serif text-[44px] leading-none flex items-baseline gap-2" style={{color:"var(--pc-ink)"}}>
                {emoStability}%
                <span className="text-[11px] font-sans" style={{color:"var(--pc-muted)"}}>Average</span>
              </div>
              <div className="text-[11px] mt-1" style={{color:"var(--pc-muted)"}}>Emotional stability</div>
            </div>
          </div>

          <TrendChart peace={emoStability} />
        </Card>

        {/* Mindspace Usage */}
        <Card as={Link} to="/focus" className="col-span-12 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div className="text-[15px] font-medium" style={{color:"var(--pc-ink)"}}>Mindspace Usage</div>
            <Maximize2 className="w-3.5 h-3.5 opacity-60"/>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <SplitRing focused={focusedMind} free={freeMind}/>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <div className="flex items-center gap-1.5" style={{color:"var(--pc-muted)"}}><Dot color="var(--pc-border)"/> Focused Mind</div>
              <div className="mt-0.5 text-[15px] font-medium" style={{color:"var(--pc-ink)"}}>{focusedMind}%</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5" style={{color:"var(--pc-muted)"}}><Dot color="linear-gradient(90deg,var(--pc-primary),var(--pc-lavender))"/> Free Mindspace</div>
              <div className="mt-0.5 text-[15px] font-medium" style={{color:"var(--pc-ink)"}}>{freeMind}%</div>
            </div>
          </div>
          <div className="mt-4 text-[11px] flex items-center gap-1" style={{color:"var(--pc-muted)"}}>
            <TrendingUp className="w-3 h-3 rotate-180"/> Decrease 5%
          </div>
        </Card>
      </section>

      {/* Row 4 — quick module cards */}
      <section className="mt-4 sm:mt-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <QuickCard to="/journal" title="Journal" value={`${data.journalStreak ?? 0}d`} sub="streak"/>
        <QuickCard to="/gratitude" title="Gratitude" value={`${data.gratitudeToday ?? 0}`} sub="today"/>
        <QuickCard to="/breathe" title="Breathe" value={`${data.breatheStreak ?? 0}d`} sub="streak"/>
        <QuickCard to="/buddies" title="Peace Buddies" value="12" sub="online"/>
        <QuickCard to="/counselling" title="Counselling" value={data.nextAppt ? "1" : "0"} sub={data.nextAppt ? "upcoming" : "none"}/>
        <QuickCard to="/resources" title="Resources" value="200+" sub="pieces"/>
      </section>

      <footer className="mt-10 mb-4 flex items-center justify-between text-[11px]" style={{color:"var(--pc-muted)"}}>
        <span>Softly, quietly — that's how growth happens.</span>
        <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3"/> PeaceCode</span>
      </footer>
    </main>
  );
}

// ─── Reusable primitives ─────────────────────────────────────────────

function Card({ as: As = "div" as any, className = "", children, ...rest }: any) {
  return (
    <As
      {...rest}
      className={`relative rounded-3xl p-5 sm:p-6 transition duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_30px_-18px_rgba(75,108,183,0.35)] ${className}`}
      style={{background:"var(--pc-surface)", border:"1px solid var(--pc-border)"}}
    >
      {children}
    </As>
  );
}

function ArrowOpen() {
  return (
    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition"
      style={{color:"var(--pc-muted)"}}>
      <ArrowUpRight className="w-4 h-4"/>
    </div>
  );
}

function BlurDot({ className = "", size = 180, color = "var(--pc-lavender)" }: { className?: string; size?: number; color?: string }) {
  return (
    <div aria-hidden className={`absolute rounded-full pointer-events-none ${className}`}
      style={{width:size, height:size, background:color, filter:"blur(48px)", opacity:0.55}}/>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="inline-block w-2 h-2 rounded-full" style={{background: color}}/>;
}

function AmbientDots() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute rounded-full" style={{top:"5%", left:"-8%", width:340, height:340, background:"var(--pc-lavender)", filter:"blur(90px)", opacity:0.45}}/>
      <div className="absolute rounded-full" style={{top:"40%", right:"-10%", width:420, height:420, background:"var(--pc-soft)", filter:"blur(110px)", opacity:0.35}}/>
      <div className="absolute rounded-full" style={{bottom:"-10%", left:"30%", width:300, height:300, background:"var(--pc-primary)", filter:"blur(120px)", opacity:0.15}}/>
    </div>
  );
}

// Half donut (like Positive Habit Streak)
function HalfDonut({ pct, label, sub }: { pct: number; label: string; sub: string }) {
  const r = 44, c = Math.PI * r;
  const dash = (pct/100) * c;
  return (
    <div className="relative w-[128px] h-[80px]">
      <svg viewBox="0 0 120 70" className="w-full h-full">
        <defs>
          <linearGradient id="hd" x1="0" x2="1"><stop offset="0" stopColor="var(--pc-primary)"/><stop offset="1" stopColor="var(--pc-lavender)"/></linearGradient>
        </defs>
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="var(--pc-surface2)" strokeWidth="10" strokeLinecap="round"/>
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="url(#hd)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <div className="font-serif text-[22px] leading-none" style={{color:"var(--pc-ink)"}}>{label}</div>
        <div className="text-[9px] mt-1" style={{color:"var(--pc-muted)"}}>{sub}</div>
      </div>
    </div>
  );
}

// Full donut
function FullDonut({ pct, label, sub }: { pct: number; label: string; sub: string }) {
  const r = 34, c = 2 * Math.PI * r;
  const dash = (pct/100) * c;
  return (
    <div className="relative w-[110px] h-[110px]">
      <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="fd" x1="0" x2="1"><stop offset="0" stopColor="var(--pc-primary)"/><stop offset="1" stopColor="var(--pc-lavender)"/></linearGradient>
        </defs>
        <circle cx="45" cy="45" r={r} fill="none" stroke="var(--pc-surface2)" strokeWidth="8"/>
        <circle cx="45" cy="45" r={r} fill="none" stroke="url(#fd)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-serif text-[20px] leading-none" style={{color:"var(--pc-ink)"}}>{label}</div>
        <div className="text-[9px] mt-0.5" style={{color:"var(--pc-muted)"}}>{sub}</div>
      </div>
    </div>
  );
}

// Split ring (Mindspace Usage)
function SplitRing({ focused, free }: { focused: number; free: number }) {
  const r = 60, c = 2 * Math.PI * r;
  const dFocus = (focused/100) * c;
  const dFree = (free/100) * c;
  return (
    <div className="relative w-[180px] h-[180px]">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="sr" x1="0" x2="1"><stop offset="0" stopColor="var(--pc-primary)"/><stop offset="1" stopColor="var(--pc-lavender)"/></linearGradient>
        </defs>
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--pc-border)" strokeWidth="14" strokeDasharray={`${dFocus} ${c}`} strokeLinecap="round"/>
        <circle cx="80" cy="80" r={r} fill="none" stroke="url(#sr)" strokeWidth="14"
          strokeDasharray={`${dFree} ${c}`} strokeDashoffset={`-${dFocus + 8}`} strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-serif text-[28px] leading-none" style={{color:"var(--pc-ink)"}}>{focused}%</div>
        <div className="text-[10px] mt-1" style={{color:"var(--pc-muted)"}}>Focused</div>
      </div>
    </div>
  );
}

// Bar chart for Emotional Trend
function TrendChart({ peace }: { peace: number }) {
  const bars = useMemo(() => {
    const seed = peace;
    return Array.from({length: 40}).map((_,i) => {
      const t = i/40;
      const base = 30 + Math.sin(i*0.6 + seed*0.05) * 18 + Math.cos(i*0.3) * 8;
      return Math.max(12, Math.min(100, base + (t*30)));
    });
  }, [peace]);
  const peakIdx = bars.indexOf(Math.max(...bars));
  return (
    <div className="mt-6">
      <div className="h-[160px] flex items-end gap-[3px]">
        {bars.map((h,i) => {
          const isPeak = i === peakIdx;
          return (
            <div key={i} className="flex-1 rounded-full transition-all duration-500"
              style={{
                height: `${h}%`,
                background: isPeak
                  ? "linear-gradient(180deg,var(--pc-primary),var(--pc-lavender))"
                  : i < peakIdx
                    ? "var(--pc-surface2)"
                    : "var(--pc-border)",
                opacity: isPeak ? 1 : (0.6 + (i/bars.length)*0.3),
              }}/>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-end gap-2 text-[10px]">
        <span className="px-2 py-0.5 rounded-full font-medium text-white"
          style={{background:"linear-gradient(90deg,var(--pc-primary),var(--pc-lavender))"}}>+20%</span>
        <span style={{color:"var(--pc-muted)"}}>{Math.min(99, peace+7)}% Emotional stability</span>
      </div>
    </div>
  );
}

function QuickCard({ to, title, value, sub }: { to: string; title: string; value: string; sub: string }) {
  return (
    <Link to={to} className="group relative rounded-2xl p-4 transition hover:-translate-y-[2px] hover:shadow-[0_8px_24px_-16px_rgba(75,108,183,0.35)]"
      style={{background:"var(--pc-surface)", border:"1px solid var(--pc-border)"}}>
      <div className="text-[11px]" style={{color:"var(--pc-muted)"}}>{title}</div>
      <div className="mt-2 font-serif text-[24px] leading-none" style={{color:"var(--pc-ink)"}}>{value}</div>
      <div className="text-[10px] mt-1" style={{color:"var(--pc-muted)"}}>{sub}</div>
      <ArrowUpRight className="w-3.5 h-3.5 absolute top-3 right-3 opacity-0 group-hover:opacity-70 transition" style={{color:"var(--pc-muted)"}}/>
    </Link>
  );
}
