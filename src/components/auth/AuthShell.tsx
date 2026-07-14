import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles } from "lucide-react";
import logo from "@/assets/peacecode-logo.png";

/**
 * AuthShell — creative split canvas.
 * LEFT: a living panel of Peace Code — two vertical marquee columns flowing in
 * opposite directions with features, quotes, rituals, whispers. Warm grainy
 * pastel (sakura/cream) background with heavy film grain, painterly washes,
 * and a hand-drawn horizon arc. No stock illustrations, no AI slop.
 * RIGHT: a quiet glass card that holds the form.
 */

const LEFT_TRACK_A = [
  { k: "ritual", t: "Box breathing · 4·4·4·4" },
  { k: "feature", t: "Peace Bot — a companion that remembers" },
  { k: "quote", t: '"You are allowed to move slowly."' },
  { k: "feature", t: "Anonymous circles & live rooms" },
  { k: "ritual", t: "One line, tonight — a gentle journal" },
  { k: "feature", t: "Counselling with verified psychologists" },
  { k: "quote", t: '"Rest is also progress."' },
  { k: "feature", t: "Mind Gym — small reps for a calmer mind" },
  { k: "ritual", t: "Karma Garden — plant a gratitude" },
  { k: "feature", t: "Screenings that read between the lines" },
];

const LEFT_TRACK_B = [
  { k: "whisper", t: "breathe" },
  { k: "feature", t: "Peace Buddies — peers who get it" },
  { k: "whisper", t: "return" },
  { k: "feature", t: "Focus dial with soundscapes" },
  { k: "quote", t: '"Small, quiet, on time."' },
  { k: "feature", t: "Emergency SOS — always within reach" },
  { k: "whisper", t: "soften" },
  { k: "feature", t: "Resources in हिन्दी & English" },
  { k: "quote", t: '"You are not behind. You are becoming."' },
  { k: "whisper", t: "arrive" },
];

function Chip({ k, t }: { k: string; t: string }) {
  const isQuote = k === "quote";
  const isWhisper = k === "whisper";
  return (
    <div
      className="rounded-2xl px-4 py-3 backdrop-blur-md"
      style={{
        background: isWhisper
          ? "rgba(255,255,255,0.35)"
          : "rgba(255,255,255,0.62)",
        border: "1px solid rgba(255,255,255,0.85)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 12px 28px -22px rgba(120,60,80,0.35)",
      }}
    >
      {isQuote ? (
        <div
          className="italic leading-snug text-[15px]"
          style={{ fontFamily: "'Fraunces', serif", color: "#4a2a3a" }}
        >
          {t}
        </div>
      ) : isWhisper ? (
        <div
          className="tracking-[0.42em] uppercase text-[11px] text-center"
          style={{ color: "#7a4a5c" }}
        >
          {t}
        </div>
      ) : (
        <div className="flex items-start gap-2.5">
          <span
            className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "#c46b86" }}
          />
          <div className="text-[13.5px] leading-snug" style={{ color: "#3a2230", fontWeight: 500 }}>
            {t}
          </div>
        </div>
      )}
    </div>
  );
}

function MarqueeColumn({
  items,
  direction = "up",
  duration = 60,
  offset = 0,
}: {
  items: { k: string; t: string }[];
  direction?: "up" | "down";
  duration?: number;
  offset?: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="flex flex-col gap-3"
        style={{
          animation: `pc-marquee-${direction} ${duration}s linear infinite`,
          animationDelay: `-${offset}s`,
        }}
      >
        {doubled.map((it, i) => (
          <Chip key={i} k={it.k} t={it.t} />
        ))}
      </div>
      {/* fade masks */}
      <div className="absolute inset-x-0 top-0 h-24 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(250,236,238,1), rgba(250,236,238,0))" }} />
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background: "linear-gradient(0deg, rgba(250,236,238,1), rgba(250,236,238,0))" }} />
    </div>
  );
}

