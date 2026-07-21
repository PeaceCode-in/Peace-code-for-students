/**
 * One-shot codemod:
 *
 * Point every route's og:image / twitter:image at the reliable static
 * JPG fallback (public/og.jpg) instead of the dynamic SVG endpoint.
 *
 * Why: X (Twitter), iMessage, WhatsApp, Discord, and Slack do NOT reliably
 * render image/svg+xml as a share preview. A single well-designed JPG works
 * everywhere. The dynamic /api/og/*.svg endpoint stays available for
 * browser previews, dev tools, and platforms that DO support SVG.
 *
 * Rewrites:
 *   og:image        → https://app.peacecode.in/og.jpg
 *   twitter:image   → https://app.peacecode.in/og.jpg
 *   og:image:type   → image/jpeg
 *
 * Leaves og:image:width/height (1200×630) unchanged — the fallback JPG
 * matches those exact dimensions.
 *
 * Idempotent: running twice is a no-op.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";
import { execSync } from "node:child_process";

const FALLBACK = "https://app.peacecode.in/og.jpg";

// Prefer ripgrep for speed; fall back to a filesystem walk if unavailable.
let files;
try {
  files = execSync("rg -l 'api/og/' src/routes", { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
} catch {
  files = globSync("src/routes/**/*.{ts,tsx}");
}

let changed = 0;
for (const file of files) {
  const before = readFileSync(file, "utf8");
  let after = before;

  // og:image → static JPG
  after = after.replace(
    /(property:\s*["']og:image["'],\s*content:\s*["'])[^"']*api\/og\/[^"']+\.svg[^"']*(["'])/g,
    `$1${FALLBACK}$2`,
  );
  // twitter:image → static JPG (handles both name= and property= forms)
  after = after.replace(
    /((?:name|property):\s*["']twitter:image["'],\s*content:\s*["'])[^"']*api\/og\/[^"']+\.svg[^"']*(["'])/g,
    `$1${FALLBACK}$2`,
  );
  // og:image:type → image/jpeg (was image/svg+xml)
  after = after.replace(
    /(property:\s*["']og:image:type["'],\s*content:\s*["'])image\/svg\+xml(["'])/g,
    `$1image/jpeg$2`,
  );

  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}

console.log(`Rewrote og:image / twitter:image in ${changed} route files.`);
