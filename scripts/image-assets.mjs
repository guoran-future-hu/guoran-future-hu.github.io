import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../assets/images/", import.meta.url));
const target = fileURLToPath(
  new URL("../public/assets/images/", import.meta.url),
);

// This directory is generated. Replacing it also removes stale deleted images.
export function imageAssets() {
  return {
    name: "image-assets",
    hooks: {
      "astro:config:setup": () => {
        rmSync(target, { recursive: true, force: true });
        mkdirSync(target, { recursive: true });
        cpSync(source, target, { recursive: true });
      },
    },
  };
}

export function watchImageAssets() {
  return {
    name: "watch-image-assets",
    configureServer(server) {
      server.watcher.add(source);
      const syncImage = (event, file) => {
        if (!["add", "change", "unlink"].includes(event)) return;
        const imagePath = relative(source, file);
        if (!imagePath || imagePath.startsWith("..") || isAbsolute(imagePath))
          return;

        const output = resolve(target, imagePath);
        if (event === "unlink") {
          rmSync(output, { force: true });
        } else {
          mkdirSync(dirname(output), { recursive: true });
          cpSync(file, output);
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("all", syncImage);
      server.httpServer?.once("close", () =>
        server.watcher.off("all", syncImage),
      );
    },
  };
}
