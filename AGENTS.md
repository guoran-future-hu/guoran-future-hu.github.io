# Working on this site

Read the editing map in `README.md` before changing page structure, content loading,
images, or deployment. This is a static Astro site; Node commands are in `package.json`.

- Reread affected files and `git diff` first: the owner edits copy and typography directly.
- Preserve existing copy, URLs, palette, and layout during maintenance unless asked to change them.
- Keep page copy in `src/pages/`, essays in `_posts/`, and project articles in `_projects/`.
  Display overrides live in `src/lib/editorial.ts` and `src/lib/projects.ts`.
- Prefer direct Astro markup and small named functions. Extract shared behavior or independently
  maintained data; avoid adding wrappers for single-use text.
- Edit images in `assets/images/`. `public/assets/images/`, `dist/`, and `.astro/` are generated.
- Preserve UTF-8. On Windows use `npm.cmd` when PowerShell blocks `npm.ps1`.
- For code changes run `npm run format:check`, `npm run check`, and `npm run build`.
  For layout, navigation, or browser behavior changes also run `npm test` against a local server.
  Use `SCREENSHOTS=1` when visual inspection is needed; remove `.validation/` afterward.
- Adding a page means adding its navigation entry in `src/lib/site.ts`; the sitemap and
  browser route checks pick it up automatically. Markdown detail pages are discovered automatically.
- Keep `package-lock.json` synchronized with dependency edits. Deployments use `npm ci`.
