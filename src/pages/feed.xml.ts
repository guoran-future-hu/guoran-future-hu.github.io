import { posts, escape } from "../lib/content";
export function GET() {
  const base = "https://guoran-future-hu.github.io";
  const items = posts
    .map(
      (p) =>
        `<item><title>${escape(p.title)}</title><link>${base}${p.url}</link><guid>${base}${p.url}</guid><pubDate>${p.date.toUTCString()}</pubDate><description>${escape(p.description)}</description></item>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Future Hu — Writing</title><link>${base}</link><description>Ideas on intelligence, society, and complex systems.</description><language>en</language>${items}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
