import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import logo from "@/assets/peacecode-logo.png";

/**
 * Full-bleed auth canvas — sky-gradient with soft orbs and film grain,
 * glass card on the right, editorial hero on the left.
 * Uses theme tokens where possible so it adapts to the active PeaceCode theme.
 */
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
    <div className="relative min-h-screen w-full overflow-hidden font-sans" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Sky gradient base — layered radial washes for depth */}
      <div className="absolute inset-0 -z-30" aria-hidden style={{
        background: "linear-gradient(180deg, #cfe4f7 0%, #e6f0fa 45%, #f5f7fb 100%)",
      }} />
      {/* Painterly cloud/orb washes */}
      <div className="absolute inset-0 -z-20 pointer-events-none" aria-hidden style={{
        backgroundImage: [
          "radial-gradient(60% 45% at 12% 18%, rgba(255,255,255,0.85), transparent 60%)",
          "radial-gradient(45% 40% at 88% 78%, rgba(255,255,255,0.75), transparent 65%)",
          "radial-gradient(38% 35% at 72% 12%, rgba(180,210,240,0.55), transparent 70%)",
          "radial-gradient(50% 40% at 22% 82%, rgba(196,214,236,0.6), transparent 70%)",
        ].join(","),
      }} />
      {/* Concentric horizon arcs (subtle) */}
      <svg className="absolute inset-0 -z-10 w-full h-full opacity-[0.18] pointer-events-none" aria-hidden preserveAspectRatio="none" viewBox="0 0 1440 900">
        <defs>
          <linearGradient id="arc" x1="0" x2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0" /><stop offset="0.5" stopColor="#ffffff" stopOpacity="0.9" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></linearGradient>
        </defs>
        {[420, 520, 640, 780, 940].map((r, i) => (
          <ellipse key={i} cx="360" cy="1050" rx={r * 1.6} ry={r} fill="none" stroke="url(#arc)" strokeWidth="1" />
        ))}
      </svg>
      {/* Film grain */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.08] mix-blend-overlay" aria-hidden style={{
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      }} />

      {/* Content grid */}
      <div className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.1fr_minmax(420px,520px)] gap-8 px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
        {/* LEFT — editorial */}
        <div className="flex flex-col justify-between max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-2.5 self-start group">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/60 backdrop-blur-md border border-white/70 shadow-[0_2px_10px_rgba(30,55,110,0.08)]">
              <img src={logo} alt="" className="w-6 h-6 object-contain" />
            </span>
            <span className="text-[15px] tracking-tight" style={{ fontFamily: "'Fraunces', serif", color: "#0f2540", fontWeight: 500 }}>Peace Code</span>
          </Link>

          <div className="py-10 lg:py-0">
            {eyebrow && (
              <div className="text-[10.5px] tracking-[0.35em] uppercase mb-6" style={{ color: "#3a5a86" }}>{eyebrow}</div>
            )}
            <h1 className="leading-[0.98] tracking-[-0.02em]" style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              color: "#0d2547",
              fontWeight: 600,
            }}>
              {title}{" "}
              {titleAccent && <em className="italic" style={{ fontWeight: 500, color: "#1c4f8a" }}>{titleAccent}</em>}
            </h1>
            <p className="mt-6 max-w-md text-[16px] leading-[1.6]" style={{ color: "#2b4368" }}>
              {subtitle}
            </p>
          </div>

          <div className="inline-flex items-center gap-3 self-start px-4 py-3 rounded-2xl bg-white/45 backdrop-blur-md border border-white/70">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/70" style={{ color: "#1c4f8a" }}>
              <ShieldCheck className="w-4 h-4" strokeWidth={1.6} />
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold" style={{ color: "#0d2547" }}>Private. Secure. Always.</div>
              <div className="text-[11.5px]" style={{ color: "#3a5a86" }}>Your data stays with you.</div>
            </div>
          </div>
        </div>

        {/* RIGHT — glass card */}
        <div className="flex items-stretch">
          <div
            className="relative w-full rounded-[32px] overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(226,236,248,0.42) 100%)",
              backdropFilter: "blur(28px) saturate(140%)",
              WebkitBackdropFilter: "blur(28px) saturate(140%)",
              border: "1px solid rgba(255,255,255,0.72)",
              boxShadow: "0 30px 80px -30px rgba(30,55,110,0.28), inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            {/* Inner glass highlight */}
            <div className="absolute inset-x-0 top-0 h-24 pointer-events-none" aria-hidden style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.55), transparent)",
            }} />
            <div className="relative px-7 sm:px-10 py-9 sm:py-11 flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3">
                <span className="w-14 h-14 rounded-full flex items-center justify-center bg-white/85 border border-white shadow-[0_6px_20px_-8px_rgba(30,55,110,0.35)]">
                  <img src={logo} alt="Peace Code" className="w-8 h-8 object-contain" />
                </span>
                <h2 className="text-center" style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", color: "#0d2547", fontWeight: 500 }}>
                  {(step && totalSteps) ? title : "Welcome to Peace Code"}
                </h2>
                <p className="text-center text-[13.5px] leading-relaxed max-w-[300px]" style={{ color: "#3a5a86" }}>
                  {(step && totalSteps) ? subtitle : "Let's begin your journey towards peace of mind."}
                </p>
              </div>

              {step && totalSteps && (
                <div>
                  <div className="flex items-center justify-between text-[11px] tracking-[0.15em] uppercase mb-2" style={{ color: "#0d2547" }}>
                    <span className="font-semibold">Step {step} of {totalSteps}</span>
                    <span style={{ color: "#3a5a86" }}>{stepLabel}</span>
                  </div>
                  <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(30,55,110,0.12)" }}>
                    <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${(step / totalSteps) * 100}%`, background: "#1c4f8a" }} />
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

// Shared UI primitives — used across email/login/signup screens.
export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <div className="text-[13px] font-semibold" style={{ color: "#0d2547" }}>{children}</div>
      {hint && <div className="text-[11.5px] mt-0.5" style={{ color: "#3a5a86" }}>{hint}</div>}
    </div>
  );
}

export function GlassInput({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl px-4 h-[52px] transition focus-within:ring-2" style={{
      background: "rgba(255,255,255,0.55)",
      border: "1px solid rgba(255,255,255,0.85)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
    }}>
      {icon && <span className="shrink-0" style={{ color: "#1c4f8a" }}>{icon}</span>}
      <input
        {...props}
        className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#8ba0be]"
        style={{ color: "#0d2547" }}
      />
    </label>
  );
}

export function GlassSelect({ icon, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { icon?: ReactNode }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl px-4 h-[52px]" style={{
      background: "rgba(255,255,255,0.55)",
      border: "1px solid rgba(255,255,255,0.85)",
    }}>
      {icon && <span className="shrink-0" style={{ color: "#1c4f8a" }}>{icon}</span>}
      <select {...props} className="flex-1 bg-transparent outline-none text-[14px] appearance-none" style={{ color: "#0d2547" }}>
        {children}
      </select>
    </label>
  );
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full h-[52px] rounded-2xl text-[14.5px] font-medium transition disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-105 active:scale-[0.99]"
      style={{
        background: "linear-gradient(180deg, #9aa8d4 0%, #7d8dc4 100%)",
        color: "white",
        boxShadow: "0 10px 24px -12px rgba(30,55,110,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      {children}
    </button>
  );
}

export function GhostRow({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{
      background: "rgba(255,255,255,0.45)",
      border: "1px solid rgba(255,255,255,0.75)",
    }}>
      <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/70" style={{ color: "#1c4f8a" }}>{icon}</span>
      <div className="leading-tight">
        <div className="text-[13.5px] font-semibold" style={{ color: "#0d2547" }}>{title}</div>
        <div className="text-[11.5px]" style={{ color: "#3a5a86" }}>{subtitle}</div>
      </div>
    </div>
  );
}
