import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/focus")({
  
  head: () => ({
    meta: [
      { title: "Focus — deep-work sessions for students — PeaceCode" },
      { name: "description", content: "Pomodoro timers, ambient soundscapes, and a distraction-free canvas built for study." },
      { property: "og:title", content: "Focus — deep-work sessions for students — PeaceCode" },
      { property: "og:description", content: "Pomodoro timers, ambient soundscapes, and a distraction-free canvas built for study." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/focus" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Focus — deep-work sessions for students — PeaceCode" },
      { name: "twitter:description", content: "Pomodoro timers, ambient soundscapes, and a distraction-free canvas built for study." },
    ],
    links: [{ rel: "canonical", href: "/focus" }],
  }),
component: () => <Outlet />,
});
