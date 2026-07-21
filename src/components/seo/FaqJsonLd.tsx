/**
 * FAQPage JSON-LD emitter.
 *
 * Renders a schema.org FAQPage node whose mainEntity is an array of
 * Question nodes with acceptedAnswer objects. Only mount on pages whose
 * visible content actually contains the same Q&A pairs — Google will
 * penalize FAQPage markup that doesn't match rendered text.
 *
 * Example:
 *
 *   <FaqJsonLd items={[
 *     { q: "Is this a diagnosis?", a: "No. It's a screening tool..." },
 *     { q: "Where does my data go?", a: "By default, only to this device." },
 *   ]} />
 */

type Item = { q: string; a: string };

export function FaqJsonLd({ items }: { items: ReadonlyArray<Item> }) {
  if (!items || items.length === 0) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
