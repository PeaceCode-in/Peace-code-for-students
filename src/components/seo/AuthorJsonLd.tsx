import type { Author } from "@/lib/resources-store";

const ORIGIN = "https://app.peacecode.in";

/**
 * Person-family JSON-LD for a resource author or medical reviewer.
 *
 * Emits schema.org `Person`, `Physician`, or `Psychologist` depending on
 * `author.role`, with credentials, qualifications, affiliation and
 * `sameAs` links so search engines can attribute E-E-A-T to a real,
 * verifiable expert.
 *
 * Every emitted node carries a stable `@id` (`${ORIGIN}/resources/author/{id}#person`)
 * so `Article.author` and `Article.reviewedBy` references resolve into
 * a single Person entity in the crawler's graph.
 */

export function authorJsonLdNode(a: Author): Record<string, unknown> {
  const profileUrl = `${ORIGIN}/resources/author/${a.id}`;
  const role = a.role ?? (a.credentials?.match(/\bMD\b|MBBS/i) ? "Physician" : "Person");

  const credentialNodes = (a.qualifications ?? []).map((q) => ({
    "@type": "EducationalOccupationalCredential",
    name: q,
  }));

  const worksFor = a.affiliation
    ? { "@type": "Organization", name: a.affiliation }
    : undefined;

  const sameAs = (a.sameAs ?? []).filter((u) => /^https?:\/\//i.test(u));

  return {
    "@type": role,
    "@id": `${profileUrl}#person`,
    name: a.name,
    jobTitle: a.title,
    description: a.bio,
    url: profileUrl,
    ...(a.credentials ? { hasCredential: [{ "@type": "EducationalOccupationalCredential", name: a.credentials }, ...credentialNodes] } : credentialNodes.length ? { hasCredential: credentialNodes } : {}),
    ...(worksFor ? { worksFor, affiliation: worksFor } : {}),
    ...(a.specialty && role === "Physician" ? { medicalSpecialty: a.specialty } : {}),
    ...(a.yearsExperience ? { knowsAbout: a.topics } : { knowsAbout: a.topics }),
    ...(sameAs.length ? { sameAs } : {}),
    publishingPrinciples: `${ORIGIN}/settings/support`,
  };
}

/**
 * Full ProfilePage document for `/resources/author/:id`. Wraps the Person
 * node in a `ProfilePage` and links back to the sitewide Organization.
 */
export function AuthorJsonLd({ author }: { author: Author }) {
  const profileUrl = `${ORIGIN}/resources/author/${author.id}`;
  const person = authorJsonLdNode(author);

  const doc = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${profileUrl}#page`,
    url: profileUrl,
    name: `${author.name} — PeaceCode`,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${ORIGIN}/#website` },
    publisher: { "@id": `${ORIGIN}/#organization` },
    mainEntity: person,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(doc) }}
    />
  );
}
