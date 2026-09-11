import { editorial } from "./editorial";
import { projectPresentation } from "./projects";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
}).use(anchor, {
  // Plain Unicode IDs keep section links usable after the Jekyll migration.
  slugify: (heading: string) =>
    heading
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-"),
});
export const escapeMarkup = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

export interface Entry {
  slug: string;
  title: string;
  date: Date;
  url: string;
  html: string;
  description: string;
  category: string;
  minutes: number;
  image?: string;
  headings: { id: string; title: string }[];
}

function renderLegacyFigures(body: string): string {
  return body.replace(
    /{%\s*include\s+figure\s+([\s\S]*?)%}/g,
    (_, attributes: string) => {
      const values: Record<string, string> = {};
      for (const match of attributes.matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)')/g))
        values[match[1]] = match[2] ?? match[3];
      const caption = values.caption
        ? `<figcaption>${markdown.renderInline(values.caption)}</figcaption>`
        : "";
      return `\n\n<figure><img src="${escapeMarkup(values.image_path || "")}" alt="${escapeMarkup(values.alt || "")}" loading="lazy">${caption}</figure>\n\n`;
    },
  );
}

function parseEntries(
  files: Record<string, string>,
  type: "blogs" | "projects",
): Entry[] {
  return Object.entries(files)
    .map(([path, raw]) => {
      const { data, content } = matter(raw);
      const date = new Date(data.date);
      if (Number.isNaN(date.getTime())) {
        throw new Error(
          `${path}: add a valid date (YYYY-MM-DD) to the front matter.`,
        );
      }
      const slug = path
        .split("/")
        .pop()!
        .replace(/\.md$/, "")
        .replace(/^\d{4}-\d{2}-\d{2}-/, "");
      const html = markdown.render(renderLegacyFigures(content));
      const metadata = editorial[slug];
      return {
        slug,
        title: String(data.title || slug),
        date,
        url: `/${type}/${slug}/`,
        html,
        description:
          metadata?.description ||
          data.excerpt ||
          content.replace(/[#*`]/g, "").trim().slice(0, 180),
        category:
          metadata?.category || (type === "blogs" ? "Essay" : "Project"),
        minutes: Math.max(1, Math.ceil(content.split(/\s+/).length / 220)),
        image: data.header?.og_image,
        headings: Array.from(
          html.matchAll(/<h[12] id="([^"]+)"[^>]*>(.*?)<\/h[12]>/g),
        ).map((m) => ({ id: m[1], title: m[2].replace(/<[^>]+>/g, "") })),
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const posts = parseEntries(
  import.meta.glob("../../_posts/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  "blogs",
);
export const projects = parseEntries(
  import.meta.glob("../../_projects/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  "projects",
).sort(
  (a, b) =>
    (projectPresentation[a.slug]?.order ?? 100) -
    (projectPresentation[b.slug]?.order ?? 100),
);
export const formatDate = (date: Date, language = "en") =>
  date.toLocaleDateString(language === "zh" ? "zh-CN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// Translations use the same slug as the original. Missing translations retain
// the English body, and the article layout explicitly labels that fallback.
const chineseProjects = parseEntries(
  import.meta.glob("../../_projects/zh/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  "projects",
);
const chinesePosts = parseEntries(
  import.meta.glob("../../_posts/zh/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  "blogs",
);
export function translatedEntry(
  entry: Entry,
  project: boolean,
): Entry | undefined {
  return (project ? chineseProjects : chinesePosts).find(
    (candidate) => candidate.slug === entry.slug,
  );
}
