# Future Hu — personal website

A custom Astro site for Guoran Hu’s writing, projects, and research. The original blog Markdown is preserved in `_posts/`.

## Local preview

Install Node.js 22.12 or newer, then run from the project folder:

```sh
npm install
npm run dev
```

Open **http://localhost:4000**. Saved changes reload automatically. On Windows PowerShell, use `npm.cmd` if PowerShell blocks `npm.ps1`. In Git Bash, you can also run `bash run-local.sh`.

## Editing

- **Page copy:** `src/pages/index.astro`, `src/pages/about/index.astro`, `src/pages/blogs/index.astro`, `src/pages/projects/index.astro`, and `src/pages/neurodivergent/index.astro`.
- **Navigation:** `src/lib/site.ts`; the sitemap uses the same entries. The site's canonical URL is configured in `astro.config.mjs`.
- **Education / experience:** `src/components/ExperienceTimeline.astro`, shared by Home and About.
- **Design:** `src/styles/global.css`; shared navigation and footer in `src/layouts/Site.astro`.
- **Essays:** add Markdown to `_posts/YYYY-MM-DD-slug.md` with a title and date in YAML front matter. Existing posts do not need conversion. Their old `/blogs/slug/` URLs and figure includes still work.
- **Projects:** Markdown in `_projects/`. Optional card titles, images, link labels, and ordering live in `src/lib/projects.ts`. New projects fall back to their Markdown title and `header.og_image`, or a text cover when no image is provided. Lower `order` values appear first; unconfigured projects follow in date order.
- **Writing summaries / topic labels:** `src/lib/editorial.ts`. These override Markdown excerpts without editing the articles. Parsing, figure conversion, dates, and generated article URLs live in `src/lib/content.ts`.
- **Images:** `assets/images/`; copied into `public/assets/images/` automatically by `scripts/image-assets.mjs`. Keep using `/assets/images/filename` links. The public copy is replaced at startup and build time, and individual edits are synchronized during development.

The main pages, navigation, search, filters, article tables of contents, and RSS use the same content source. The search filters titles, topic labels, and summaries. Fonts are self-hosted.

## Verify & build

```sh
npm run check
npm run build
npm run preview
```

The generated static site is in `dist/`. No Ruby, Jekyll, database, or server runtime is required.

Use `npm run format` to format code and `npm run format:check` to check formatting. The formatter excludes article Markdown, assets, and generated files so it does not reflow authored content.

For browser regression checks, install the test browser once with `npx playwright install chromium`, start the preview, then run `npm test`. Set `SITE_URL` if the preview uses a port other than 4000. Set `PLAYWRIGHT_EXECUTABLE_PATH` to use an installed Chrome executable instead. Checks discover pages from the sitemap and cover four screen widths, links, images, search, filters, and sharing.

Screenshots are opt-in: use `SCREENSHOTS=1 npm test` in Bash, or `$env:SCREENSHOTS = '1'; npm.cmd test` in PowerShell. They are written to `.validation/`; remove that directory after inspection.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys the site on pushes to `master` or `main`. In the GitHub repository, set **Settings → Pages → Source → GitHub Actions** once before deploying. Changes made locally are not published until pushed.

The site uses Astro only. `_posts/` and `_projects/` are active Markdown content directories; figure includes in existing essays are handled by the Astro content loader. `LICENSE` retains the original theme attribution.
