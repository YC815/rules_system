import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export type ContentCategory = "校規" | "活動" | "課程" | "其他";

// 路由區段（資料夾名）→ 顯示分類。新增類別只要在此加一行。
export const DIR_CATEGORY: Record<string, ContentCategory> = {
  regulations: "校規",
  activities: "活動",
  courses: "課程",
  info: "其他",
};

export interface ContentMeta {
  dir: string; // 路由區段 = 資料夾名
  slug: string; // 檔名（去 .md），detail URL = /${dir}/${slug}
  category: ContentCategory;
  title: string;
  summary: string;
  date: string; // 主要日期（施行日 / 活動日 / 公告日）
  tags?: string[];
  status?: string; // 選填徽章：現行/草案/報名中/已結束…
  // 類別專屬選填欄位（parser 不分支，原樣 spread）
  code?: string; // 校規字號
  location?: string; // 活動地點
  host?: string; // 活動主辦單位
  lastAmended?: string; // 校規最後修正
}

export interface ContentDetail extends ContentMeta {
  contentHtml: string;
  chapters: { id: string; text: string }[];
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

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

// 把原始 frontmatter 正規化成 ContentMeta：受控欄位（dir/slug/category/date）
// 一律由系統決定，覆寫掉檔案內任何同名欄位。date 缺漏時退回 enacted（相容舊法規格式）。
function normalizeMeta(
  dir: string,
  slug: string,
  data: Record<string, unknown>
): ContentMeta {
  return {
    ...data,
    dir,
    slug,
    category: DIR_CATEGORY[dir],
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    date: String(data.date ?? data.enacted ?? ""),
  } as ContentMeta;
}

async function parseFileMeta(
  dir: string,
  filename: string
): Promise<ContentMeta> {
  const raw = await fs.readFile(
    path.join(CONTENT_ROOT, dir, filename),
    "utf-8"
  );
  const { data } = matter(raw);
  const slug = filename.replace(/\.md$/, "");
  return normalizeMeta(dir, slug, data as Record<string, unknown>);
}

async function readDirMeta(dir: string): Promise<ContentMeta[]> {
  try {
    const files = (await fs.readdir(path.join(CONTENT_ROOT, dir))).filter(
      (f) => f.endsWith(".md") && !f.startsWith("_")
    );
    return await Promise.all(files.map((f) => parseFileMeta(dir, f)));
  } catch {
    return []; // 資料夾不存在時視為無內容，不報錯
  }
}

export async function getAllContent(): Promise<ContentMeta[]> {
  const dirs = Object.keys(DIR_CATEGORY);
  const groups = await Promise.all(dirs.map(readDirMeta));
  return groups.flat().sort((a, b) => b.date.localeCompare(a.date));
}

export async function getContentByPath(
  dir: string,
  slug: string
): Promise<ContentDetail | null> {
  if (!(dir in DIR_CATEGORY)) return null;
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_ROOT, dir, `${slug}.md`),
      "utf-8"
    );
    const { data, content } = matter(raw);
    const contentHtml = marked.parse(content) as string;
    const chapters = extractChaptersFromHtml(contentHtml);
    return {
      ...normalizeMeta(dir, slug, data as Record<string, unknown>),
      contentHtml,
      chapters,
    };
  } catch {
    return null;
  }
}

// 各分類的數量統計（供首頁 tabs 數量徽章使用）
export function countByCategory(
  items: ContentMeta[]
): Record<ContentCategory, number> {
  const counts = { 校規: 0, 活動: 0, 課程: 0, 其他: 0 } as Record<
    ContentCategory,
    number
  >;
  for (const item of items) counts[item.category]++;
  return counts;
}
