// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Runs the SEO metadata validator at the start of every production build.
 * Fails the build if any leaf route is missing required tags or exceeds
 * length limits. Skipped in dev to keep HMR snappy.
 */
function seoCheckPlugin() {
  return {
    name: "peacecode-seo-check",
    apply: "build",
    buildStart() {
      const script = path.join(__dirname, "scripts/seo-check.mjs");
      const result = spawnSync(process.execPath, [script], {
        stdio: "inherit",
        env: process.env,
      });
      if (result.status !== 0) {
        this.error(
          "SEO metadata check failed. Fix the issues above or run `node scripts/seo-check.mjs` locally.",
        );
      }
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [seoCheckPlugin()],
  },
});
