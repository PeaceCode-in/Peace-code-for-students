import type { Author, Resource } from "@/lib/resources-store";
import { authorJsonLdNode } from "./AuthorJsonLd";

const ORIGIN = "https://app.peacecode.in";

/**
 * Article JSON-LD for a resource detail page.
 *
 * Wires author + optional medical reviewer as full `Person`/`Physician`
 * nodes (not bare name strings) so Google can attribute the article to
 * a real, verifiable expert — the strongest E-E-A-T signal available in
 * structured data. Publisher references the sitewide Organization node
 * declared in `__root.tsx` via `@id` so the graph deduplicates.
 *
 * Uses `MedicalScholarlyArticle` when the resource has been reviewed by
 * a clinician (MD/psychiatrist/psychologist); otherwise a plain `Article`.
 */
export function ArticleJsonLd({
  resource,
  author,
  reviewer,
}: {
  resource: Resource;
  author: Author;
  reviewer?: Author;
}) {
  const url = `${ORIGIN}/resources/r/${resource.id}`;
  const type = reviewer ? "MedicalScholarlyArticle" : "Article";

  const authorNode = authorJsonLdNode(author);
  const reviewerNode = reviewer ? authorJsonLdNode(reviewer) : undefined;

  const doc: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: resource.title,
    description: resource.description,
    articleSection: resource.category,
    keywords: resource.tags.join(", "),
    inLanguage: resource.language === "Hindi" ? "hi-IN" : "en-IN",
    datePublished: resource.publishedAt,
    dateModified: resource.updatedAt ?? resource.publishedAt,
    wordCount: resource.body ? resource.body.split(/\s+/).length : undefined,
    timeRequired: `PT${Math.max(1, resource.minutes)}M`,
    author: authorNode,
    publisher: { "@id": `${ORIGIN}/#organization` },
    isPartOf: { "@id": `${ORIGIN}/#website` },
    url,
  };

  if (reviewerNode) {
    doc.reviewedBy = reviewerNode;
    doc.lastReviewed = resource.reviewedAt ?? resource.updatedAt ?? resource.publishedAt;
  }

  // MedicalScholarlyArticle wants a medicineSystem + audience for rich-result eligibility.
  if (type === "MedicalScholarlyArticle") {
    doc.medicineSystem = "https://schema.org/WesternConventional";
    doc.audience = { "@type": "PeopleAudience", audienceType: "Students" };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(doc) }}
    />
  );
}
