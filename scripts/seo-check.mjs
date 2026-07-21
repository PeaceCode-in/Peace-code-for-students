#!/usr/bin/env node
/**
 * SEO metadata validator.
 *
 * Scans every leaf route under src/routes/ and asserts that the route's
 * head() block ships:
 *   - title (≤ 60 chars)
 *   - description (≤ 160 chars)
 *   - canonical link
 *   - og:title, og:description, og:image
 *   - twitter:card (from __root) and twitter:image
 *
 * Routes are skipped when:
 *   - They're the root shell (__root.tsx) or a layout route (renders <Outlet />).
 *   - They contain a dynamic $param segment (dynamic pages are noindexed).
 *   - Their head() sets robots noindex.
 *
 * Exits non-zero on any failure so the build fails loud. Warnings (length
 * out of ideal range but present) are printed but do not fail the build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ROUTES_DIR = path.join(ROOT, "src/routes");

const TITLE_MAX = 60;
const TITLE_MIN = 15;
const DESC_MAX = 160;
const DESC_MIN = 50;

const RED = "\x1b[31m";
const YEL = "\x1b[33m";
const GRN = "\x1b[32m";
const DIM = "\x1b[2m";
const RST = "\x1b[0m";

/** @typedef {{ file: string; level: "error"|"warn"; msg: string }} Finding */
/** @type {Finding[]} */
const findings = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

function relFile(fp) {
  return path.relative(ROOT, fp);
}

/**
 * Extract the string value for a given `name`/`property` key inside a
 * `meta: [ ... ]` block. Only handles simple string literals — dynamic
 * template strings are treated as "present" without a length check.
 */
function extractLiteral(raw) {
  // Match "...", '...', or `...`, tolerating escapes and the OTHER quote inside.
  const m = raw.match(/^"((?:[^"\\]|\\.)*)"$|^'((?:[^'\\]|\\.)*)'$|^`((?:[^`\\]|\\.)*)`$/);
  if (!m) return null;
  return m[1] ?? m[2] ?? m[3] ?? "";
}

function readMetaValue(src, key) {
  const pattern = new RegExp(
    `\\{\\s*(?:name|property)\\s*:\\s*["']${key}["']\\s*,\\s*content\\s*:\\s*([^}]+?)\\s*\\}`,
    "s",
  );
  const m = src.match(pattern);
  if (!m) return { present: false };
  const raw = m[1].trim();
  const lit = extractLiteral(raw);
  return { present: true, value: lit, dynamic: lit === null };
}

function readTitle(src) {
  const m = src.match(
    /\{\s*title\s*:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)\s*\}/,
  );
  if (!m) return { present: false };
  return { present: true, value: m[1] ?? m[2] ?? m[3] ?? "", dynamic: false };
}

function hasCanonical(src) {
  return /rel:\s*["']canonical["']/.test(src);
}

function hasHead(src) {
  return /head\s*:\s*\(/.test(src);
}

function isLayout(src) {
  return /<Outlet\b/.test(src);
}

function hasNoindex(src) {
  return /content:\s*["']noindex/.test(src);
}

function filenameToRoutePath(fp) {
  const rel = path.relative(ROUTES_DIR, fp).replace(/\\/g, "/");
  const base = rel.replace(/\.tsx?$/, "");
  if (base === "index") return "/";
  // Support both flat dot files and nested dirs.
  let p = "/" + base.split(/[./]/).join("/");
  p = p.replace(/\/index$/, "");
  return p;
}

const files = walk(ROUTES_DIR).filter((f) => !f.endsWith("routeTree.gen.ts"));
let checked = 0;
let skipped = 0;

for (const fp of files) {
  const name = path.basename(fp);
  if (name === "__root.tsx" || name === "routeTree.gen.ts") {
    skipped++;
    continue;
  }
  const src = fs.readFileSync(fp, "utf8");
  // File-based server routes (e.g. `sitemap[.]xml.ts`, `robots[.]txt.ts`,
  // anything under src/routes/api/) don't render HTML and have no head().
  const isServerRoute = /\[\.\]|\/api\//.test(fp.replace(/\\/g, "/"));
  if (isServerRoute) {
    skipped++;
    continue;
  }
  if (!hasHead(src)) {
    findings.push({ file: relFile(fp), level: "error", msg: "no head() metadata block" });
    continue;
  }
  if (isLayout(src)) {
    skipped++;
    continue;
  }
  const routePath = filenameToRoutePath(fp);
  if (routePath.includes("$")) {
    skipped++;
    continue;
  }
  if (hasNoindex(src)) {
    skipped++;
    continue;
  }

  checked++;
  const title = readTitle(src);
  const desc = readMetaValue(src, "description");
  const ogTitle = readMetaValue(src, "og:title");
  const ogDesc = readMetaValue(src, "og:description");
  const ogImg = readMetaValue(src, "og:image");
  const twImg = readMetaValue(src, "twitter:image");

  const push = (level, msg) => findings.push({ file: relFile(fp), level, msg });

  if (!title.present) push("error", "missing <title>");
  else if (title.value != null) {
    if (title.value.length > TITLE_MAX)
      push("error", `title too long: ${title.value.length} > ${TITLE_MAX} chars — "${title.value}"`);
    else if (title.value.length < TITLE_MIN)
      push("warn", `title short: ${title.value.length} < ${TITLE_MIN} chars — "${title.value}"`);
  }

  if (!desc.present) push("error", "missing meta description");
  else if (desc.value != null) {
    if (desc.value.length > DESC_MAX)
      push("error", `description too long: ${desc.value.length} > ${DESC_MAX} chars`);
    else if (desc.value.length < DESC_MIN)
      push("warn", `description short: ${desc.value.length} < ${DESC_MIN} chars`);
  }

  if (!hasCanonical(src)) push("error", "missing rel=canonical link");
  if (!ogTitle.present) push("error", "missing og:title");
  if (!ogDesc.present) push("error", "missing og:description");
  if (!ogImg.present) push("error", "missing og:image");
  if (!twImg.present) push("warn", "missing twitter:image (og:image will be used as fallback)");
}

const errors = findings.filter((f) => f.level === "error");
const warnings = findings.filter((f) => f.level === "warn");

const grouped = new Map();
for (const f of findings) {
  if (!grouped.has(f.file)) grouped.set(f.file, []);
  grouped.get(f.file).push(f);
}

if (findings.length === 0) {
  console.log(`${GRN}✓${RST} SEO metadata OK — ${checked} routes checked, ${skipped} skipped.`);
  process.exit(0);
}

console.log(`\n${DIM}SEO metadata report — ${checked} routes checked, ${skipped} skipped.${RST}\n`);
for (const [file, items] of grouped) {
  console.log(`  ${file}`);
  for (const it of items) {
    const tag = it.level === "error" ? `${RED}ERR${RST}` : `${YEL}WARN${RST}`;
    console.log(`    ${tag}  ${it.msg}`);
  }
}
console.log(
  `\n${errors.length ? RED : GRN}${errors.length} error${errors.length === 1 ? "" : "s"}${RST}, ` +
    `${warnings.length ? YEL : DIM}${warnings.length} warning${warnings.length === 1 ? "" : "s"}${RST}.`,
);

if (process.env.SEO_CHECK_STRICT === "1") {
  if (findings.length > 0) process.exit(1);
} else if (errors.length > 0) {
  process.exit(1);
}
