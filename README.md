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

- **Homepage / About:** `src/pages/index.astro` and `src/pages/about/index.astro`.
- **Design:** `src/styles/global.css`; shared navigation and footer in `src/layouts/Site.astro`.
- **Essays:** add Markdown to `_posts/YYYY-MM-DD-slug.md` with a title and date in YAML front matter. Existing posts do not need conversion. Their old `/blogs/slug/` URLs and figure includes still work.
- **Projects:** Markdown in `_projects/`.
- **Writing summaries / topic labels:** `src/lib/content.ts`. These are display metadata, separate from the original essays.
- **Images:** `assets/images/`; copied into the public assets automatically. Keep using `/assets/images/filename` links.

The main pages, navigation, search, filters, article tables of contents, and RSS use the same content source. The search filters titles, topic labels, and summaries. Fonts are self-hosted.

## Verify & build

```sh
npm run check
npm run build
npm run preview
```

The generated static site is in `dist/`. No Ruby, Jekyll, database, or server runtime is required.

For browser regression checks, install the test browser once with `npx playwright install chromium`, start the preview, then run `npm test`. Set `SITE_URL` if the preview uses a port other than 4000. Checks cover page rendering at four screen widths, links, images, search, filters, and sharing. Screenshots are written to the ignored `.validation/` directory.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys the site on pushes to `master` or `main`. In the GitHub repository, set **Settings → Pages → Source → GitHub Actions** once before deploying. Changes made locally are not published until pushed.

The site uses Astro only. `_posts/` and `_projects/` are active Markdown content directories; figure includes in existing essays are handled by the Astro content loader. `LICENSE` retains the original theme attribution.
