/**
 * Automated tests for the dynamic OG image endpoint.
 *
 * Exercises `handleOg` directly (no HTTP server required) with a
 * representative set of routes and asserts:
 *   - 200 status + `image/svg+xml` content-type
 *   - 1200×630 SVG viewBox / width / height
 *   - stable `Cache-Control` (public + max-age + s-maxage + SWR)
 *   - `Vary` header includes Accept-Encoding
 *   - strong `ETag` present, deterministic for the same URL, and
 *     different when `?title=` changes
 *   - conditional GET with `If-None-Match` returns 304 + no body
 *   - HEAD returns headers but no body
 *   - unknown `?palette=` value falls back gracefully (still 200)
 *
 * Run:  bun scripts/og-test.ts
 * Exits with a non-zero code on the first assertion failure so it can
 * gate CI.
 */

import { handleOg } from "../src/routes/api/og.$";

type Case = { name: string; url: string };

const CASES: Case[] = [
  { name: "root",       url: "https://app.peacecode.in/api/og/index.svg?title=PeaceCode" },
  { name: "auth",       url: "https://app.peacecode.in/api/og/auth.svg?title=Sign%20in" },
  { name: "peacebot",   url: "https://app.peacecode.in/api/og/peacebot.svg?title=Peace%20Bot" },
  { name: "breathe",    url: "https://app.peacecode.in/api/og/breathe.svg?title=Box%20Breathing" },
  { name: "journal",    url: "https://app.peacecode.in/api/og/journal.svg?title=One%20line%20tonight" },
  { name: "settings",   url: "https://app.peacecode.in/api/og/settings/privacy.svg?title=Privacy" },
  { name: "long-title", url: "https://app.peacecode.in/api/og/mental.svg?title=" + encodeURIComponent("An unreasonably long title ".repeat(6)) },
  { name: "no-title",   url: "https://app.peacecode.in/api/og/community/buddies.svg" },
  { name: "bad-palette",url: "https://app.peacecode.in/api/og/focus.svg?palette=doesnotexist&title=Focus" },
];

let failed = 0;
let passed = 0;

function assert(cond: unknown, msg: string) {
  if (cond) {
    passed++;
    return;
  }
  failed++;
  console.error(`  ✗ ${msg}`);
}

async function runCase(c: Case) {
  console.log(`\n• ${c.name}  ${c.url}`);
  const res = await handleOg(new Request(c.url));
  const body = await res.text();

  // Status + MIME
  assert(res.status === 200, `status is 200 (got ${res.status})`);
  const ct = res.headers.get("content-type") ?? "";
  assert(ct.startsWith("image/svg+xml"), `content-type is image/svg+xml (got "${ct}")`);

  // Dimensions
  assert(body.includes('width="1200"'), 'SVG width="1200" present');
  assert(body.includes('height="630"'), 'SVG height="630" present');
  assert(body.includes('viewBox="0 0 1200 630"'), 'SVG viewBox is 0 0 1200 630');
  assert(body.trimStart().startsWith("<?xml"), "body starts with XML prolog");

  // Cache-Control
  const cc = res.headers.get("cache-control") ?? "";
  assert(cc.includes("public"), `Cache-Control includes public (got "${cc}")`);
  assert(/max-age=\d+/.test(cc), "Cache-Control has max-age");
  assert(/s-maxage=\d+/.test(cc), "Cache-Control has s-maxage");
  assert(cc.includes("stale-while-revalidate"), "Cache-Control has stale-while-revalidate");
  assert(cc.includes("stale-if-error"), "Cache-Control has stale-if-error");

  // Vary
  const vary = res.headers.get("vary") ?? "";
  assert(/accept-encoding/i.test(vary), `Vary includes Accept-Encoding (got "${vary}")`);

  // ETag
  const etag = res.headers.get("etag") ?? "";
  assert(/^"og-\d+-[0-9a-f]{8}"$/.test(etag), `ETag is well-formed (got "${etag}")`);
  return etag;
}

async function runInvariants() {
  console.log("\n• invariants — ETag stability & variance");
  const a1 = await handleOg(new Request("https://x/api/og/journal.svg?title=Alpha"));
  const a2 = await handleOg(new Request("https://x/api/og/journal.svg?title=Alpha"));
  const b  = await handleOg(new Request("https://x/api/og/journal.svg?title=Beta"));
  const etagA1 = a1.headers.get("etag");
  const etagA2 = a2.headers.get("etag");
  const etagB  = b.headers.get("etag");
  assert(etagA1 && etagA1 === etagA2, "ETag is deterministic for identical URL");
  assert(etagA1 !== etagB, "ETag differs when ?title= changes");

  console.log("\n• invariants — conditional GET (If-None-Match → 304)");
  const cached = await handleOg(
    new Request("https://x/api/og/journal.svg?title=Alpha", {
      headers: { "if-none-match": etagA1! },
    }),
  );
  assert(cached.status === 304, `304 Not Modified when ETag matches (got ${cached.status})`);
  const cachedBody = await cached.text();
  assert(cachedBody.length === 0, "304 has empty body");
  assert(cached.headers.get("etag") === etagA1, "304 echoes the same ETag");
  assert((cached.headers.get("cache-control") ?? "").includes("public"), "304 keeps Cache-Control");

  console.log("\n• invariants — If-None-Match: * matches");
  const star = await handleOg(
    new Request("https://x/api/og/journal.svg?title=Alpha", {
      headers: { "if-none-match": "*" },
    }),
  );
  assert(star.status === 304, `If-None-Match:* returns 304 (got ${star.status})`);

  console.log("\n• invariants — stale ETag revalidates with 200");
  const stale = await handleOg(
    new Request("https://x/api/og/journal.svg?title=Alpha", {
      headers: { "if-none-match": '"og-1-deadbeef"' },
    }),
  );
  assert(stale.status === 200, `stale ETag returns fresh 200 (got ${stale.status})`);

  console.log("\n• invariants — HEAD returns headers with no body");
  const head = await handleOg(
    new Request("https://x/api/og/journal.svg?title=Alpha", { method: "HEAD" }),
  );
  assert(head.status === 200, `HEAD returns 200 (got ${head.status})`);
  const headBody = await head.text();
  assert(headBody.length === 0, "HEAD body is empty");
  assert(
    (head.headers.get("content-type") ?? "").startsWith("image/svg+xml"),
    "HEAD content-type is image/svg+xml",
  );
  assert(head.headers.get("etag") === etagA1, "HEAD ETag matches GET ETag");
}

async function main() {
  console.log("Testing /api/og/* renderer…");
  for (const c of CASES) {
    try {
      await runCase(c);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${c.name} threw:`, err);
    }
  }
  try {
    await runInvariants();
  } catch (err) {
    failed++;
    console.error("  ✗ invariants threw:", err);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
