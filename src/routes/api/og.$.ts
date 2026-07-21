import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * Dynamic OpenGraph image endpoint.
 *
 * URL: /api/og/<anything>.svg?title=...&kicker=...&palette=sakura
 *
 * Renders a 1200x630 SVG social card. SVG is served with the correct
 * Content-Type so LinkedIn, Discord, Slack, X (via caching CDN), and
 * WhatsApp render it. The full body ships in each response — no fonts
 * loaded, no external assets — so it works from any edge Worker.
 */

type Palette = {
  bgFrom: string;
  bgTo: string;
  accent: string;
  text: string;
  sub: string;
  soft: string;
};

const PALETTES: Record<string, Palette> = {
  // Warm sakura (default brand)
  sakura:   { bgFrom: "#fff1ec", bgTo: "#ffd9d0", accent: "#c94a4a", text: "#3a2418", sub: "#7a5548", soft: "#ffe6dc" },
  // Cool sky (auth / peace)
  sky:      { bgFrom: "#eaf3ff", bgTo: "#c9dcff", accent: "#1e3a8a", text: "#0f1e3d", sub: "#4a5a7a", soft: "#e2ecff" },
  // Sage (community / gratitude)
  sage:     { bgFrom: "#eef4ec", bgTo: "#cfe1c9", accent: "#3f6b48", text: "#1e2f22", sub: "#4a5f4f", soft: "#e6efe0" },
  // Lavender (meditation / mindfulness)
  lavender: { bgFrom: "#f2ecff", bgTo: "#d9c9ff", accent: "#5b3fa3", text: "#231a3a", sub: "#5a4a7a", soft: "#ece0ff" },
  // Amber (achievements / journey)
  amber:    { bgFrom: "#fff4e0", bgTo: "#ffe0a8", accent: "#a05a12", text: "#2d1e0a", sub: "#7a5a2c", soft: "#ffe9c2" },
  // Graphite (settings / hub)
  graphite: { bgFrom: "#f2f2f0", bgTo: "#d8d8d4", accent: "#3a3a38", text: "#1a1a18", sub: "#555552", soft: "#e8e8e4" },
  // Rose (peacebot / journal)
  rose:     { bgFrom: "#fff0f4", bgTo: "#ffcfdc", accent: "#a83355", text: "#3a1225", sub: "#7a3e56", soft: "#ffe0e8" },
  // Ocean (focus / breathe)
  ocean:    { bgFrom: "#e6f6f9", bgTo: "#b7dfe8", accent: "#0e5a70", text: "#0a2a34", sub: "#3d5c66", soft: "#d6ecf1" },
};

/** Pick a palette from the path prefix so sibling routes share a family. */
function paletteForPath(path: string, override?: string | null): Palette {
  if (override && PALETTES[override]) return PALETTES[override];
  const p = path.toLowerCase();
  if (p.startsWith("/auth")) return PALETTES.sky;
  if (p.startsWith("/peacebot")) return PALETTES.rose;
  if (p.startsWith("/journal") || p.startsWith("/gratitude")) return PALETTES.sage;
  if (p.startsWith("/breathe") || p.startsWith("/focus") || p.startsWith("/sanctum")) return PALETTES.ocean;
  if (p.startsWith("/mindgym") || p.startsWith("/meditation") || p.startsWith("/sleep")) return PALETTES.lavender;
  if (p.startsWith("/profile") || p.startsWith("/achievements")) return PALETTES.amber;
  if (p.startsWith("/settings") || p.startsWith("/hub") || p.startsWith("/notifications")) return PALETTES.graphite;
  if (p.startsWith("/community") || p.startsWith("/buddies") || p.startsWith("/events")) return PALETTES.sage;
  return PALETTES.sakura;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === '"' ? "&quot;" : "&apos;",
  );
}

