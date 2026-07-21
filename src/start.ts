import { createStart, createMiddleware } from "@tanstack/react-start";

import { canonicalizeUrl } from "./lib/canonical-url";
import { renderErrorPage } from "./lib/error-page";

/**
 * Issues 301 redirects for non-canonical URLs (trailing slash, uppercase
 * segments, legacy aliases). Runs before every other request middleware so
 * downstream handlers only ever see canonical paths.
 */
const canonicalRedirectMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    if (request.method === "GET" || request.method === "HEAD") {
      const decision = canonicalizeUrl(request.url);
      if (decision.redirect && decision.location) {
        return new Response(null, {
          status: 301,
          headers: {
            location: decision.location,
            "cache-control": "public, max-age=3600",
          },
        });
      }
    }
    return next();
  },
);

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [canonicalRedirectMiddleware, errorMiddleware],
}));
