#!/usr/bin/env node
/**
 * One-shot codemod: back-fills description, og:title, and og:description
 * on any leaf route that already has a title + og:image but is missing
 * the descriptive tags. Uses the existing title to derive text.
 *
 * Idempotent — re-running it is a no-op once the tags are present.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROUTES_DIR = path.resolve(__dirname, "../src/routes");

const DESC_TEMPLATE = (title) => {
  // Strip trailing " — PeaceCode" for a cleaner sentence, cap at 150 chars.
  const clean = title.replace(/\s*[—-]\s*PeaceCode.*$/i, "").trim();
  const base = `${clean} on PeaceCode — a calm, private space for Indian students to feel supported, focused, and understood.`;
  return base.length > 158 ? base.slice(0, 155) + "…" : base;
};

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(e.name)) out.push(full);
  }
  return out;
}

let patched = 0;
for (const fp of walk(ROUTES_DIR)) {
  const rel = path.relative(path.resolve(__dirname, ".."), fp);
  if (rel.endsWith("__root.tsx") || rel.endsWith("routeTree.gen.ts")) continue;
  let src = fs.readFileSync(fp, "utf8");
  if (!/head\s*:\s*\(/.test(src)) continue;
  if (/<Outlet\b/.test(src)) continue;

  const titleMatch = src.match(/\{\s*title\s*:\s*(["'`])([^"'`]*)\1\s*\}/);
  if (!titleMatch) continue;
  const title = titleMatch[2];

  const hasDesc = /\{\s*name\s*:\s*["']description["']/.test(src);
  const hasOgT = /property\s*:\s*["']og:title["']/.test(src);
  const hasOgD = /property\s*:\s*["']og:description["']/.test(src);
  if (hasDesc && hasOgT && hasOgD) continue;

  const desc = DESC_TEMPLATE(title);
  const inserts = [];
  if (!hasDesc) inserts.push(`{ name: "description", content: ${JSON.stringify(desc)} }`);
  if (!hasOgT) inserts.push(`{ property: "og:title", content: ${JSON.stringify(title)} }`);
  if (!hasOgD) inserts.push(`{ property: "og:description", content: ${JSON.stringify(desc)} }`);

  // Insert right after the title meta object.
  const insertion = `,\n      ${inserts.join(",\n      ")}`;
  src = src.replace(titleMatch[0], titleMatch[0] + insertion);
  fs.writeFileSync(fp, src);
  patched++;
  console.log("patched", rel);
}
console.log(`\nDone — ${patched} route(s) patched.`);
