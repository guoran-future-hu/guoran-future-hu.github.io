import type { APIRoute } from "astro";
import { posts, escapeMarkup } from "../lib/content";
export const GET: APIRoute = ({ site }) => {
  const base = site!.origin;
  const items = posts
    .map(
      (p) =>
        `<item><title>${escapeMarkup(p.title)}</title><link>${base}${p.url}</link><guid>${base}${p.url}</guid><pubDate>${p.date.toUTCString()}</pubDate><description>${escapeMarkup(p.description)}</description></item>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Future Hu — Writing</title><link>${base}</link><description>Ideas on intelligence, society, and complex systems.</description><language>en</language>${items}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};
