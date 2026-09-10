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
export const escape = (value: string) =>
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

// Display metadata lives here so the original essays remain byte-for-byte intact.
const editorial: Record<string, { description: string; category: string }> = {
  "General-purpose-skill": {
    category: "AI & society",
    description:
      "What remains valuable when specialized skills become easier to automate? A case for adaptability, judgment, and learning across domains.",
  },
  Causality: {
    category: "Systems & philosophy",
    description:
      "Success stories rarely explain success. On luck, causality, and learning to see the systems behind individual outcomes.",
  },
  GPT: {
    category: "AI & society",
    description:
      "A time capsule from 2023: an early exploration of GPT, human intelligence, and the future of our relationship with AI.",
  },
  ReconDrive: {
    category: "Research · 3D / 4D",
    description:
      "Turning driving scenes into dynamic 3D worlds. Feed-forward 4D Gaussian splatting for autonomous driving.",
  },
  "Persona-Roundtable": {
    category: "Open source · AI tool",
    description:
      "A command-line tool for exploring questions through conversations between AI personas with different perspectives.",
  },
};

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
      return `\n\n<figure><img src="${escape(values.image_path || "")}" alt="${escape(values.alt || "")}" loading="lazy">${caption}</figure>\n\n`;
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
        date: new Date(data.date),
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
    Number(a.slug === "Persona-Roundtable") -
    Number(b.slug === "Persona-Roundtable"),
);
export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
