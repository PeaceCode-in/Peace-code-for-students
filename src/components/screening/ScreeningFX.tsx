import { useEffect } from "react";
import auroraAsset from "@/assets/screening-aurora.jpg.asset.json";

/**
 * Aurora-cloud backdrop for the Screening module.
 * Layers (back → front): sharp photo → soft blurred atmosphere →
 * tone wash → editorial grain. All fixed, non-interactive.
 */
export function ScreeningFX() {
  useEffect(() => {
    document.documentElement.setAttribute("data-pc-screening", "");
    return () => document.documentElement.removeAttribute("data-pc-screening");
  }, []);

  const fixed = {
    position: "fixed" as const,
    inset: 0,
    zIndex: 0,
    pointerEvents: "none" as const,
  };

  const grainUrl =
    "url(\"data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>
        <filter id='n'>
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
          <feColorMatrix values='0 0 0 0 0.08  0 0 0 0 0.10  0 0 0 0 0.18  0 0 0 1 0'/>
        </filter>
        <rect width='100%' height='100%' filter='url(#n)'/>
      </svg>`
    ) +
    "\")";

  return (
    <>
      <div
        aria-hidden
        style={{
          ...fixed,
          backgroundImage: `url(${auroraAsset.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        style={{
          ...fixed,
          backgroundImage: `url(${auroraAsset.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(48px) saturate(118%)",
          transform: "scale(1.1)",
          opacity: 0.7,
        }}
      />
      <div
        aria-hidden
        style={{
          ...fixed,
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.28), transparent 55%), linear-gradient(180deg, rgba(200,215,235,0.10) 0%, rgba(150,175,215,0.22) 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          ...fixed,
          backgroundImage: grainUrl,
          backgroundSize: "240px 240px",
          opacity: 0.09,
          mixBlendMode: "overlay",
        }}
      />
    </>
  );
}
