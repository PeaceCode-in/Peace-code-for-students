import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

const ORIGIN = "https://app.peacecode.in";

// Human labels for the first path segment. Deeper segments are title-cased.
const SECTION_LABELS: Record<string, string> = {
  peacebot: "PeaceBot",
  mindgym: "Mind Gym",
  breathe: "Breathe",
  focus: "Focus",
  journal: "Journal",
  gratitude: "Gratitude",
  screening: "Screening",
  buddies: "Peace Buddies",
  counselling: "Counselling",
  community: "Community",
  events: "Events",
  resources: "Resources",
  hub: "Product Hub",
  profile: "Profile",
  notifications: "Notifications",
  settings: "Settings",
  search: "Search",
  emergency: "Emergency",
  auth: "Sign in",
};

function pretty(seg: string) {
  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Emits a BreadcrumbList JSON-LD script derived from the current pathname.
 * Skipped on the home route (nothing meaningful to break down).
 * Segments starting with "$" or looking like an ID (all digits / uuid) are
 * skipped from labels but still contribute to the position count.
 */
export function BreadcrumbJsonLd() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const json = useMemo(() => {
    if (!pathname || pathname === "/") return null;
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return null;

    const items: Array<Record<string, unknown>> = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${ORIGIN}/`,
      },
    ];
    let acc = "";
    parts.forEach((raw, i) => {
      acc += `/${raw}`;
      // Skip labelling opaque IDs but keep the crumb for correct position.
      const isId = /^[0-9]+$/.test(raw) || /^[0-9a-f-]{8,}$/i.test(raw);
      const name =
        i === 0 ? SECTION_LABELS[raw] ?? pretty(raw) : isId ? pretty(raw.slice(0, 6)) : pretty(raw);
      items.push({
        "@type": "ListItem",
        position: i + 2,
        name,
        item: `${ORIGIN}${acc}`,
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    };
  }, [pathname]);

  if (!json) return null;
  return (
    <script
      type="application/ld+json"
      // Static string per pathname, safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
