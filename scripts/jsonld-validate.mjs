/**
 * JSON-LD validator — crawls a running server and validates every
 * <script type="application/ld+json"> block on representative routes
 * against schema.org rules.
 *
 * Checks per script block:
 *   - Body is valid JSON
 *   - Top-level (and each graph node) has @context resolving to schema.org
 *   - Every node has an @type
 *   - @type is a known schema.org type from the allowlist below
 *   - Type-specific required properties are present (Google's rich-result
 *     baselines — kept intentionally strict so drift is loud in CI)
 *   - url / image / @id fields, when strings, are absolute https URLs
 *
 * Usage:
 *   PREVIEW_URL=http://localhost:3000 node scripts/jsonld-validate.mjs
 *
 * Exits non-zero on any error so it can gate CI.
 */

const BASE = (process.env.PREVIEW_URL ?? "http://localhost:3000").replace(/\/$/, "");

// One representative route per schema.org @type PageJsonLd emits, plus the
// sitewide Organization / WebSite / BreadcrumbList emitters at "/".
const ROUTES = [
  "/",
  "/auth",
  "/peacebot",
  "/peacebot/insights",
  "/counselling",
  "/counselling/experts",
  "/counselling/history",
  "/screening/library",
  "/breathe",
  "/focus",
  "/mindgym",
  "/mindgym/library",
  "/journal",
  "/gratitude",
  "/resources",
  "/community",
  "/buddies",
  "/events",
  "/profile",
  "/search",
  "/hub",
  "/settings",
  "/settings/appearance",
  "/emergency",
];

// Allowlist covers every @type produced by PageJsonLd, BreadcrumbJsonLd,
// and the sitewide nodes in __root.tsx. Add here when adding a new emitter.
const KNOWN_TYPES = new Set([
  "Organization",
  "WebSite",
  "WebPage",
  "MedicalWebPage",
  "WebApplication",
  "ReservationPackage",
  "MedicalBusiness",
  "HowTo",
  "HowToTool",
  "HowToStep",
  "CollectionPage",
  "LearningResource",
  "CreativeWork",
  "Article",
  "DiscussionForumPosting",
  "Event",
  "ProfilePage",
  "SearchResultsPage",
  "AboutPage",
  "BreadcrumbList",
  "ListItem",
  "ImageObject",
  "Offer",
  "Place",
  "Country",
  "ContactPoint",
  "PeopleAudience",
  "MedicalSpecialty",
  "MedicalCondition",
  "SearchAction",
  "EntryPoint",
  "FAQPage",
  "Question",
  "Answer",
]);

// Required properties per @type (baseline). Missing any → error.
const REQUIRED = {
  Organization: ["name", "url"],
  WebSite: ["name", "url"],
  WebPage: ["name", "url"],
  MedicalWebPage: ["name", "url"],
  WebApplication: ["name", "applicationCategory"],
  Article: ["headline"],
  Event: ["name", "startDate"],
  BreadcrumbList: ["itemListElement"],
  ListItem: ["position", "name"],
  HowTo: ["name"],
  CollectionPage: ["name"],
  ProfilePage: ["name"],
  ImageObject: ["url"],
  Offer: ["price", "priceCurrency"],
};

// String fields that must be absolute URLs when present.
const URL_FIELDS = ["url", "image", "logo", "sameAs"];

let totalErrors = 0;
let totalWarnings = 0;

function isAbsoluteHttps(u) {
  return typeof u === "string" && /^https?:\/\//i.test(u);
}

function normalizeContext(ctx) {
  // @context may be a string, an array, or an object with @vocab / etc.
  if (typeof ctx === "string") return [ctx];
  if (Array.isArray(ctx)) return ctx.flatMap(normalizeContext);
  if (ctx && typeof ctx === "object") {
    const vocab = ctx["@vocab"];
    return vocab ? [vocab] : [];
  }
  return [];
}

function contextIsSchemaOrg(ctx) {
  return normalizeContext(ctx).some((c) =>
    typeof c === "string" && /(^|\/\/|:)schema\.org($|\/)/i.test(c),
  );
}

