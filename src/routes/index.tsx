import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Compass,
  BookOpen,
  Moon,
  Settings,
  HelpCircle,
  Bell,
  Play,
  Edit3,
  Smile,
  Clock,
  Send,
  SunMedium,
  Waves,
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

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Compass, label: "Explore" },
  { icon: BookOpen, label: "Courses" },
  { icon: Moon, label: "Sleep" },
];

const activities = [
  {
    title: "Mindful Breathing",
    subtitle: "Calming the mind",
    minutes: 42,
    time: "07 : 31 AM",
    gradient: "from-sky-300 via-blue-300 to-indigo-300",
    icon: Waves,
  },
  {
    title: "Reduce Stress",
    subtitle: "Relieve anxiety",
    minutes: 16,
    time: "06 : 14 AM",
    gradient: "from-pink-200 via-rose-300 to-orange-200",
    icon: SunMedium,
  },
];

function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef0f4] p-6 font-sans">
      <div className="mx-auto max-w-[1240px] rounded-[32px] bg-white shadow-[0_20px_60px_-20px_rgba(30,41,59,0.15)] overflow-hidden">
        <div className="grid grid-cols-[240px_1fr_340px] min-h-[820px]">
          {/* SIDEBAR */}
          <aside className="flex flex-col p-6 border-r border-slate-100">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-sm font-bold">
                <span className="italic">S</span>
              </div>
              <span className="text-lg font-semibold text-slate-800">MindEase</span>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition ${
                      item.active
                        ? "bg-sky-400 text-white shadow-[0_8px_20px_-6px_rgba(56,189,248,0.6)]"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Profile card */}
            <div className="mt-8 rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(30,41,59,0.15)] border border-slate-100 p-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://i.pravatar.cc/80?img=47"
                  alt="avatar"
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="text-xs">
                  <div className="text-slate-400">Good morning!</div>
                  <div className="font-semibold text-slate-800 text-sm">Keysafani</div>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-slate-800">04</span>
                <span className="text-xs text-slate-400">Your Level</span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full">
                <div className="absolute inset-y-0 left-0 w-[75%] bg-sky-400 rounded-full" />
                <div className="absolute -top-1 left-[70%] bg-sky-400 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  75%
                </div>
              </div>
            </div>

            {/* Bottom nav */}
            <div className="mt-auto flex flex-col gap-2 pt-8">
              <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 rounded-full">
                <Settings className="w-5 h-5" /> Settings
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 rounded-full">
                <HelpCircle className="w-5 h-5" /> Help
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 rounded-full"
              >
                <span className="flex items-center gap-3">
                  <Moon className="w-5 h-5" /> Dark mode
                </span>
                <span
                  className={`w-8 h-4 rounded-full relative transition ${
                    darkMode ? "bg-sky-400" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition ${
                      darkMode ? "left-4" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>
          </aside>

          {/* MAIN */}
          <main className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Your Daily Statistics
                </h1>
                <p className="text-sm text-slate-400 mt-1">Lorem ipsum dolor sit amet</p>
              </div>
              <button className="relative w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full" />
              </button>
            </div>

            {/* Days */}
            <div className="flex items-center gap-3 mb-8">
              {days.map((day) => (
                <button
                  key={day.n}
                  className={`flex flex-col items-center justify-center w-14 h-16 rounded-full text-sm transition ${
                    day.active
                      ? "bg-pink-400 text-white shadow-[0_10px_20px_-8px_rgba(244,114,182,0.6)]"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className={`font-semibold ${day.active ? "" : "text-slate-700"}`}>
                    {day.n}
                  </span>
                  <span className="text-[10px] opacity-80">{day.d}</span>
                </button>
              ))}
            </div>

            {/* Mood card */}
            <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(30,41,59,0.12)] p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Your Mood</h3>
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center text-3xl">
                  😄
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-800">90%</span>
                  </div>
                  <p className="text-sm text-slate-400">you are happy!</p>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-slate-500">Happy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-300" />
                    <span className="text-slate-500">Angry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-300" />
                    <span className="text-slate-500">Sad</span>
                  </div>
                </div>
              </div>
              {/* Bars */}
              <div className="flex gap-1 mb-6">
                <div className="h-2 bg-blue-400 rounded-full" style={{ width: "70%" }} />
                <div className="h-2 bg-red-300 rounded-full" style={{ width: "15%" }} />
                <div className="h-2 bg-pink-300 rounded-full" style={{ width: "15%" }} />
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-2xl font-bold text-slate-800">87m</div>
                  <div className="text-xs text-slate-400 mt-1">Meditation Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">23</div>
                  <div className="text-xs text-slate-400 mt-1">Number Sessions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">34m</div>
                  <div className="text-xs text-slate-400 mt-1">Average Duration</div>
                </div>
              </div>
            </div>

            {/* Today's Activities */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Today's Activities</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                1 h 23 minutes
              </div>
            </div>
            <div className="space-y-3">
              {activities.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.title}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition"
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 text-sm">{a.title}</div>
                      <div className="text-xs text-slate-400">{a.subtitle}</div>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-slate-800">{a.minutes}</span>
                      <span className="text-slate-400 ml-1">minutes</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 w-20 text-right">
                      {a.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* RIGHT PANEL */}
          <aside className="p-6 border-l border-slate-100 bg-slate-50/30">
            {/* Meditation & Exercise */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">Meditation & Exercise</h3>
              <button className="text-xs text-slate-400 flex items-center gap-1 hover:text-slate-600">
                See All <span>›</span>
              </button>
            </div>
            <div className="relative rounded-2xl overflow-hidden mb-6 h-44 bg-gradient-to-br from-yellow-200 to-orange-300">
              <img
                src={meditationImg}
                alt="Meditation"
                className="absolute right-0 top-0 h-full w-2/3 object-cover object-center mix-blend-multiply opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-300/70 via-orange-200/40 to-transparent" />
              <div className="relative p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="text-white font-bold text-lg leading-tight drop-shadow">
                    Meditation &<br />Exercise
                  </div>
                  <div className="text-xs text-white/90 mt-1">24 Minutes</div>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 text-slate-700 fill-slate-700 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Chat */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <Smile className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="font-semibold text-sm text-slate-800 leading-tight">
                    First Steps Towards<br />Peace
                  </div>
                </div>
                <button className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-sky-300/70 text-slate-800 text-xs p-3">
                    Hi, I've been feeling anxious lately, having trouble focusing on work and not sleeping well.
                    <div className="text-[10px] text-slate-600 mt-1 text-right">09 : 12 AM</div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-50 text-slate-700 text-xs p-3">
                    I understand this can't be easy. When did you first start feeling anxious like this?
                    <div className="text-[10px] text-slate-400 mt-1 text-right">09 : 12 AM</div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-slate-50 px-3 py-2 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 rounded-full p-1.5 pl-3">
                <Smile className="w-4 h-4 text-slate-400" />
                <input
                  placeholder="Write a message"
                  className="flex-1 bg-transparent outline-none text-xs text-slate-700 placeholder:text-slate-400"
                />
                <button className="w-8 h-8 rounded-full bg-sky-400 flex items-center justify-center shadow">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
