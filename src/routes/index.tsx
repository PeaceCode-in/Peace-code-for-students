import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Home,
  Compass,
  BookOpen,
  Moon,
  Settings,
  HelpCircle,
  Bell,
  Play,
  Pause,
  Edit3,
  Smile,
  Clock,
  Send,
  SunMedium,
  Waves,
  Sparkles,
  Heart,
  Flame,
  Trophy,
  Users,
  Feather,
  Wind,
  Headphones,
  BookHeart,
  Target,
  TrendingUp,
  Search,
  Plus,
  ChevronRight,
  Leaf,
  ShieldAlert,
  Music,
  Brain,
} from "lucide-react";
import meditationImg from "@/assets/meditation.jpg";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const days = [
  { n: 7, d: "Mon" },
  { n: 8, d: "Tue" },
  { n: 9, d: "Wed", active: true },
  { n: 10, d: "Thu" },
  { n: 11, d: "Fri" },
  { n: 12, d: "Sat" },
  { n: 13, d: "Sun" },
];

const navMain = [
  { icon: Home, label: "Home", active: true },
  { icon: Compass, label: "Explore" },
  { icon: BookOpen, label: "Courses" },
  { icon: Moon, label: "Sleep" },
  { icon: Users, label: "Community" },
  { icon: BookHeart, label: "Journal" },
  { icon: Trophy, label: "Achievements" },
];

const activities = [
  {
    title: "Mindful Breathing",
    subtitle: "Calming the mind",
    minutes: 42,
    time: "07:31 AM",
    gradient: "from-sky-300 via-blue-300 to-indigo-300",
    icon: Waves,
  },
  {
    title: "Reduce Stress",
    subtitle: "Relieve anxiety",
    minutes: 16,
    time: "06:14 AM",
    gradient: "from-pink-200 via-rose-300 to-orange-200",
    icon: SunMedium,
  },
  {
    title: "Deep Focus Session",
    subtitle: "Pomodoro flow",
    minutes: 25,
    time: "05:45 AM",
    gradient: "from-violet-300 via-purple-300 to-fuchsia-300",
    icon: Target,
  },
];

const focusTools = [
  { label: "Breathe", icon: Wind, color: "from-sky-200 to-blue-300", accent: "text-sky-700" },
  { label: "Sounds", icon: Music, color: "from-emerald-200 to-teal-300", accent: "text-emerald-700" },
  { label: "Timer", icon: Clock, color: "from-amber-200 to-orange-300", accent: "text-orange-700" },
  { label: "Journal", icon: Feather, color: "from-rose-200 to-pink-300", accent: "text-rose-700" },
];

const journey = [
  { day: 1, label: "Seed", done: true },
  { day: 7, label: "Sprout", done: true },
  { day: 14, label: "Bloom", done: true, current: true },
  { day: 21, label: "Grow", done: false },
  { day: 30, label: "Flourish", done: false },
];

const communityPosts = [
  { name: "Anon Fox", text: "Grateful for a professor who noticed I was struggling today.", likes: 24, emoji: "🦊" },
  { name: "Anon Deer", text: "Finished a week of morning meditation. Feeling clearer than ever.", likes: 41, emoji: "🦌" },
  { name: "Anon Owl", text: "Small win: I called my mom instead of doom-scrolling.", likes: 58, emoji: "🦉" },
];

