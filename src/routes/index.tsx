import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Home,
  Compass,
  BookOpen,
  Moon,
  Sun,
  Settings,
  Bell,
  Play,
  Pause,
  Send,
  Heart,
  Flame,
  Trophy,
  Users,
  Feather,
  Wind,
  BookHeart,
  Search,
  Plus,
  ChevronRight,
  Music,
  ArrowUpRight,
  Sparkles,
  Waves,
  Cloud,
  Sunrise,
  Leaf,
  Coffee,
  PenLine,
  Volume2,
  VolumeX,
  Quote,
} from "lucide-react";
import logo from "@/assets/peacecode-logo.png";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

// ─── data ──────────────────────────────────────────────────────────
const days = [
  { n: 7, d: "Mon" }, { n: 8, d: "Tue" }, { n: 9, d: "Wed" },
  { n: 10, d: "Thu" }, { n: 11, d: "Fri" }, { n: 12, d: "Sat" }, { n: 13, d: "Sun" },
];

const nav = [
  { icon: Home, label: "Today", active: true },
  { icon: Compass, label: "Explore" },
  { icon: BookOpen, label: "Sessions" },
  { icon: Moon, label: "Sleep" },
  { icon: Users, label: "Circle" },
  { icon: BookHeart, label: "Journal" },
  { icon: Trophy, label: "Milestones" },
];

const moods = [
  { emoji: "☁️", label: "cloudy", tint: "#c9c2b4" },
  { emoji: "🌤", label: "gentle", tint: "#e8d5b7" },
  { emoji: "🌿", label: "grounded", tint: "#b8c9a8" },
  { emoji: "🌸", label: "tender", tint: "#e8c5c0" },
  { emoji: "🔥", label: "restless", tint: "#d4a087" },
  { emoji: "🌊", label: "flowing", tint: "#b0c4c8" },
];

const focusTools = [
  { label: "Breathe", icon: Wind, hint: "box · 4·4·4·4", color: "#b8c9a8" },
  { label: "Rainfall", icon: Waves, hint: "36 min loop", color: "#b0c4c8" },
  { label: "Pomodoro", icon: Coffee, hint: "25 · 5 · 25", color: "#d4a087" },
  { label: "Journal", icon: Feather, hint: "one line a day", color: "#e8c5c0" },
  { label: "Body scan", icon: Leaf, hint: "9 min guided", color: "#c9b99a" },
  { label: "Silence", icon: Cloud, hint: "just be", color: "#c9c2b4" },
];

const journey = [
  { day: 1, label: "Seed", done: true },
  { day: 7, label: "Sprout", done: true },
  { day: 14, label: "Bloom", done: true, current: true },
  { day: 21, label: "Grow" },
  { day: 30, label: "Flourish" },
  { day: 45, label: "Root" },
  { day: 60, label: "Still" },
];

const posts = [
  { name: "someone kind", text: "grateful my roommate made chai without asking today.", likes: 24, mood: "🌿" },
  { name: "a quiet friend", text: "finished a whole week of morning stillness. it's working.", likes: 41, mood: "🌸" },
  { name: "anon", text: "called mom instead of scrolling. small, but mine.", likes: 58, mood: "☁️" },
  { name: "night owl", text: "slept eight hours. haven't in a month. tiny miracle.", likes: 33, mood: "🌊" },
];

const activities = [
  { title: "Morning breath", subtitle: "a soft beginning", minutes: 12, time: "07:31" },
  { title: "Slow walk", subtitle: "notice five things", minutes: 22, time: "09:14" },
  { title: "Study, gently", subtitle: "one pomodoro", minutes: 25, time: "11:05" },
  { title: "Evening thread", subtitle: "wrote a note to yourself", minutes: 8, time: "20:42" },
];

const quotes = [
  { t: "You do not have to be good. You only have to let the soft animal of your body love what it loves.", a: "Mary Oliver" },
  { t: "Between stimulus and response there is a space. In that space is our power.", a: "Viktor Frankl" },
  { t: "Almost everything will work again if you unplug it, including you.", a: "Anne Lamott" },
];

