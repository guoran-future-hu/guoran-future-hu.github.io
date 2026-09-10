import { posts, projects, escape } from "../lib/content";
export function GET() {
  const urls = [
    "/",
    "/blogs/",
    "/projects/",
    "/about/",
    "/neurodivergent/",
    ...posts.map((p) => p.url),
    ...projects.map((p) => p.url),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${escape(`https://guoran-future-hu.github.io${url}`)}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
