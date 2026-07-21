// Canonical URL redirects.
//
// Runs before every server request and issues a 301 (permanent) redirect
// whenever the incoming URL doesn't match its canonical shape:
//
//   1. Trailing slash — `/settings/` -> `/settings` (root `/` is kept).
//   2. Case — `/Settings/Profile` -> `/settings/profile`.
//   3. Legacy aliases — `/dashboard`, `/login`, `/signup`, `/chat`, etc.
//      redirect to their current canonical route.
//
// Query strings and hash fragments are preserved across the redirect so
// campaign links and deep-linked anchors keep working.
//
// Assets, API routes, and the OG image generator are exempt — they have
// their own canonical URL shape.

const LEGACY_ALIASES: Record<string, string> = {
  // Landing / dashboard
  "/dashboard": "/",
  "/home": "/",
  "/app": "/",

  // Auth
  "/login": "/auth",
  "/signin": "/auth",
  "/sign-in": "/auth",
  "/signup": "/auth",
  "/sign-up": "/auth",
  "/register": "/auth",
  "/logout": "/settings/logout",
  "/sign-out": "/settings/logout",

  // PeaceBot AI companion
  "/chat": "/peacebot",
  "/ai": "/peacebot",
  "/bot": "/peacebot",
  "/assistant": "/peacebot",
  "/peace-bot": "/peacebot",

  // Breathing / mindfulness
  "/meditate": "/breathe",
  "/meditation": "/breathe",
  "/mindfulness": "/breathe",
  "/breathing": "/breathe",

  // Focus
  "/pomodoro": "/focus",
  "/timer": "/focus",
  "/study": "/focus",

  // Journal & gratitude
  "/diary": "/journal",
  "/thanks": "/gratitude",
  "/thankyou": "/gratitude",

  // Community
  "/community": "/buddies",
  "/friends": "/buddies",
  "/peers": "/buddies",

  // Counselling
  "/therapy": "/counselling",
  "/therapist": "/counselling",
  "/counsellor": "/counselling",
  "/counselor": "/counselling",
  "/counseling": "/counselling",

  // Screening / mental health
  "/screening": "/mental",
  "/mental-health": "/mental",
  "/assessment": "/mental",
  "/phq9": "/mental",
  "/gad7": "/mental",

  // Settings & account
  "/account": "/settings/profile",
  "/preferences": "/settings",
  "/help": "/settings/support",
  "/support": "/settings/support",
  "/privacy-policy": "/settings/privacy",
  "/privacy": "/settings/privacy",
  "/appearance": "/settings/appearance",
  "/theme": "/settings/appearance",
  "/emergency": "/settings/emergency",
  "/sos": "/settings/emergency",

  // Search / notifications
  "/notifications-inbox": "/notifications/inbox",
  "/inbox": "/notifications/inbox",
  "/find": "/search",
};

/** Paths that must NOT be rewritten by this middleware. */
const EXEMPT_PREFIXES = [
  "/api/",
  "/_build/",
  "/_server/",
  "/assets/",
  "/@",
];

/** File extensions that are static assets — leave them alone. */
const ASSET_EXT = /\.(?:png|jpe?g|gif|svg|webp|avif|ico|css|js|mjs|map|woff2?|ttf|otf|xml|txt|json|pdf)$/i;

export interface CanonicalDecision {
  redirect: boolean;
  location?: string;
}

/**
 * Pure — decides whether a URL should redirect and, if so, to where.
 * Exported for unit-testing without spinning up a request.
 */
export function canonicalizeUrl(input: string): CanonicalDecision {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return { redirect: false };
  }

  const originalPath = url.pathname;

  // Skip exempt namespaces.
  if (EXEMPT_PREFIXES.some((p) => originalPath.startsWith(p))) {
    return { redirect: false };
  }
  if (ASSET_EXT.test(originalPath)) {
    return { redirect: false };
  }

  let path = originalPath;

  // 1. Legacy alias — check BEFORE case-lowering so the map matches
  //    lowercase keys either way.
  const lower = path.toLowerCase();
  const alias = LEGACY_ALIASES[lower] ?? LEGACY_ALIASES[lower.replace(/\/$/, "")];
  if (alias) path = alias;
  else path = lower === path ? path : lower;

  // 2. Strip trailing slash (except root).
  if (path.length > 1 && path.endsWith("/")) {
    path = path.replace(/\/+$/, "");
  }

  // 3. Collapse duplicate slashes: `/a//b` -> `/a/b`.
  path = path.replace(/\/{2,}/g, "/");

  if (path === originalPath) return { redirect: false };

  const location = path + url.search + url.hash;
  return { redirect: true, location };
}