/** Break a title into up to 3 visually balanced lines. */
function wrapLines(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if (!current.length) {
      current = w;
      continue;
    }
    if (current.length + 1 + w.length <= maxCharsPerLine) {
      current += " " + w;
    } else {
      lines.push(current);
      current = w;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  // Fold remaining words into the last line with an ellipsis if needed.
  const consumed = lines.join(" ").split(/\s+/).length;
  if (consumed < words.length && lines.length) {
    const remaining = words.slice(consumed).join(" ");
    const last = lines[lines.length - 1];
    const room = maxCharsPerLine - last.length - 1;
    lines[lines.length - 1] = last + (remaining.length > room ? " " + remaining.slice(0, Math.max(0, room - 1)).trimEnd() + "…" : " " + remaining);
  }
  return lines;
}

function renderSvg({
  title,
  kicker,
  palette,
}: {
  title: string;
  kicker: string;
  palette: Palette;
}): string {
  const lines = wrapLines(title, 22, 3);
  const lineHeight = 108;
  const titleBlockHeight = lines.length * lineHeight;
  const titleStartY = 340 - (titleBlockHeight - lineHeight) / 2;
  const t = (s: string) => escapeXml(s);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.bgFrom}"/>
      <stop offset="1" stop-color="${palette.bgTo}"/>
    </linearGradient>
    <radialGradient id="orb" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${palette.accent}" stop-opacity="0.55"/>
      <stop offset="0.55" stop-color="${palette.accent}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${palette.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0"/>
    </filter>
  </defs>

  <!-- Base gradient -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Soft accent orbs (parallax composition) -->
  <circle cx="980" cy="140" r="260" fill="url(#orb)"/>
  <circle cx="1120" cy="520" r="200" fill="url(#orb)" opacity="0.7"/>
  <circle cx="140" cy="560" r="180" fill="url(#orb2)" opacity="0.6"/>

  <!-- Grain overlay -->
  <rect width="1200" height="630" fill="white" filter="url(#grain)" opacity="0.35"/>

  <!-- Editorial rule -->
  <line x1="80" y1="180" x2="200" y2="180" stroke="${palette.accent}" stroke-width="2" opacity="0.85"/>

  <!-- Kicker (route family) -->
  <text x="80" y="150" font-family="ui-serif, Georgia, 'Times New Roman', serif" font-size="26" font-style="italic" fill="${palette.sub}" letter-spacing="0.08em">
    ${t(kicker)}
  </text>

  <!-- Title -->
  <g font-family="ui-serif, 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif" font-size="96" font-weight="600" fill="${palette.text}" letter-spacing="-0.02em">
    ${lines
      .map((ln, i) => `<text x="80" y="${titleStartY + i * lineHeight}">${t(ln)}</text>`)
      .join("\n    ")}
  </g>

  <!-- Brand lockup -->
  <g transform="translate(80, 540)">
    <circle cx="24" cy="24" r="24" fill="${palette.accent}"/>
    <circle cx="24" cy="24" r="10" fill="${palette.soft}"/>
    <text x="66" y="22" font-family="ui-serif, Georgia, serif" font-size="26" font-weight="600" fill="${palette.text}" letter-spacing="0.02em">PeaceCode</text>
    <text x="66" y="46" font-family="system-ui, -apple-system, 'Segoe UI', Inter, sans-serif" font-size="18" fill="${palette.sub}" letter-spacing="0.04em">Student mental wellness</text>
  </g>

  <!-- URL pill -->
  <g transform="translate(920, 552)">
    <rect x="0" y="0" rx="20" ry="20" width="200" height="40" fill="${palette.text}" opacity="0.06"/>
    <text x="20" y="26" font-family="system-ui, -apple-system, Inter, sans-serif" font-size="16" fill="${palette.text}" opacity="0.75">app.peacecode.in</text>
  </g>
</svg>`;
}

/** Turn "/mindgym/library" → "Mind Gym · Library" for the kicker. */
function kickerFromPath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (!parts.length) return "PeaceCode";
  return parts
    .slice(0, 2)
    .map((p) =>
      p
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase()),
    )
    .join(" · ");
}

/** Derive a default title from the path if the caller didn't send one. */
function titleFromPath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (!parts.length) return "PeaceCode";
  const last = parts[parts.length - 1].replace(/\.svg$/i, "").replace(/[-_]/g, " ");
  return last.replace(/\b\w/g, (m) => m.toUpperCase());
}

/**
 * Fast, deterministic 32-bit FNV-1a hash → hex. Used to build strong
 * ETags from the rendered SVG body so any change in inputs (title,
 * kicker, palette, route) yields a new tag and scrapers refresh.
 */
function fnv1a(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

/** Semantic version of the renderer — bump to invalidate all ETags. */
const OG_RENDERER_VERSION = "1";

export async function handleOg(request: Request): Promise<Response> {
  const url = new URL(request.url);
  // The splat comes in as everything after /api/og/
  const splat = url.pathname.replace(/^\/api\/og\/?/, "");
  const routePath = "/" + splat.replace(/\.svg$/i, "");

  const rawTitle = url.searchParams.get("title") ?? titleFromPath(routePath);
  const rawKicker = url.searchParams.get("kicker") ?? kickerFromPath(routePath);
  const paletteName = url.searchParams.get("palette");
  const palette = paletteForPath(routePath, paletteName);

  // Clamp to protect the layout from absurd inputs.
  const title = rawTitle.slice(0, 80);
  const kicker = rawKicker.slice(0, 40).toUpperCase();

  const svg = renderSvg({ title, kicker, palette });

  // Strong ETag over renderer version + final body — deterministic and
  // varies precisely with the meaningful inputs (title, kicker, palette,
  // route path). Query-param permutations that don't affect output
  // collapse to the same tag, which is what we want.
  const etag = `"og-${OG_RENDERER_VERSION}-${fnv1a(svg)}"`;

  // Common caching headers shared by 200 and 304 responses.
  const cacheHeaders: Record<string, string> = {
    ETag: etag,
    // Public: safe to cache in shared caches (Cloudflare, social scrapers).
    // max-age: browser cache lifetime.
    // s-maxage: shared/CDN cache lifetime (longer — output is deterministic).
    // stale-while-revalidate: serve stale while re-fetching in background.
    // stale-if-error: keep serving on upstream failure.
    "Cache-Control":
      "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800, stale-if-error=604800, immutable",
    // Signal to intermediaries that the response body depends on these
    // request dimensions. Query string is implicitly part of the cache
    // key on all major CDNs, so Vary only needs to cover negotiated
    // request headers.
    Vary: "Accept, Accept-Encoding",
  };

  // Conditional GET — honour If-None-Match for scraper refreshes.
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && etagMatches(ifNoneMatch, etag)) {
    return new Response(null, { status: 304, headers: cacheHeaders });
  }

  const isHead = request.method === "HEAD";
  return new Response(isHead ? null : svg, {
    status: 200,
    headers: {
      ...cacheHeaders,
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}

/**
 * RFC 7232 §3.1 — If-None-Match can be a comma-separated list or "*".
 * Compare using weak equivalence (ignoring any leading "W/").
 */
function etagMatches(ifNoneMatch: string, etag: string): boolean {
  if (ifNoneMatch.trim() === "*") return true;
  const strip = (s: string) => s.trim().replace(/^W\//, "");
  const target = strip(etag);
  return ifNoneMatch.split(",").some((tag) => strip(tag) === target);
}

export const Route = createFileRoute("/api/og/$")({
  server: {
    handlers: {
      GET: async ({ request }) => handleOg(request),
      HEAD: async ({ request }) => handleOg(request),
    },
  },
});