function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState(9);
  const [breathing, setBreathing] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [likes, setLikes] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className={`min-h-screen w-full ${darkMode ? "dark bg-slate-950" : "bg-[#eef0f4]"} font-sans transition-colors`}>
      <div className="grid grid-cols-[240px_1fr_360px] h-screen">
        {/* ============ SIDEBAR ============ */}
        <aside className="flex flex-col p-6 border-r border-slate-200/70 bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-[0_8px_20px_-6px_rgba(56,189,248,0.6)]">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">PeaceCode</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Student Wellness</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5 overflow-y-auto">
            {navMain.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`group flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    item.active
                      ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-[0_8px_20px_-6px_rgba(56,189,248,0.6)] scale-[1.02]"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Profile / streak */}
          <div className="mt-6 rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(30,41,59,0.15)] border border-slate-100 p-4 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://i.pravatar.cc/80?img=47"
                alt="avatar"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-200"
              />
              <div className="text-xs flex-1">
                <div className="text-slate-400">Good morning!</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Keysafani</div>
              </div>
              <div className="flex items-center gap-1 bg-orange-50 text-orange-500 px-2 py-1 rounded-full text-[11px] font-semibold">
                <Flame className="w-3 h-3" /> 12
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">04</span>
              <span className="text-xs text-slate-400">Your Level</span>
            </div>
            <div className="relative h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
              <div className="absolute inset-y-0 left-0 w-[75%] bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full" />
              <div className="absolute -top-1 left-[70%] bg-sky-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">
                75%
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-1 pt-6">
            <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800">
              <Settings className="w-4.5 h-4.5" /> Settings
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800">
              <HelpCircle className="w-4.5 h-4.5" /> Help
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-3">
                <Moon className="w-4.5 h-4.5" /> Dark mode
              </span>
              <span className={`w-9 h-5 rounded-full relative transition ${darkMode ? "bg-sky-400" : "bg-slate-200"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${darkMode ? "left-[18px]" : "left-0.5"}`} />
              </span>
            </button>
          </div>
        </aside>

        {/* ============ MAIN ============ */}
        <main className="p-8 overflow-y-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-600 font-semibold">Wednesday · July 11</span>
                <span className="text-xs text-slate-400">Peace Score 82</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Your Daily Statistics
              </h1>
              <p className="text-sm text-slate-400 mt-1">A gentle look at how your mind and time are flowing today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm border border-slate-100 dark:border-slate-700">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  placeholder="Search wellness…"
                  className="bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 w-40 placeholder:text-slate-400"
                />
              </div>
              <button className="relative w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center hover:scale-105 transition">
                <Bell className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
              </button>
            </div>
          </div>

          {/* Days */}
          <div className="flex items-center gap-3 mb-8">
            {days.map((day) => {
              const active = selectedDay === day.n;
              return (
                <button
                  key={day.n}
                  onClick={() => setSelectedDay(day.n)}
                  className={`flex flex-col items-center justify-center w-14 h-16 rounded-full text-sm transition-all ${
                    active
                      ? "bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-[0_10px_20px_-8px_rgba(244,114,182,0.7)] scale-110"
                      : "bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm"
                  }`}
                >
                  <span className={`font-semibold ${active ? "" : "text-slate-700 dark:text-slate-200"}`}>{day.n}</span>
                  <span className="text-[10px] opacity-80">{day.d}</span>
                </button>
              );
            })}
          </div>

          {/* Mood card */}
          <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_10px_40px_-15px_rgba(30,41,59,0.12)] p-6 mb-6 hover:shadow-[0_20px_50px_-15px_rgba(30,41,59,0.2)] transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Your Mood</h3>
              <button className="text-xs text-sky-500 hover:underline">Log mood</button>
            </div>
            <div className="flex items-center gap-6 mb-4">
              <button className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center text-3xl hover:scale-110 transition shadow-lg shadow-orange-200">
                😄
              </button>
              <div className="flex-1">
                <div className="text-4xl font-bold text-slate-800 dark:text-slate-100">90%</div>
                <p className="text-sm text-slate-400">you are happy!</p>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { c: "bg-blue-400", l: "Happy" },
                  { c: "bg-red-300", l: "Angry" },
                  { c: "bg-pink-300", l: "Sad" },
                ].map((m) => (
                  <div key={m.l} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${m.c}`} />
                    <span className="text-slate-500 dark:text-slate-400">{m.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-1 mb-6 h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <div className="bg-blue-400 transition-all" style={{ width: "70%" }} />
              <div className="bg-red-300" style={{ width: "15%" }} />
              <div className="bg-pink-300" style={{ width: "15%" }} />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              {[
                { v: "87m", l: "Meditation Time", icon: Brain },
                { v: "23", l: "Number Sessions", icon: Sparkles },
                { v: "34m", l: "Average Duration", icon: Clock },
              ].map((s) => {
                const I = s.icon;
                return (
                  <div key={s.l} className="group cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <I className="w-3.5 h-3.5 text-sky-400 group-hover:scale-125 transition" />
                      <span className="text-xs text-slate-400">{s.l}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{s.v}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Focus Tools grid */}
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Focus Tools</h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {focusTools.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.label}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${t.color} p-4 aspect-square flex flex-col justify-between text-left hover:scale-[1.03] transition shadow-md`}
                >
                  <Icon className={`w-6 h-6 ${t.accent}`} />
                  <div>
                    <div className={`text-lg font-bold ${t.accent}`}>{t.label}</div>
                    <div className="text-[11px] text-slate-700/70">Tap to start</div>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/30 group-hover:scale-125 transition" />
                </button>
              );
            })}
          </div>

          {/* Wellness Journey */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-slate-800 dark:to-slate-800 border border-slate-100 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Wellness Journey</h3>
                <p className="text-xs text-slate-400">You're 14 days in — halfway to Flourish.</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="relative flex items-center justify-between">
              <div className="absolute left-4 right-4 top-4 h-0.5 bg-slate-200 dark:bg-slate-700" />
              <div className="absolute left-4 top-4 h-0.5 bg-gradient-to-r from-emerald-400 to-sky-400" style={{ width: "48%" }} />
              {journey.map((m) => (
                <div key={m.day} className="relative flex flex-col items-center gap-2 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition ${
                      m.current
                        ? "bg-gradient-to-br from-emerald-400 to-sky-500 text-white scale-125 shadow-lg shadow-emerald-200"
                        : m.done
                          ? "bg-emerald-400 text-white"
                          : "bg-white dark:bg-slate-700 text-slate-400 border border-slate-200 dark:border-slate-600"
                    }`}
                  >
                    {m.day}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Activities */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Today's Activities</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              1h 23m total
            </div>
          </div>
          <div className="space-y-2 mb-8">
            {activities.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.title}
                  className="group flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white shadow group-hover:scale-110 transition`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{a.title}</div>
                    <div className="text-xs text-slate-400">{a.subtitle}</div>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{a.minutes}</span>
                    <span className="text-slate-400 ml-1">min</span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 w-20 text-right">{a.time}</div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition" />
                </div>
              );
            })}
          </div>

          {/* Community Feed */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Anonymous Gratitude Feed</h3>
            <button className="text-xs text-sky-500 hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Share
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {communityPosts.map((p, i) => (
              <div
                key={i}
                className="group rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 hover:-translate-y-1 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-sm">
                    {p.emoji}
                  </div>
                  <span className="text-xs font-medium text-slate-500">{p.name}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">"{p.text}"</p>
                <button
                  onClick={() => setLikes({ ...likes, [i]: (likes[i] ?? 0) + 1 })}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-500"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-100 group-hover:fill-rose-400 transition" />
                  {p.likes + (likes[i] ?? 0)}
                </button>
              </div>
            ))}
          </div>

          {/* Emergency footer */}
          <div className="rounded-3xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/40 border border-rose-100 dark:border-rose-900/40 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-rose-400 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Not okay right now?</div>
              <div className="text-xs text-slate-500">A trained listener is one tap away — 24/7 and confidential.</div>
            </div>
            <button className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition">
              Talk now
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 italic mt-8 mb-2">
            "Peace begins with a single breath." — PeaceCode
          </p>
        </main>

        {/* ============ RIGHT PANEL ============ */}
        <aside className="p-6 border-l border-slate-200/70 bg-white/40 dark:bg-slate-900/40 dark:border-slate-800 backdrop-blur-xl overflow-y-auto">
          {/* Meditation featured */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Meditation & Exercise</h3>
            <button className="text-xs text-slate-400 flex items-center gap-1 hover:text-slate-600">See All ›</button>
          </div>
          <div className="group relative rounded-2xl overflow-hidden mb-6 h-48 bg-gradient-to-br from-yellow-200 to-orange-300 hover:shadow-xl transition cursor-pointer">
            <img
              src={meditationImg}
              alt="Meditation"
              className="absolute right-0 top-0 h-full w-2/3 object-cover object-center mix-blend-multiply opacity-90 group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/80 via-orange-200/40 to-transparent" />
            <div className="relative p-5 h-full flex flex-col justify-between">
              <div>
                <div className="text-white font-bold text-xl leading-tight drop-shadow">
                  Meditation &<br />Exercise
                </div>
                <div className="text-xs text-white/95 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> 24 Minutes
                </div>
              </div>
              <button className="w-11 h-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg hover:scale-110 transition">
                <Play className="w-4 h-4 text-slate-700 fill-slate-700 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Breathing Orb */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-slate-800 dark:to-slate-800 border border-slate-100 dark:border-slate-700 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Box Breathing</div>
                <div className="text-[11px] text-slate-400">4-4-4-4 cycle</div>
              </div>
              <button
                onClick={() => setBreathing(!breathing)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-sky-500 text-white hover:bg-sky-600"
              >
                {breathing ? "Stop" : "Start"}
              </button>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br from-sky-300 to-indigo-400 opacity-70 ${breathing ? "animate-[pulse_4s_ease-in-out_infinite]" : ""}`}
                  style={breathing ? { animation: "breathe-orb 8s ease-in-out infinite" } : {}}
                />
                <div className="relative text-white text-xs font-semibold tracking-widest">
                  {breathing ? "BREATHE" : "TAP START"}
                </div>
              </div>
            </div>
            <style>{`@keyframes breathe-orb { 0%,100% { transform: scale(0.85); } 50% { transform: scale(1.1); } }`}</style>
          </div>

          {/* Focus Timer */}
          <div className="rounded-2xl bg-slate-900 dark:bg-slate-800 text-white p-5 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.6),transparent_60%)]" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold">Focus Timer</div>
                  <div className="text-[11px] text-slate-400">Pomodoro · deep work</div>
                </div>
                <Target className="w-4 h-4 text-sky-300" />
              </div>
              <div className="text-5xl font-bold font-mono tracking-tight mb-4 text-center">
                {mm}:{ss}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRunning(!running)}
                  className="flex-1 bg-sky-500 hover:bg-sky-400 rounded-full py-2 text-sm font-semibold flex items-center justify-center gap-1.5"
                >
                  {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {running ? "Pause" : "Start"}
                </button>
                <button
                  onClick={() => {
                    setRunning(false);
                    setSeconds(25 * 60);
                  }}
                  className="px-4 bg-slate-800 hover:bg-slate-700 rounded-full text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 leading-tight">Peace AI</div>
                  <div className="text-[10px] text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> online
                  </div>
                </div>
              </div>
              <button className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-sky-400 text-white text-xs p-3 shadow">
                  Hi, I've been feeling anxious lately, having trouble focusing and not sleeping well.
                  <div className="text-[10px] text-white/70 mt-1 text-right">09:12 AM</div>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs p-3">
                  I hear you. When did you first start feeling anxious like this?
                  <div className="text-[10px] text-slate-400 mt-1 text-right">09:12 AM</div>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-700 px-3 py-2 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.3s]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-full p-1.5 pl-3">
              <Smile className="w-4 h-4 text-slate-400" />
              <input
                placeholder="Write a message"
                className="flex-1 bg-transparent outline-none text-xs text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
              />
              <button className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center shadow transition">
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Achievements</span>
              </div>
              <span className="text-[11px] text-slate-400">7 / 20</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { e: "🌱", u: true },
                { e: "🌸", u: true },
                { e: "🧘", u: true },
                { e: "🔥", u: true },
                { e: "🌙", u: false },
                { e: "⭐", u: false },
                { e: "🏆", u: false },
                { e: "💎", u: false },
              ].map((a, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xl transition hover:scale-110 ${
                    a.u ? "bg-gradient-to-br from-amber-100 to-orange-200" : "bg-slate-100 dark:bg-slate-700 grayscale opacity-40"
                  }`}
                >
                  {a.e}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400 justify-center">
            <Headphones className="w-3 h-3" />
            <span>Now playing · Forest Rain · 32%</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
