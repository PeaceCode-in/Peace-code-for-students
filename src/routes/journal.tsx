import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/journal")({
  
  head: () => ({
    meta: [
      { title: "Journal — a private place for your day — PeaceCode" },
      { name: "description", content: "Write, whisper, or voice-note. End-to-end private. Yours, always." },
      { property: "og:title", content: "Journal — a private place for your day — PeaceCode" },
      { property: "og:description", content: "Write, whisper, or voice-note. End-to-end private. Yours, always." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/journal" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Journal — a private place for your day — PeaceCode" },
      { name: "twitter:description", content: "Write, whisper, or voice-note. End-to-end private. Yours, always." },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
component: () => <Outlet />,
});
