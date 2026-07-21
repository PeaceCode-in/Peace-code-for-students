import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/gratitude")({
  
  head: () => ({
    meta: [
      { title: "Gratitude — small notes, big shift — PeaceCode" },
      { name: "description", content: "One line of thanks a day. Watch your forest grow." },
      { property: "og:title", content: "Gratitude — small notes, big shift — PeaceCode" },
      { property: "og:description", content: "One line of thanks a day. Watch your forest grow." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/gratitude" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gratitude — small notes, big shift — PeaceCode" },
      { name: "twitter:description", content: "One line of thanks a day. Watch your forest grow." },
    ],
    links: [{ rel: "canonical", href: "/gratitude" }],
  }),
component: () => <Outlet />,
});
