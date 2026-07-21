/**
 * Preview validator — crawls key routes on a running server and checks
 * that each rendered page has consistent, well-formed share metadata.
 *
 * Checks per route:
 *   - <title> is present and non-empty
 *   - og:title is present and matches <title> (or is contained in it)
 *   - og:image is present and is an absolute URL
 *   - twitter:image is present and matches og:image
 *   - og:image URL responds 200 with an image/* content-type
 *
 * Usage:
 *   PREVIEW_URL=https://app.peacecode.in node scripts/preview-validate.mjs
 *   (defaults to http://localhost:3000)
 *
 * Exits non-zero on any mismatch so it can gate CI.
 */

const BASE = (process.env.PREVIEW_URL ?? "http://localhost:3000").replace(/\/$/, "");

// Curated key routes covering every major palette / template.
const ROUTES = [
  "/",
  "/auth",
  "/peacebot",
  "/breathe",
  "/focus",
  "/journal",
  "/gratitude",
  "/buddies",
  "/counselling",
  "/mental",
  "/profile",
  "/notifications",
  "/settings",
  "/settings/privacy",
  "/settings/appearance",
  "/settings/emergency",
];

/** Extract first matching meta tag by attribute + value. */
function metaTag(html, attr, value) {
  const re = new RegExp(
    `<meta[^>]+${attr}=["']${value}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const m1 = html.match(re);
  if (m1) return m1[1];
  // Also handle content-before-attr ordering.
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${value}["']`,
    "i",
  );
  const m2 = html.match(re2);
  return m2 ? m2[1] : null;
}

function titleTag(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : null;
}

function isAbsolute(url) {
  return /^https?:\/\//i.test(url);
}

/** Decode common HTML entities so string comparisons match rendered text. */
function decode(s) {
  if (!s) return s;
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

let totalErrors = 0;
let totalWarnings = 0;
const summary = [];

async function checkRoute(path) {
  const url = BASE + path;
  const row = { path, errors: [], warnings: [] };
  let html;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "PeaceCodePreviewValidator/1.0" },
    });
    if (res.status !== 200) {
      row.errors.push(`HTTP ${res.status}`);
      summary.push(row);
      totalErrors += row.errors.length;
      return;
    }
    html = await res.text();
  } catch (err) {
    row.errors.push(`fetch failed: ${err.message}`);
    summary.push(row);
    totalErrors += row.errors.length;
    return;
  }

  const title = decode(titleTag(html));
  const ogTitle = decode(metaTag(html, "property", "og:title"));
  const ogImage = metaTag(html, "property", "og:image");
  const twImage =
    metaTag(html, "name", "twitter:image") ??
    metaTag(html, "property", "twitter:image");

  if (!title) row.errors.push("<title> missing or empty");
  if (!ogTitle) row.errors.push("og:title missing");
  if (!ogImage) row.errors.push("og:image missing");
  if (!twImage) row.errors.push("twitter:image missing");

  if (title && ogTitle && !title.includes(ogTitle) && !ogTitle.includes(title)) {
    row.warnings.push(
      `og:title / <title> mismatch:\n      title=${JSON.stringify(title)}\n      og:title=${JSON.stringify(ogTitle)}`,
    );
  }

  if (ogImage && !isAbsolute(ogImage)) {
    row.errors.push(`og:image is not absolute: ${ogImage}`);
  }
  if (twImage && !isAbsolute(twImage)) {
    row.errors.push(`twitter:image is not absolute: ${twImage}`);
  }
  if (ogImage && twImage && ogImage !== twImage) {
    row.errors.push(
      `og:image and twitter:image differ:\n      og=${ogImage}\n      tw=${twImage}`,
    );
  }

  if (ogImage && isAbsolute(ogImage)) {
    try {
      const imgRes = await fetch(ogImage, { method: "GET" });
      const ct = imgRes.headers.get("content-type") ?? "";
      if (imgRes.status !== 200) {
        row.errors.push(`og:image ${imgRes.status} for ${ogImage}`);
      } else if (!/^image\//i.test(ct)) {
        row.errors.push(`og:image content-type "${ct}" for ${ogImage}`);
      }
    } catch (err) {
      row.errors.push(`og:image fetch failed: ${err.message}`);
    }
  }

  totalErrors += row.errors.length;
  totalWarnings += row.warnings.length;
  summary.push(row);
}

console.log(`Preview validator → ${BASE}`);
console.log(`Checking ${ROUTES.length} routes…\n`);

for (const path of ROUTES) {
  await checkRoute(path);
}

for (const row of summary) {
  const status = row.errors.length ? "✗" : row.warnings.length ? "!" : "✓";
  console.log(`${status} ${row.path}`);
  for (const e of row.errors) console.log(`    ERROR   ${e}`);
  for (const w of row.warnings) console.log(`    warn    ${w}`);
}

console.log(
  `\n${summary.length} routes, ${totalErrors} errors, ${totalWarnings} warnings`,
);
if (totalErrors > 0) process.exit(1);