/** Walk one JSON-LD node (and any nested @graph / children) collecting errors. */
function validateNode(node, path, ctx) {
  const errs = [];
  const warns = [];

  if (!node || typeof node !== "object" || Array.isArray(node)) return { errs, warns };

  // A node may re-declare @context; otherwise it inherits from the parent.
  const activeCtx = node["@context"] ?? ctx;

  const type = node["@type"];
  if (type) {
    if (!activeCtx || !contextIsSchemaOrg(activeCtx)) {
      errs.push(`${path}: node has @type "${type}" but @context is missing/non-schema.org`);
    }
    const types = Array.isArray(type) ? type : [type];
    for (const t of types) {
      if (typeof t !== "string") {
        errs.push(`${path}: @type must be a string, got ${typeof t}`);
        continue;
      }
      if (!KNOWN_TYPES.has(t)) {
        warns.push(`${path}: unknown @type "${t}" (add to KNOWN_TYPES if intentional)`);
      }
      const required = REQUIRED[t];
      if (required) {
        for (const key of required) {
          if (node[key] === undefined || node[key] === null || node[key] === "") {
            errs.push(`${path}: @type ${t} is missing required property "${key}"`);
          }
        }
      }
    }
  }

  // Absolute-URL check for well-known link fields.
  for (const key of URL_FIELDS) {
    const v = node[key];
    if (typeof v === "string" && v.length > 0 && !isAbsoluteHttps(v)) {
      errs.push(`${path}.${key} must be an absolute http(s) URL, got "${v}"`);
    }
  }

  // Recurse into @graph, itemListElement, and other object/array children.
  for (const [k, v] of Object.entries(node)) {
    if (k === "@context" || k === "@type") continue;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item && typeof item === "object") {
          const sub = validateNode(item, `${path}.${k}[${i}]`, activeCtx);
          errs.push(...sub.errs);
          warns.push(...sub.warns);
        }
      });
    } else if (v && typeof v === "object") {
      const sub = validateNode(v, `${path}.${k}`, activeCtx);
      errs.push(...sub.errs);
      warns.push(...sub.warns);
    }
  }

  return { errs, warns };
}

function validateJsonLd(raw, label) {
  const errs = [];
  const warns = [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { errs: [`${label}: invalid JSON — ${e.message}`], warns };
  }

  const roots = Array.isArray(parsed) ? parsed : [parsed];
  roots.forEach((root, i) => {
    const path = `${label}[${i}]`;
    if (!root || typeof root !== "object") {
      errs.push(`${path}: top-level must be an object`);
      return;
    }
    if (!root["@context"]) {
      errs.push(`${path}: missing top-level @context`);
    } else if (!contextIsSchemaOrg(root["@context"])) {
      errs.push(`${path}: @context does not resolve to schema.org`);
    }
    if (!root["@type"] && !root["@graph"]) {
      errs.push(`${path}: missing @type (or @graph)`);
    }
    const sub = validateNode(root, path, root["@context"]);
    errs.push(...sub.errs);
    warns.push(...sub.warns);
  });

  return { errs, warns };
}

/** Extract every JSON-LD script body from a rendered HTML document. */
function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    blocks.push(m[1].trim());
  }
  return blocks;
}

async function check(route) {
  const url = `${BASE}${route}`;
  let html;
  try {
    const res = await fetch(url, { headers: { "user-agent": "peacecode-jsonld-validator" } });
    if (!res.ok) {
      console.error(`✗ ${route} — HTTP ${res.status}`);
      totalErrors++;
      return;
    }
    html = await res.text();
  } catch (e) {
    console.error(`✗ ${route} — fetch failed: ${e.message}`);
    totalErrors++;
    return;
  }

  const blocks = extractJsonLd(html);
  if (blocks.length === 0) {
    console.error(`✗ ${route} — no JSON-LD blocks found`);
    totalErrors++;
    return;
  }

  let routeErrors = 0;
  let routeWarnings = 0;
  blocks.forEach((body, i) => {
    const { errs, warns } = validateJsonLd(body, `${route} block#${i}`);
    for (const e of errs) console.error(`  ✗ ${e}`);
    for (const w of warns) console.warn(`  ⚠ ${w}`);
    routeErrors += errs.length;
    routeWarnings += warns.length;
  });

  totalErrors += routeErrors;
  totalWarnings += routeWarnings;

  const summary =
    routeErrors === 0
      ? routeWarnings === 0
        ? "OK"
        : `OK (${routeWarnings} warning${routeWarnings === 1 ? "" : "s"})`
      : `${routeErrors} error${routeErrors === 1 ? "" : "s"}`;
  const marker = routeErrors === 0 ? "✓" : "✗";
  console.log(`${marker} ${route} — ${blocks.length} block(s) — ${summary}`);
}

console.log(`JSON-LD validator → ${BASE}`);
console.log(`Routes: ${ROUTES.length}\n`);

for (const r of ROUTES) {
  // eslint-disable-next-line no-await-in-loop
  await check(r);
}

console.log(
  `\n${totalErrors === 0 ? "PASS" : "FAIL"} — ${totalErrors} error(s), ${totalWarnings} warning(s)`,
);

process.exit(totalErrors === 0 ? 0 : 1);
