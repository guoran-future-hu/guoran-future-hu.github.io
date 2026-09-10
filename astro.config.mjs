import { defineConfig } from "astro/config";
import { imageAssets, watchImageAssets } from "./scripts/image-assets.mjs";

export default defineConfig({
  site: "https://guoran-future-hu.github.io",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  integrations: [imageAssets()],
  vite: { plugins: [watchImageAssets()] },
  redirects: {
    "/blogs/General-puepose-skill/": "/blogs/General-purpose-skill/",
  },
});
