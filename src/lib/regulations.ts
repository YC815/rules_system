import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export type RegulationStatus = "現行" | "已廢止" | "草案";
export type RegulationCategory = "組織規章" | "財務規章" | "選舉規章" | "其他";

export interface Regulation {
  slug: string;
  title: string;
  code: string;
  category: RegulationCategory;
  status: RegulationStatus;
  enacted: string;
  lastAmended?: string;
  summary: string;
}

export interface RegulationWithContent extends Regulation {
  contentHtml: string;
  chapters: { id: string; text: string }[];
}

const CONTENT_DIR = path.join(process.cwd(), "content/regulations");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w一-鿿-]/g, "");
}

marked.use({
  renderer: {
    heading({ text, depth }: { text: string; depth: number }) {
      if (depth === 2) {
        return `<h2 id="${slugify(text)}">${text}</h2>\n`;
      }
      return false;
    },
  },
});

function extractChaptersFromHtml(html: string): { id: string; text: string }[] {
  const chapters: { id: string; text: string }[] = [];
  const regex = /<h2[^>]*\sid="([^"]*)"[^>]*>([\s\S]*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (id) chapters.push({ id, text });
  }
  return chapters;
}

async function parseFileMeta(filename: string): Promise<Regulation> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, filename), "utf-8");
  const { data } = matter(raw);
  const slug = filename.replace(/\.md$/, "");
  return { slug, ...(data as Omit<Regulation, "slug">) };
}

export async function getAllRegulations(): Promise<Regulation[]> {
  const files = (await fs.readdir(CONTENT_DIR)).filter(
    (f) => f.endsWith(".md") && !f.startsWith("_")
  );
  const regulations = await Promise.all(files.map(parseFileMeta));
  return regulations.sort((a, b) => a.code.localeCompare(b.code));
}

export async function getRegulationBySlug(
  slug: string
): Promise<RegulationWithContent | null> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, `${slug}.md`),
      "utf-8"
    );
    const { data, content } = matter(raw);
    const contentHtml = marked.parse(content) as string;
    const chapters = extractChaptersFromHtml(contentHtml);
    return {
      slug,
      contentHtml,
      chapters,
      ...(data as Omit<Regulation, "slug">),
    };
  } catch {
    return null;
  }
}

export function groupByCategory(
  regulations: Regulation[]
): Map<RegulationCategory, Regulation[]> {
  const order: RegulationCategory[] = [
    "組織規章",
    "財務規章",
    "選舉規章",
    "其他",
  ];
  const map = new Map<RegulationCategory, Regulation[]>();
  for (const cat of order) {
    const group = regulations.filter((r) => r.category === cat);
    if (group.length > 0) map.set(cat, group);
  }
  return map;
}
