import { defineConfig } from "astro/config";
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Keep the original image paths working without moving the Markdown or its assets.
function legacyImages() {
  return {
    name: "legacy-images",
    hooks: {
      "astro:config:setup": () => {
        mkdirSync(new URL("./public/assets/images/", import.meta.url), {
          recursive: true,
        });
        cpSync(
          new URL("./assets/images/", import.meta.url),
          new URL("./public/assets/images/", import.meta.url),
          { recursive: true },
        );
      },
    },
  };
}

export default defineConfig({
  site: "https://guoran-future-hu.github.io",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  integrations: [legacyImages()],
  vite: {
    plugins: [
      {
        name: "watch-legacy-images",
        configureServer(server) {
          const source = fileURLToPath(
            new URL("./assets/images/", import.meta.url),
          );
          const target = fileURLToPath(
            new URL("./public/assets/images/", import.meta.url),
          );
          server.watcher.add(source);
          const sync = (event, file) => {
            const path = relative(source, file);
            if (
              !path ||
              path.startsWith("..") ||
              isAbsolute(path) ||
              !["add", "change", "unlink"].includes(event)
            )
              return;
            const output = resolve(target, path);
            if (event === "unlink") rmSync(output, { force: true });
            else {
              mkdirSync(dirname(output), { recursive: true });
              cpSync(file, output);
            }
            server.ws.send({ type: "full-reload" });
          };
          server.watcher.on("all", sync);
          server.httpServer?.once("close", () =>
            server.watcher.off("all", sync),
          );
        },
      },
    ],
  },
  redirects: {
    "/blogs/General-puepose-skill/": "/blogs/General-purpose-skill/",
  },
});
