import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Canonical origin for the student app. Update if the app is served elsewhere.
const BASE_URL = "https://app.peacecode.in";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Curated set of indexable surfaces. Emergency, auth, and per-conversation
// routes are intentionally omitted — they carry `noindex` or contain private
// state that must not appear in search results.
const ENTRIES: SitemapEntry[] = [
  // Landing / dashboard shell
  { path: "/", changefreq: "daily", priority: "1.0" },

  // PeaceBot AI companion
  { path: "/peacebot", changefreq: "weekly", priority: "0.9" },
  { path: "/peacebot/insights", changefreq: "weekly", priority: "0.7" },
  { path: "/peacebot/memory", changefreq: "monthly", priority: "0.6" },
  { path: "/peacebot/mental", changefreq: "weekly", priority: "0.7" },
  { path: "/peacebot/prompts", changefreq: "weekly", priority: "0.7" },
  { path: "/peacebot/tools", changefreq: "weekly", priority: "0.6" },
  { path: "/peacebot/voice", changefreq: "monthly", priority: "0.6" },
  { path: "/peacebot/avatar", changefreq: "monthly", priority: "0.5" },
  { path: "/peacebot/settings", changefreq: "monthly", priority: "0.4" },

  // Mind Gym
  { path: "/mindgym", changefreq: "weekly", priority: "0.9" },
  { path: "/mindgym/library", changefreq: "weekly", priority: "0.8" },
  { path: "/mindgym/paths", changefreq: "weekly", priority: "0.8" },
  { path: "/mindgym/streak", changefreq: "daily", priority: "0.6" },
  { path: "/mindgym/brain-dna", changefreq: "monthly", priority: "0.7" },

  // Breathing
  { path: "/breathe", changefreq: "weekly", priority: "0.9" },
  { path: "/breathe/stats", changefreq: "weekly", priority: "0.6" },

  // Focus
  { path: "/focus", changefreq: "weekly", priority: "0.8" },

  // Journal
  { path: "/journal", changefreq: "weekly", priority: "0.8" },
  { path: "/journal/memories", changefreq: "weekly", priority: "0.7" },
  { path: "/journal/voice", changefreq: "monthly", priority: "0.6" },

  // Gratitude
  { path: "/gratitude", changefreq: "weekly", priority: "0.8" },
  { path: "/gratitude/forest", changefreq: "weekly", priority: "0.7" },
  { path: "/gratitude/tree", changefreq: "weekly", priority: "0.6" },
  { path: "/gratitude/wall", changefreq: "weekly", priority: "0.7" },
  { path: "/gratitude/history", changefreq: "weekly", priority: "0.5" },

  // Screening & assessments
  { path: "/screening", changefreq: "weekly", priority: "0.9" },
  { path: "/screening/library", changefreq: "weekly", priority: "0.8" },
  { path: "/screening/resources", changefreq: "weekly", priority: "0.7" },
  { path: "/screening/history", changefreq: "weekly", priority: "0.5" },
  { path: "/screening/settings", changefreq: "monthly", priority: "0.4" },

  // Peace Buddies
  { path: "/buddies", changefreq: "weekly", priority: "0.9" },
  { path: "/buddies/browse", changefreq: "daily", priority: "0.8" },
  { path: "/buddies/psychologists", changefreq: "weekly", priority: "0.8" },
  { path: "/buddies/groups", changefreq: "weekly", priority: "0.7" },
  { path: "/buddies/about", changefreq: "monthly", priority: "0.6" },
  { path: "/buddies/history", changefreq: "weekly", priority: "0.4" },
  { path: "/buddies/settings", changefreq: "monthly", priority: "0.4" },

  // Counselling
  { path: "/counselling", changefreq: "weekly", priority: "0.9" },
  { path: "/counselling/experts", changefreq: "weekly", priority: "0.8" },
  { path: "/counselling/upcoming", changefreq: "daily", priority: "0.7" },
  { path: "/counselling/my", changefreq: "daily", priority: "0.7" },
  { path: "/counselling/history", changefreq: "weekly", priority: "0.5" },
  { path: "/counselling/messages", changefreq: "daily", priority: "0.6" },
  { path: "/counselling/homework", changefreq: "weekly", priority: "0.6" },
  { path: "/counselling/assessments", changefreq: "weekly", priority: "0.7" },
  { path: "/counselling/reports", changefreq: "weekly", priority: "0.6" },
  { path: "/counselling/resources", changefreq: "weekly", priority: "0.7" },
  { path: "/counselling/documents", changefreq: "weekly", priority: "0.5" },
  { path: "/counselling/wellness", changefreq: "weekly", priority: "0.6" },
  { path: "/counselling/medication", changefreq: "weekly", priority: "0.5" },
  { path: "/counselling/billing", changefreq: "monthly", priority: "0.4" },
  { path: "/counselling/settings", changefreq: "monthly", priority: "0.4" },

  // Community
  { path: "/community", changefreq: "daily", priority: "0.9" },
  { path: "/community/circles", changefreq: "daily", priority: "0.8" },
  { path: "/community/threads", changefreq: "daily", priority: "0.8" },
  { path: "/community/rooms", changefreq: "daily", priority: "0.7" },
  { path: "/community/new", changefreq: "monthly", priority: "0.4" },

  // Events
  { path: "/events", changefreq: "daily", priority: "0.9" },
  { path: "/events/browse", changefreq: "daily", priority: "0.8" },
  { path: "/events/categories", changefreq: "weekly", priority: "0.7" },
  { path: "/events/calendar", changefreq: "daily", priority: "0.7" },
  { path: "/events/my", changefreq: "daily", priority: "0.6" },
  { path: "/events/bookmarks", changefreq: "weekly", priority: "0.5" },
  { path: "/events/achievements", changefreq: "weekly", priority: "0.5" },

  // Resources
  { path: "/resources", changefreq: "weekly", priority: "0.9" },
  { path: "/resources/library", changefreq: "weekly", priority: "0.8" },
  { path: "/resources/categories", changefreq: "weekly", priority: "0.7" },
  { path: "/resources/collections", changefreq: "weekly", priority: "0.7" },
  { path: "/resources/playlists", changefreq: "weekly", priority: "0.7" },
  { path: "/resources/search", changefreq: "weekly", priority: "0.6" },
  { path: "/resources/downloads", changefreq: "weekly", priority: "0.4" },
  { path: "/resources/history", changefreq: "weekly", priority: "0.4" },
  { path: "/resources/achievements", changefreq: "weekly", priority: "0.5" },

  // Product Hub
  { path: "/hub", changefreq: "weekly", priority: "0.7" },
  { path: "/hub/announcements", changefreq: "weekly", priority: "0.7" },
  { path: "/hub/whats-new", changefreq: "weekly", priority: "0.7" },
  { path: "/hub/roadmap", changefreq: "weekly", priority: "0.7" },
  { path: "/hub/feature-requests", changefreq: "weekly", priority: "0.6" },
  { path: "/hub/integrations", changefreq: "monthly", priority: "0.6" },
  { path: "/hub/themes", changefreq: "monthly", priority: "0.6" },
  { path: "/hub/customize", changefreq: "monthly", priority: "0.5" },
  { path: "/hub/beta", changefreq: "monthly", priority: "0.5" },
  { path: "/hub/search", changefreq: "weekly", priority: "0.4" },

  // Profile
  { path: "/profile", changefreq: "weekly", priority: "0.6" },
  { path: "/profile/journey", changefreq: "weekly", priority: "0.6" },
  { path: "/profile/garden", changefreq: "weekly", priority: "0.6" },
  { path: "/profile/stats", changefreq: "weekly", priority: "0.5" },
  { path: "/profile/achievements", changefreq: "weekly", priority: "0.5" },
  { path: "/profile/activity", changefreq: "daily", priority: "0.5" },
  { path: "/profile/friends", changefreq: "weekly", priority: "0.5" },
  { path: "/profile/bookmarks", changefreq: "weekly", priority: "0.4" },
  { path: "/profile/themes", changefreq: "monthly", priority: "0.4" },
  { path: "/profile/edit", changefreq: "monthly", priority: "0.3" },
  { path: "/profile/privacy", changefreq: "monthly", priority: "0.3" },

  // Search
  { path: "/search", changefreq: "weekly", priority: "0.5" },

  // Notifications
  { path: "/notifications", changefreq: "daily", priority: "0.5" },
  { path: "/notifications/inbox", changefreq: "daily", priority: "0.5" },
  { path: "/notifications/bookmarks", changefreq: "weekly", priority: "0.4" },
  { path: "/notifications/history", changefreq: "weekly", priority: "0.3" },
  { path: "/notifications/archive", changefreq: "weekly", priority: "0.3" },
  { path: "/notifications/settings", changefreq: "monthly", priority: "0.3" },

  // Settings
  { path: "/settings", changefreq: "monthly", priority: "0.4" },
  { path: "/settings/profile", changefreq: "monthly", priority: "0.4" },
  { path: "/settings/appearance", changefreq: "monthly", priority: "0.4" },
  { path: "/settings/accessibility", changefreq: "monthly", priority: "0.4" },
  { path: "/settings/notifications", changefreq: "monthly", priority: "0.4" },
  { path: "/settings/privacy", changefreq: "monthly", priority: "0.4" },
  { path: "/settings/community", changefreq: "monthly", priority: "0.3" },
  { path: "/settings/breathing", changefreq: "monthly", priority: "0.3" },
  { path: "/settings/journal", changefreq: "monthly", priority: "0.3" },
  { path: "/settings/peacebot", changefreq: "monthly", priority: "0.3" },
  { path: "/settings/resources", changefreq: "monthly", priority: "0.3" },
  { path: "/settings/emergency", changefreq: "monthly", priority: "0.3" },
  { path: "/settings/connected", changefreq: "monthly", priority: "0.3" },
  { path: "/settings/data", changefreq: "monthly", priority: "0.3" },
  { path: "/settings/support", changefreq: "monthly", priority: "0.4" },
  { path: "/settings/about", changefreq: "monthly", priority: "0.4" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const lastmod = new Date().toISOString().slice(0, 10);
        const urls = ENTRIES.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            `    <lastmod>${lastmod}</lastmod>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
