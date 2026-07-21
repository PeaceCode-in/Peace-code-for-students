import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/breathe")({
  
  head: () => ({
    meta: [
      { title: "Breathe — techniques that regulate you — PeaceCode" },
      { name: "description", content: "Box breathing, 4-7-8, coherent breathing and more. Simple, guided, real-time." },
      { property: "og:title", content: "Breathe — techniques that regulate you — PeaceCode" },
      { property: "og:description", content: "Box breathing, 4-7-8, coherent breathing and more. Simple, guided, real-time." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/breathe" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Breathe — techniques that regulate you — PeaceCode" },
      { name: "twitter:description", content: "Box breathing, 4-7-8, coherent breathing and more. Simple, guided, real-time." },
    ],
    links: [{ rel: "canonical", href: "/breathe" }],
  }),
component: () => <Outlet />,
});