function Mark({ className = "w-5 h-5", opacity = 1 }: { className?: string; opacity?: number }) {
  return <img src={logo} alt="" className={className} style={{ opacity }} />;
}

function Dashboard() {
  const [dark, setDark] = useState(false);
  const [day, setDay] = useState(12);
  const [mood, setMood] = useState(3);
  const [breathing, setBreathing] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [note, setNote] = useState("");
  const [sound, setSound] = useState(false);
  const [quote, setQuote] = useState(0);
  const [stress, setStress] = useState(28);
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    const q = setInterval(() => setQuote((q) => (q + 1) % quotes.length), 8000);
    return () => clearInterval(q);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  // palette
  const bg = dark ? "#151311" : "#f5efe4";
  const surface = dark ? "#1e1b18" : "#faf5ea";
  const surface2 = dark ? "#26221e" : "#ede4d1";
  const border = dark ? "#2a2724" : "#e5dcc7";
  const ink = dark ? "#ece6d8" : "#25211c";
  const muted = dark ? "#8a8378" : "#8a8072";
  const accent = "#a67c52";
  const clay = "#c17b6f";
  const sage = "#8ba282";

  return (
    <div className={`min-h-screen w-full font-sans transition-colors ${dark ? "dark" : ""}`} style={{ background: bg, color: ink }}>
      {/* film-grain + soft aurora backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
             style={{ background: dark ? "radial-gradient(circle,#3a2e22,transparent 70%)" : "radial-gradient(circle,#e8d0b0,transparent 70%)" }} />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
             style={{ background: dark ? "radial-gradient(circle,#2a3830,transparent 70%)" : "radial-gradient(circle,#d0dcc2,transparent 70%)" }} />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl"
             style={{ background: dark ? "radial-gradient(circle,#3a2823,transparent 70%)" : "radial-gradient(circle,#eed0c8,transparent 70%)" }} />
      </div>

      {/* ─── slim glass sidebar (hover to expand) ─── */}
      <aside className="hidden lg:flex fixed top-6 bottom-6 left-6 z-40 group flex-col py-6 px-3 rounded-full backdrop-blur-2xl transition-[width] duration-300 hover:w-56 w-[68px] overflow-hidden"
             style={{ background: dark ? "rgba(30,27,24,0.72)" : "rgba(255,251,242,0.72)", border: `1px solid ${border}`, boxShadow: "0 20px 50px -20px rgba(30,27,24,0.18)" }}>
        <div className="flex items-center gap-3 px-2.5 mb-8">
          <Mark className="w-9 h-9 shrink-0" />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <div className="font-serif text-[16px] leading-none">PeaceCode</div>
            <div className="text-[8px] tracking-[0.3em] uppercase opacity-50 mt-1">a soft place</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className="relative flex items-center gap-3 px-3 py-2.5 rounded-full transition"
                      style={item.active ? { background: dark ? "#2a2724" : "#ede4d1", color: ink } : { color: muted }}>
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.4} />
                <span className="text-[13px] tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
                {item.active && <span className="absolute right-3 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition" style={{ background: accent }} />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <button onClick={() => setDark(!dark)} className="flex items-center gap-3 px-3 py-2.5 rounded-full transition" style={{ color: muted }}>
            {dark ? <Sun className="w-[18px] h-[18px] shrink-0" strokeWidth={1.4}/> : <Moon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.4}/>}
            <span className="text-[13px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">{dark ? "day" : "night"} mode</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-full" style={{ color: muted }}>
            <Settings className="w-[18px] h-[18px] shrink-0" strokeWidth={1.4}/>
            <span className="text-[13px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Settings</span>
          </button>
          <div className="mx-2 mt-3 rounded-2xl p-3 flex items-center gap-2.5" style={{ background: dark ? "#26221e" : "#ede4d1" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#d9c4a8" }}>
              <Mark className="w-4 h-4"/>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <div className="font-serif text-[13px] leading-none">Keya</div>
              <div className="flex items-center gap-1 mt-1 text-[9px]" style={{ color: accent }}>
                <Flame className="w-2.5 h-2.5" strokeWidth={1.5}/> 12 day streak
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── mobile top bar ─── */}
      <header className={`lg:hidden sticky top-0 z-30 flex items-center justify-between px-5 py-3 backdrop-blur-xl transition ${scrolled ? "border-b" : ""}`}
              style={{ background: dark ? "rgba(21,19,17,0.85)" : "rgba(245,239,228,0.85)", borderColor: border }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Mark className="w-7 h-7 shrink-0"/>
          <div className="min-w-0">
            <div className="font-serif text-[15px] leading-none truncate">PeaceCode</div>
            <div className="text-[8px] tracking-[0.3em] uppercase mt-1 opacity-50">a soft place</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px]" style={{ background: surface2, color: accent }}>
            <Flame className="w-3 h-3" strokeWidth={1.5}/> 12
          </div>
          <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: surface, border: `1px solid ${border}` }}>
            {dark ? <Sun className="w-4 h-4 opacity-70"/> : <Moon className="w-4 h-4 opacity-70"/>}
          </button>
        </div>
      </header>

      {/* ─── full-screen editorial canvas ─── */}
      <main ref={mainRef} className="relative z-10 lg:pl-[110px] lg:pr-8 xl:pr-12 px-5 sm:px-8 py-8 lg:py-12 pb-32 lg:pb-16 max-w-[1600px] mx-auto">

        {/* HERO — asymmetric editorial band */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-14">
          {/* left: date + headline */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className="text-[10px] tracking-[0.35em] uppercase opacity-60" style={{ color: accent }}>
                Wednesday · Eleven July · 06:41
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full px-4 py-2" style={{ background: surface, border: `1px solid ${border}` }}>
                  <Search className="w-3.5 h-3.5 opacity-40"/>
                  <input placeholder="search stillness…" className="bg-transparent outline-none text-[12px] w-40 placeholder:opacity-40"/>
                </div>
                <button className="relative w-10 h-10 rounded-full flex items-center justify-center" style={{ background: surface, border: `1px solid ${border}` }}>
                  <Bell className="w-4 h-4 opacity-60" strokeWidth={1.5}/>
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" style={{ background: clay }}/>
                </button>
              </div>
            </div>

            <h1 className="font-serif text-[44px] sm:text-[64px] lg:text-[84px] xl:text-[104px] leading-[0.95] tracking-tight" style={{ letterSpacing: "-0.03em" }}>
              <em className="italic font-light" style={{ color: accent }}>Softly,</em><br/>
              you begin<br/>
              again.
            </h1>
            <p className="text-[13px] sm:text-[14px] mt-6 opacity-60 max-w-md leading-relaxed">
              A slow look at how your mind and moments are moving today. No pressure — just presence.
            </p>

            {/* day picker */}
            <div className="mt-8 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {days.map((dd) => {
                const active = day === dd.n;
                return (
                  <button key={dd.n} onClick={() => setDay(dd.n)}
                          className="shrink-0 flex flex-col items-center justify-center w-14 h-[72px] rounded-full transition-all text-[10px]"
                          style={active ? { background: ink, color: bg, transform: "scale(1.02)" } : { background: "transparent", color: muted }}>
                    <span className="font-serif text-[20px] leading-none mb-1.5">{dd.n}</span>
                    <span className="tracking-[0.2em] uppercase opacity-70">{dd.d.slice(0,2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* right: featured stillness — visual anchor */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-full min-h-[380px] p-7 flex flex-col justify-between cursor-pointer group"
                 style={{ background: "linear-gradient(155deg,#e8d0b0 0%,#d1a780 45%,#8b6642 100%)" }}>
              <Mark className="absolute -right-10 -bottom-10 w-72 h-72 group-hover:scale-110 transition duration-[1200ms]" opacity={0.14}/>
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "#f5eee0" }}>a walk with breath</div>
                <div className="font-serif text-[36px] lg:text-[44px] leading-[0.95]" style={{ color: "#2a1f14" }}>
                  Meditation<br/><em className="italic font-light">&amp; movement</em>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div style={{ color: "#2a1f14" }}>
                  <div className="font-serif italic text-xl">24 min</div>
                  <div className="opacity-60 tracking-[0.25em] uppercase text-[9px] mt-1">gentle · guided</div>
                </div>
                <button className="w-14 h-14 rounded-full flex items-center justify-center transition group-hover:scale-105" style={{ background: "#2a2724" }}>
                  <Play className="w-4 h-4 ml-0.5" style={{ color: "#faf6ee" }} strokeWidth={2}/>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MOOD / TODAY — full-width editorial card */}
        <section className="rounded-[36px] p-7 sm:p-10 mb-6 relative overflow-hidden"
                 style={{ background: surface, border: `1px solid ${border}` }}>
          <Mark className="absolute -right-16 -bottom-16 w-80 h-80" opacity={dark ? 0.04 : 0.05}/>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
            {/* mood picker */}
            <div className="lg:col-span-4">
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-3">how are you, really</div>
              <h3 className="font-serif text-[32px] leading-[1.05] mb-6">
                Today feels <em className="italic" style={{ color: accent }}>{moods[mood].label}</em>
              </h3>
              <div className="grid grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-2">
                {moods.map((m, i) => (
                  <button key={m.label} onClick={() => setMood(i)}
                          className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition hover:scale-[1.04]"
                          style={{ background: mood === i ? m.tint : surface2, border: `1px solid ${mood === i ? m.tint : border}` }}>
                    <span className="text-lg">{m.emoji}</span>
                    <span className="text-[8px] tracking-[0.15em] uppercase opacity-70">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* peace score */}
            <div className="lg:col-span-4 flex flex-col justify-center lg:border-l lg:border-r lg:px-8" style={{ borderColor: border }}>
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2">peace score · today</div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-serif text-[88px] leading-none tracking-tight">90</span>
                <span className="font-serif italic text-2xl opacity-40">%</span>
              </div>
              <p className="text-[13px] opacity-60 mb-5 italic">a soft, quiet kind of happy.</p>
              <div className="space-y-2.5">
                {[{ c: sage, l: "at ease", v: 70 }, { c: clay, l: "tense", v: 15 }, { c: "#a89380", l: "wistful", v: 15 }].map((m) => (
                  <div key={m.l} className="flex items-center gap-3 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.c }}/>
                    <span className="opacity-60 w-14">{m.l}</span>
                    <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: dark ? "#2a2724" : "#e5dcc7" }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.v}%`, background: m.c }}/>
                    </div>
                    <span className="font-serif italic opacity-50 w-6 text-right">{m.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* stress dial + micro stats */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-3">stress dial · slide to log</div>
                <div className="rounded-2xl p-4" style={{ background: surface2 }}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-serif text-[28px] leading-none">{stress}<span className="text-[12px] opacity-40 ml-1">/100</span></span>
                    <span className="text-[10px] italic opacity-60">{stress < 30 ? "settled" : stress < 60 ? "some weight" : "carrying a lot"}</span>
                  </div>
                  <input type="range" min={0} max={100} value={stress} onChange={(e) => setStress(+e.target.value)}
                         className="w-full accent-[#a67c52]"/>
                  <div className="flex justify-between text-[9px] tracking-[0.2em] uppercase opacity-40 mt-1">
                    <span>calm</span><span>heavy</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[{ v: "87", u: "min", l: "stillness" }, { v: "23", u: "", l: "sessions" }, { v: "34", u: "min", l: "avg dwell" }].map((s) => (
                  <div key={s.l} className="rounded-2xl px-3 py-3" style={{ background: surface2 }}>
                    <div className="text-[9px] tracking-[0.2em] uppercase opacity-50 mb-1.5">{s.l}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-[22px] leading-none">{s.v}</span>
                      <span className="text-[10px] opacity-50">{s.u}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BENTO ROW: breathing orb · timer · quote */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-6">
          {/* breathing orb — interactive */}
          <div className="lg:col-span-4 rounded-[32px] p-6 relative overflow-hidden"
               style={{ background: `linear-gradient(160deg, ${dark ? "#1e1b18" : "#eef1e6"} 0%, ${dark ? "#26221e" : "#dfe6d1"} 100%)`, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-50">box breathing</div>
              <button onClick={() => setBreathing(!breathing)}
                      className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full transition"
                      style={{ background: breathing ? clay : ink, color: bg }}>
                {breathing ? "pause" : "begin"}
              </button>
            </div>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-2 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%,#d9c4a8,#8ba282)", animation: breathing ? "breathe-orb 8s ease-in-out infinite" : "none", opacity: 0.9 }}/>
                <div className="absolute inset-6 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%,#e8d5b7,#a89380)", animation: breathing ? "breathe-orb 8s ease-in-out infinite reverse" : "none", opacity: 0.7 }}/>
                <Mark className="relative w-12 h-12" opacity={0.9}/>
              </div>
            </div>
            <div className="font-serif italic text-center text-[13px] opacity-60">
              {breathing ? "in… hold… out… hold…" : "four seconds each side"}
            </div>
            <style>{`@keyframes breathe-orb{0%,100%{transform:scale(0.78);opacity:0.75}50%{transform:scale(1.08);opacity:1}}`}</style>
          </div>

          {/* pomodoro timer — dark cinematic */}
          <div className="lg:col-span-4 rounded-[32px] p-6 relative overflow-hidden" style={{ background: "#25211c", color: "#f5efe4" }}>
            <Mark className="absolute -right-6 -bottom-6 w-40 h-40" opacity={0.08}/>
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] tracking-[0.3em] uppercase opacity-50">a slow hour</div>
                <div className="text-[10px] italic opacity-60">pomodoro · deep focus</div>
              </div>
              <div className="font-serif text-[72px] leading-none tracking-tight text-center my-6" style={{ letterSpacing: "-0.03em" }}>
                {mm}<span className="opacity-30">:</span>{ss}
              </div>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => setRunning(!running)}
                        className="flex-1 rounded-full py-3 text-[11px] tracking-[0.25em] uppercase flex items-center justify-center gap-2"
                        style={{ background: "#f5efe4", color: "#25211c" }}>
                  {running ? <Pause className="w-3 h-3"/> : <Play className="w-3 h-3"/>}
                  {running ? "pause" : "begin"}
                </button>
                <button onClick={() => { setRunning(false); setSeconds(25 * 60); }}
                        className="px-5 rounded-full text-[11px] tracking-[0.25em] uppercase opacity-70 hover:opacity-100"
                        style={{ border: "1px solid rgba(245,239,228,0.15)" }}>reset</button>
                <button onClick={() => setSound(!sound)} className="w-11 rounded-full flex items-center justify-center opacity-70 hover:opacity-100"
                        style={{ border: "1px solid rgba(245,239,228,0.15)" }}>
                  {sound ? <Volume2 className="w-3.5 h-3.5"/> : <VolumeX className="w-3.5 h-3.5"/>}
                </button>
              </div>
              {sound && <div className="mt-3 text-[10px] tracking-[0.2em] uppercase opacity-50 flex items-center gap-2">
                <Sparkles className="w-3 h-3"/> forest rain · looping
              </div>}
            </div>
          </div>

          {/* quote / weekly reflection */}
          <div className="lg:col-span-4 rounded-[32px] p-7 relative overflow-hidden flex flex-col justify-between"
               style={{ background: surface2, border: `1px solid ${border}` }}>
            <Quote className="w-8 h-8 opacity-30" strokeWidth={1}/>
            <div>
              <p className="font-serif text-[19px] leading-[1.35] italic transition-opacity duration-500" style={{ color: ink }}>
                "{quotes[quote].t}"
              </p>
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-50 mt-4">— {quotes[quote].a}</div>
            </div>
            <div className="flex items-center gap-1.5">
              {quotes.map((_, i) => (
                <button key={i} onClick={() => setQuote(i)} className="h-[3px] rounded-full transition-all"
                        style={{ width: quote === i ? 24 : 8, background: quote === i ? accent : border }}/>
              ))}
            </div>
          </div>
        </section>

        {/* FOCUS TOOLKIT — full width grid of six tiles */}
        <div className="flex items-baseline justify-between mb-4 mt-2">
          <div>
            <h3 className="font-serif text-[26px] tracking-tight">A quiet toolkit</h3>
            <p className="text-[11px] opacity-50 mt-1 italic">tap anything. no pressure to finish.</p>
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase opacity-50">six ways in</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-14">
          {focusTools.map((t) => {
            const I = t.icon;
            return (
              <button key={t.label}
                      className="group relative overflow-hidden rounded-[24px] aspect-square p-5 flex flex-col justify-between text-left transition hover:-translate-y-1 duration-200"
                      style={{ background: surface, border: `1px solid ${border}` }}>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center transition group-hover:scale-110" style={{ background: t.color, opacity: 0.75 }}>
                    <I className="w-4 h-4" strokeWidth={1.4} style={{ color: "#25211c" }}/>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition"/>
                </div>
                <div>
                  <div className="font-serif text-[19px] leading-none tracking-tight">{t.label}</div>
                  <div className="text-[9px] tracking-[0.2em] uppercase opacity-50 mt-2">{t.hint}</div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-60 transition duration-500" style={{ background: t.color }}/>
              </button>
            );
          })}
        </div>

        {/* JOURNEY + JOURNAL — asymmetric split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14">
          {/* journey */}
          <div className="lg:col-span-8 rounded-[36px] p-7 sm:p-10 relative overflow-hidden"
               style={{ background: `linear-gradient(135deg, ${dark ? "#26221e" : "#ede4d1"} 0%, ${dark ? "#1e1b18" : "#dfd3ba"} 100%)`, border: `1px solid ${border}` }}>
            <div className="flex items-start justify-between mb-10">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2">the slow journey</div>
                <h3 className="font-serif text-[30px] leading-[1.05] max-w-md">
                  Fourteen days in — <em className="italic" style={{ color: accent }}>halfway to bloom.</em>
                </h3>
              </div>
              <Mark className="w-12 h-12 shrink-0" opacity={0.35}/>
            </div>
            <div className="relative flex items-center justify-between overflow-x-auto scrollbar-none">
              <div className="absolute left-4 right-4 top-4 h-px" style={{ background: dark ? "#3a3630" : "#c9b99a" }}/>
              <div className="absolute left-4 top-4 h-px transition-all duration-1000" style={{ width: "40%", background: accent }}/>
              {journey.map((m) => (
                <div key={m.day} className="relative flex flex-col items-center gap-3 z-10 shrink-0 px-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-serif text-[12px] transition"
                       style={m.current ? { background: ink, color: bg, transform: "scale(1.25)" }
                                        : m.done ? { background: accent, color: "#faf6ee" }
                                                 : { background: surface, color: muted, border: `1px solid ${dark ? "#3a3630" : "#c9b99a"}` }}>
                    {m.day}
                  </div>
                  <span className="text-[9px] tracking-[0.2em] uppercase opacity-60">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* one-line journal */}
          <div className="lg:col-span-4 rounded-[36px] p-7 relative overflow-hidden flex flex-col"
               style={{ background: surface, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-50">one line, tonight</div>
              <PenLine className="w-4 h-4 opacity-40"/>
            </div>
            <h3 className="font-serif text-[22px] leading-tight mb-4">
              What's <em className="italic" style={{ color: accent }}>staying with you</em>?
            </h3>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
                      placeholder="a small honest thing…"
                      className="flex-1 min-h-[100px] w-full resize-none bg-transparent outline-none font-serif italic text-[15px] placeholder:opacity-30 leading-relaxed"/>
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: border }}>
              <span className="text-[10px] opacity-40">{note.length} · saved to you only</span>
              <button className="text-[10px] tracking-[0.25em] uppercase px-4 py-2 rounded-full" style={{ background: ink, color: bg }}>
                keep
              </button>
            </div>
          </div>
        </section>

        {/* ACTIVITIES + CHAT — split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14">
          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between mb-5">
              <h3 className="font-serif text-[26px] tracking-tight">Small things, today</h3>
              <span className="text-[10px] tracking-[0.25em] uppercase opacity-50">1h · 07m</span>
            </div>
            <div className="space-y-2">
              {activities.map((a, i) => (
                <div key={a.title} className="group flex items-center gap-4 py-4 px-5 rounded-2xl transition cursor-pointer hover:translate-x-1"
                     style={{ background: surface, border: `1px solid ${border}` }}>
                  <div className="font-serif italic text-[13px] opacity-40 w-6">0{i + 1}</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: surface2 }}>
                    <Mark className="w-5 h-5" opacity={0.75}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-[17px] leading-tight truncate">{a.title}</div>
                    <div className="text-[11px] italic opacity-50 mt-0.5">{a.subtitle}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-serif text-[18px] leading-none">{a.minutes}<span className="text-[10px] opacity-50 ml-1">min</span></div>
                    <div className="text-[10px] tracking-widest opacity-40 mt-1">{a.time}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-70 transition"/>
                </div>
              ))}
            </div>
          </div>

          {/* peace chat */}
          <div className="lg:col-span-5 rounded-[28px] p-6 flex flex-col"
               style={{ background: surface, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ background: surface2 }}>
                  <Mark className="w-5 h-5"/>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ background: sage, borderColor: surface }}/>
                </div>
                <div>
                  <div className="font-serif text-[16px] leading-tight">Peace</div>
                  <div className="text-[10px] italic opacity-50">a gentle listener · here now</div>
                </div>
              </div>
              <button className="text-[10px] tracking-[0.25em] uppercase opacity-50">new</button>
            </div>

            <div className="flex-1 space-y-2.5 mb-4 min-h-[140px]">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-md text-[12px] px-3.5 py-2.5" style={{ background: ink, color: bg }}>
                  I've felt tight lately. Sleep is uneven.
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-md text-[12.5px] px-3.5 py-2.5 font-serif italic" style={{ background: surface2 }}>
                  I hear you. When did the tightness first arrive?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="rounded-full px-3 py-2 flex gap-1" style={{ background: surface2 }}>
                  <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: muted }}/>
                  <span className="w-1 h-1 rounded-full animate-pulse [animation-delay:0.15s]" style={{ background: muted }}/>
                  <span className="w-1 h-1 rounded-full animate-pulse [animation-delay:0.3s]" style={{ background: muted }}/>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5" style={{ background: surface2 }}>
              <input placeholder="say something soft…" className="flex-1 bg-transparent outline-none text-[12px] placeholder:opacity-40 font-serif italic"/>
              <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ink }}>
                <Send className="w-3 h-3" style={{ color: bg }}/>
              </button>
            </div>
          </div>
        </section>

        {/* COMMUNITY */}
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h3 className="font-serif text-[26px] tracking-tight">A quiet circle</h3>
            <p className="text-[11px] opacity-50 mt-1 italic">anonymous gratitude from students, everywhere.</p>
          </div>
          <button className="text-[10px] tracking-[0.25em] uppercase opacity-60 hover:opacity-100 flex items-center gap-1">
            <Plus className="w-3 h-3"/> share
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-14">
          {posts.map((p, i) => (
            <div key={i} className="group rounded-[24px] p-5 transition cursor-pointer relative overflow-hidden hover:-translate-y-1 duration-200"
                 style={{ background: surface, border: `1px solid ${border}` }}>
              <Mark className="absolute -right-4 -top-4 w-16 h-16" opacity={0.06}/>
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] tracking-[0.25em] uppercase opacity-50">{p.name}</div>
                <span className="text-base">{p.mood}</span>
              </div>
              <p className="font-serif italic text-[15px] leading-snug mb-5 opacity-90">"{p.text}"</p>
              <div className="flex items-center justify-between">
                <button onClick={() => setLikes({ ...likes, [i]: (likes[i] ?? 0) + 1 })}
                        className="flex items-center gap-1.5 text-[11px] opacity-70 hover:opacity-100 transition" style={{ color: clay }}>
                  <Heart className={`w-3.5 h-3.5 transition ${likes[i] ? "fill-current" : ""}`} strokeWidth={1.5}/>
                  {p.likes + (likes[i] ?? 0)}
                </button>
                <span className="text-[9px] opacity-40 tracking-widest uppercase">6h ago</span>
              </div>
            </div>
          ))}
        </div>

        {/* ACHIEVEMENTS + EMERGENCY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-7 rounded-[28px] p-7" style={{ background: surface, border: `1px solid ${border}` }}>
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <h3 className="font-serif text-[22px] tracking-tight">Small milestones</h3>
                <p className="text-[11px] opacity-50 italic mt-1">seven of twenty, quietly earned.</p>
              </div>
              <Sunrise className="w-5 h-5 opacity-40" strokeWidth={1.4}/>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, i) => {
                const unlocked = i < 4;
                return (
                  <div key={i}
                       className="aspect-square rounded-2xl flex items-center justify-center transition hover:scale-110 cursor-pointer relative overflow-hidden"
                       style={{ background: unlocked ? surface2 : (dark ? "#1a1815" : "#f0e9dc"), border: `1px solid ${border}` }}>
                    <Mark className="w-6 h-6" opacity={unlocked ? 0.85 : 0.18}/>
                    {unlocked && <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 30%,#e8d5b7,transparent 70%)" }}/>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-[28px] p-7 relative overflow-hidden flex flex-col justify-between gap-4"
               style={{ background: dark ? "#2a201d" : "#efdfd5", border: `1px solid ${dark ? "#3a2a25" : "#e0c9bc"}` }}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: clay }}>
                <Mark className="w-6 h-6"/>
              </div>
              <div className="min-w-0">
                <div className="font-serif text-[18px] leading-tight">Not okay right now?</div>
                <p className="text-[12px] opacity-60 mt-1 italic leading-snug">a trained listener is one soft tap away — always, and in confidence.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition"
                      style={{ background: "#2a2724", color: "#faf6ee" }}>talk now</button>
              <button className="text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition"
                      style={{ border: `1px solid ${dark ? "#3a2a25" : "#d1b8a8"}` }}>text a friend</button>
            </div>
          </div>
        </section>

        <p className="text-center font-serif italic text-[13px] opacity-40 mt-14">
          peace begins with a single breath. — PeaceCode
        </p>
      </main>

      {/* mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-30 rounded-full backdrop-blur-xl px-2 py-2 flex items-center justify-around"
           style={{ background: dark ? "rgba(30,27,24,0.92)" : "rgba(255,251,242,0.94)", border: `1px solid ${border}`, boxShadow: "0 12px 40px -12px rgba(42,39,36,0.22)" }}>
        {nav.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} aria-label={item.label}
                    className="relative flex flex-col items-center justify-center w-12 h-11 rounded-full transition"
                    style={item.active ? { background: dark ? "#2a2724" : "#ede4d1", color: ink } : { color: muted }}>
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.5}/>
              {item.active && <span className="absolute -bottom-0.5 w-1 h-1 rounded-full" style={{ background: accent }}/>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