export function AuthShell({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  children,
  step,
  totalSteps,
  stepLabel,
}: {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  children: ReactNode;
  step?: number;
  totalSteps?: number;
  stepLabel?: string;
}) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Keyframes for the flowing tracks */}
      <style>{`
        @keyframes pc-marquee-up   { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes pc-marquee-down { from { transform: translateY(-50%); } to { transform: translateY(0); } }
        @keyframes pc-float-slow   { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
      `}</style>

      {/* Sakura-cream grainy base */}
      <div
        className="absolute inset-0 -z-40"
        aria-hidden
        style={{
          background:
            "linear-gradient(160deg, #fbe9ec 0%, #f6e2d8 38%, #f4e7db 62%, #efe1e6 100%)",
        }}
      />
      {/* Painterly washes */}
      <div
        className="absolute inset-0 -z-30 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: [
            "radial-gradient(55% 42% at 8% 12%, rgba(255,255,255,0.75), transparent 65%)",
            "radial-gradient(48% 38% at 92% 88%, rgba(255,235,220,0.7), transparent 70%)",
            "radial-gradient(40% 34% at 78% 8%, rgba(240,190,205,0.55), transparent 70%)",
            "radial-gradient(42% 36% at 18% 88%, rgba(230,205,215,0.6), transparent 72%)",
          ].join(","),
        }}
      />
      {/* Hand-drawn horizon arcs */}
      <svg
        className="absolute -bottom-24 -left-20 -z-20 opacity-[0.14] pointer-events-none"
        width="900"
        height="900"
        viewBox="0 0 900 900"
        aria-hidden
      >
        {[220, 300, 400, 520, 660, 820].map((r, i) => (
          <circle
            key={i}
            cx="200"
            cy="700"
            r={r}
            fill="none"
            stroke="#8a3a52"
            strokeWidth="1"
            strokeDasharray={i % 2 ? "2 6" : "0"}
          />
        ))}
      </svg>
      {/* Floating petal specks */}
      <svg className="absolute inset-0 -z-10 w-full h-full pointer-events-none opacity-70" aria-hidden>
        {Array.from({ length: 24 }).map((_, i) => {
          const x = (i * 73) % 100;
          const y = (i * 131) % 100;
          const r = 1 + ((i * 7) % 3);
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill={i % 3 === 0 ? "#e0a5b6" : i % 3 === 1 ? "#d6b39a" : "#c98aa2"}
              opacity={0.35}
            />
          );
        })}
      </svg>
      {/* Heavy film grain */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none mix-blend-multiply"
        aria-hidden
        style={{
          opacity: 0.28,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.35' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.35 0 0 0 0 0.42 0 0 0 0.9 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Content grid */}
      <div className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1fr_minmax(420px,520px)] gap-6 lg:gap-10 px-5 sm:px-8 lg:px-12 py-6 lg:py-10">
        {/* LEFT — living panel */}
        <div className="relative flex flex-col min-h-[560px] lg:min-h-0">
          {/* Brand chip */}
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <span
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 8px 18px -10px rgba(122,74,92,0.35)",
                }}
              >
                <img src={logo} alt="" className="w-6 h-6 object-contain" />
              </span>
              <div className="leading-tight">
                <div
                  className="text-[15px] tracking-tight"
                  style={{ fontFamily: "'Fraunces', serif", color: "#3a2230", fontWeight: 600 }}
                >
                  Peace Code
                </div>
                <div className="text-[10.5px] tracking-[0.28em] uppercase" style={{ color: "#7a4a5c" }}>
                  a quiet doorway
                </div>
              </div>
            </Link>

            <div
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px]"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(255,255,255,0.9)",
                color: "#7a4a5c",
              }}
            >
              <Sparkles className="w-3 h-3" strokeWidth={1.6} />
              <span className="tracking-[0.22em] uppercase">for students · India</span>
            </div>
          </div>

          {/* Editorial headline — smaller, humbler, so the flow feels bigger */}
          <div className="mt-8 max-w-xl">
            {eyebrow && (
              <div className="text-[10.5px] tracking-[0.4em] uppercase mb-4" style={{ color: "#7a4a5c" }}>
                {eyebrow}
              </div>
            )}
            <h1
              className="leading-[0.98] tracking-[-0.02em]"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(2.6rem, 5.2vw, 4.4rem)",
                color: "#3a2230",
                fontWeight: 600,
              }}
            >
              {title}{" "}
              {titleAccent && (
                <em className="italic" style={{ fontWeight: 500, color: "#8a3a52" }}>
                  {titleAccent}
                </em>
              )}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-[1.6]" style={{ color: "#5a3a48" }}>
              {subtitle}
            </p>
          </div>

          {/* Twin marquee columns */}
          <div
            className="relative mt-8 flex-1 min-h-[320px] grid grid-cols-2 gap-3 pr-2"
            style={{
              // give the columns a bounded height so the animation loops smoothly
              maxHeight: "clamp(360px, 55vh, 620px)",
            }}
            aria-hidden
          >
            <MarqueeColumn items={LEFT_TRACK_A} direction="up" duration={55} offset={0} />
            <MarqueeColumn items={LEFT_TRACK_B} direction="down" duration={70} offset={12} />
          </div>

          {/* Trust pill */}
          <div
            className="mt-6 inline-flex items-center gap-3 self-start px-4 py-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.9)",
            }}
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.85)", color: "#8a3a52" }}
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={1.7} />
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold" style={{ color: "#3a2230" }}>
                Private. Secure. Always.
              </div>
              <div className="text-[11.5px]" style={{ color: "#7a4a5c" }}>
                Your college email, encrypted end to end.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — glass card */}
        <div className="flex items-stretch">
          <div
            className="relative w-full rounded-[28px] overflow-hidden self-center"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(250,232,236,0.5) 100%)",
              backdropFilter: "blur(28px) saturate(140%)",
              WebkitBackdropFilter: "blur(28px) saturate(140%)",
              border: "1px solid rgba(255,255,255,0.85)",
              boxShadow:
                "0 30px 80px -30px rgba(122,74,92,0.28), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-24 pointer-events-none"
              aria-hidden
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.55), transparent)" }}
            />
            <div className="relative px-7 sm:px-10 py-9 sm:py-11 flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3">
                <span
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid white",
                    boxShadow: "0 8px 22px -10px rgba(122,74,92,0.4)",
                  }}
                >
                  <img src={logo} alt="Peace Code" className="w-8 h-8 object-contain" />
                </span>
                <h2
                  className="text-center"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.65rem",
                    color: "#3a2230",
                    fontWeight: 500,
                  }}
                >
                  {step && totalSteps ? title : "Welcome to Peace Code"}
                </h2>
                <p
                  className="text-center text-[13.5px] leading-relaxed max-w-[300px]"
                  style={{ color: "#7a4a5c" }}
                >
                  {step && totalSteps
                    ? subtitle
                    : "Let's begin your journey towards peace of mind."}
                </p>
              </div>

              {step && totalSteps && (
                <div>
                  <div
                    className="flex items-center justify-between text-[11px] tracking-[0.15em] uppercase mb-2"
                    style={{ color: "#3a2230" }}
                  >
                    <span className="font-semibold">
                      Step {step} of {totalSteps}
                    </span>
                    <span style={{ color: "#7a4a5c" }}>{stepLabel}</span>
                  </div>
                  <div
                    className="h-[3px] rounded-full overflow-hidden"
                    style={{ background: "rgba(138,58,82,0.15)" }}
                  >
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{
                        width: `${(step / totalSteps) * 100}%`,
                        background: "linear-gradient(90deg, #c46b86, #8a3a52)",
                      }}
                    />
                  </div>
                </div>
              )}

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared UI primitives — kept API-compatible with existing routes.
export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <div className="text-[13px] font-semibold" style={{ color: "#3a2230" }}>
        {children}
      </div>
      {hint && (
        <div className="text-[11.5px] mt-0.5" style={{ color: "#7a4a5c" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export function GlassInput({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return (
    <label
      className="flex items-center gap-3 rounded-2xl px-4 h-[52px] transition focus-within:ring-2"
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.9)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      {icon && (
        <span className="shrink-0" style={{ color: "#8a3a52" }}>
          {icon}
        </span>
      )}
      <input
        {...props}
        className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#b98aa0]"
        style={{ color: "#3a2230" }}
      />
    </label>
  );
}

export function GlassSelect({
  icon,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { icon?: ReactNode }) {
  return (
    <label
      className="flex items-center gap-3 rounded-2xl px-4 h-[52px]"
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.9)",
      }}
    >
      {icon && (
        <span className="shrink-0" style={{ color: "#8a3a52" }}>
          {icon}
        </span>
      )}
      <select
        {...props}
        className="flex-1 bg-transparent outline-none text-[14px] appearance-none"
        style={{ color: "#3a2230" }}
      >
        {children}
      </select>
    </label>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full h-[52px] rounded-2xl text-[14.5px] font-medium transition disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-105 active:scale-[0.99]"
      style={{
        background: "linear-gradient(180deg, #c46b86 0%, #8a3a52 100%)",
        color: "white",
        boxShadow:
          "0 10px 24px -12px rgba(138,58,82,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      {children}
    </button>
  );
}

export function GhostRow({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(255,255,255,0.85)",
      }}
    >
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.85)", color: "#8a3a52" }}
      >
        {icon}
      </span>
      <div className="leading-tight">
        <div className="text-[13.5px] font-semibold" style={{ color: "#3a2230" }}>
          {title}
        </div>
        <div className="text-[11.5px]" style={{ color: "#7a4a5c" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}
