import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ResourcesFX } from "@/components/resources/ResourcesFX";

export const Route = createFileRoute("/resources")({
  
  head: () => ({
    meta: [
      { title: "Resources — PeaceCode" },
      { name: "description", content: "A calm library of articles, audios, and worksheets for every kind of hard day." },
      { property: "og:title", content: "Resources — PeaceCode" },
      { property: "og:description", content: "A calm library of articles, audios, and worksheets for every kind of hard day." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/resources" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Resources — PeaceCode" },
      { name: "twitter:description", content: "A calm library of articles, audios, and worksheets for every kind of hard day." },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
component: ResourcesLayout,
});

function ResourcesLayout() {
  return (
    <>
      <ResourcesFX />
      <Outlet />
    </>
  );
}
