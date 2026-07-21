import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ScreeningFX } from "@/components/screening/ScreeningFX";

export const Route = createFileRoute("/screening")({
  
  head: () => ({
    meta: [
      { title: "Mental health screening — PeaceCode" },
      { name: "description", content: "Clinically-validated screeners (PHQ-9, GAD-7, more) with private, AI-explained results." },
      { property: "og:title", content: "Mental health screening — PeaceCode" },
      { property: "og:description", content: "Clinically-validated screeners (PHQ-9, GAD-7, more) with private, AI-explained results." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/screening" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Mental health screening — PeaceCode" },
      { name: "twitter:description", content: "Clinically-validated screeners (PHQ-9, GAD-7, more) with private, AI-explained results." },
    ],
    links: [{ rel: "canonical", href: "/screening" }],
  }),
component: ScreeningLayout,
});

function ScreeningLayout() {
  return (
    <>
      <ScreeningFX />
      <Outlet />
    </>
  );
}
