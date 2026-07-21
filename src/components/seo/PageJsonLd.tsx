import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

/**
 * Emits a route-specific WebPage-family JSON-LD node keyed off the pathname
 * prefix. One component covers every route in the sitemap so search engines
 * see a distinct, correctly-typed schema on each page without touching
 * ~200 individual route files.
 *
 * BreadcrumbList and sitewide Organization/WebSite live in their own
 * emitters — this file only owns the primary page type.
 */

const ORIGIN = "https://app.peacecode.in";

// Human labels reused for `name` when the route hasn't set a distinct title.
const SECTION_LABELS: Record<string, string> = {
  peacebot: "PeaceBot AI Companion",
  mindgym: "Mind Gym",
  breathe: "Breathe",
  focus: "Focus",
  journal: "Journal",
  gratitude: "Gratitude",
  screening: "Mental Health Screening",
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
  emergency: "Emergency Support",
  auth: "Sign in",
};

function pretty(seg: string) {
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type SchemaShape = {
  type: string;
  extras?: Record<string, unknown>;
};

/**
 * Route → schema.org @type. Each choice matches Google's rich-result
 * guidelines for that content family; unknown paths fall back to WebPage.
 */
function schemaForPath(pathname: string): SchemaShape {
  const parts = pathname.split("/").filter(Boolean);
  const root = parts[0] ?? "";
  const leaf = parts[parts.length - 1] ?? "";

  // Home
  if (parts.length === 0) {
    return {
      type: "WebPage",
      extras: {
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${ORIGIN}/api/og/home.svg`,
        },
      },
    };
  }

  // Sign-in / auth is a login page.
  if (root === "auth") return { type: "WebPage", extras: { isAccessibleForFree: true } };

  // Emergency & crisis support → medical guidance.
  if (root === "emergency" || root === "sos") {
    return {
      type: "MedicalWebPage",
      extras: {
        audience: { "@type": "PeopleAudience", audienceType: "Students in crisis" },
        specialty: { "@type": "MedicalSpecialty", name: "Psychiatry" },
      },
    };
  }

  // AI companion.
  if (root === "peacebot") {
    if (leaf === "insights" || leaf === "mental")
      return { type: "MedicalWebPage" };
    return {
      type: "WebApplication",
      extras: {
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      },
    };
  }

  // Counselling & bookings.
  if (root === "counselling") {
    if (leaf === "book" || parts.includes("book"))
      return { type: "ReservationPackage" };
    if (leaf === "index" || parts.length === 1)
      return {
        type: "MedicalBusiness",
        extras: {
          medicalSpecialty: "Psychiatry",
          priceRange: "₹₹",
          areaServed: "IN",
        },
      };
    return { type: "MedicalWebPage" };
  }

  // Screening = clinical assessment.
  if (root === "screening") {
    return {
      type: "MedicalWebPage",
      extras: {
        about: { "@type": "MedicalCondition", name: "Mental health screening" },
      },
    };
  }

  // Breathe / focus / meditation → HowTo.
  if (root === "breathe" || root === "focus" || root === "sanctum") {
    return {
      type: "HowTo",
      extras: {
        totalTime: "PT5M",
        tool: { "@type": "HowToTool", name: "PeaceCode" },
      },
    };
  }

  // Mind gym content collections.
  if (root === "mindgym") {
    if (leaf === "library" || parts.includes("library"))
      return { type: "CollectionPage" };
    return { type: "LearningResource", extras: { learningResourceType: "Interactive activity" } };
  }

  // Journal & gratitude entries → creative work.
  if (root === "journal" || root === "gratitude") {
    return { type: "CreativeWork", extras: { genre: "Personal reflection" } };
  }

  // Resources → articles / collections.
  if (root === "resources") {
    if (parts.length === 1 || leaf === "index") return { type: "CollectionPage" };
    if (parts[1] === "c" || parts[1] === "author") return { type: "CollectionPage" };
    return { type: "Article", extras: { articleSection: "Mental health" } };
  }

  // Community feeds.
  if (root === "community" || root === "buddies") {
    if (parts.length === 1 || leaf === "index" || leaf === "browse")
      return { type: "CollectionPage" };
    return { type: "DiscussionForumPosting" };
  }

  // Events.
  if (root === "events") {
    if (parts.length === 1 || leaf === "index") return { type: "CollectionPage" };
    return {
      type: "Event",
      extras: {
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      },
    };
  }

  // Profile pages.
  if (root === "profile") return { type: "ProfilePage" };

  // Search results page.
  if (root === "search") return { type: "SearchResultsPage" };

  // Product hub / marketing surfaces.
  if (root === "hub") return { type: "AboutPage" };

  // Settings, notifications, hub, misc.
  if (root === "settings" || root === "notifications") return { type: "WebPage" };

  return { type: "WebPage" };
}

function nameForPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return "PeaceCode — Student mental wellness";
  const [root, ...rest] = parts;
  const section = SECTION_LABELS[root] ?? pretty(root);
  if (!rest.length) return `${section} — PeaceCode`;
  const leaf = rest[rest.length - 1];
  const isId = /^[0-9]+$/.test(leaf) || /^[0-9a-f-]{8,}$/i.test(leaf);
  const leafLabel = isId ? "Detail" : pretty(leaf);
  return `${leafLabel} · ${section} — PeaceCode`;
}

/** Skip noisy leaves that shouldn't be indexed. */
function shouldSkip(pathname: string): boolean {
  if (!pathname) return true;
  // Never emit for dynamic id segments — head() already marks them noindex.
  if (pathname.includes("/$")) return true;
  return false;
}

export function PageJsonLd() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const json = useMemo(() => {
    if (shouldSkip(pathname)) return null;
    const shape = schemaForPath(pathname);
    const url = `${ORIGIN}${pathname === "/" ? "/" : pathname}`;
    const slug = pathname === "/" ? "home" : pathname.replace(/^\//, "");
    const image = `${ORIGIN}/api/og/${slug}.svg`;

    return {
      "@context": "https://schema.org",
      "@type": shape.type,
      "@id": `${url}#page`,
      url,
      name: nameForPath(pathname),
      inLanguage: "en-IN",
      isPartOf: { "@id": `${ORIGIN}/#website` },
      publisher: { "@id": `${ORIGIN}/#organization` },
      image,
      ...(shape.extras ?? {}),
    };
  }, [pathname]);

  if (!json) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
