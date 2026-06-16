"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ContentCard } from "@/components/ContentCard";
import type { ContentCategory, ContentMeta } from "@/lib/content";

const CATEGORIES: ContentCategory[] = ["活動", "課程", "校規", "其他"];
type Filter = "全部" | ContentCategory;

export function ContentExplorer({ items }: { items: ContentMeta[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Filter>("全部");

  const counts = useMemo(() => {
    const map: Record<Filter, number> = {
      全部: items.length,
      活動: 0,
      課程: 0,
      校規: 0,
      其他: 0,
    };
    for (const item of items) map[item.category]++;
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (active !== "全部" && item.category !== active) return false;
      if (!q) return true;
      const haystack = [
        item.title,
        item.summary,
        item.code ?? "",
        item.location ?? "",
        item.host ?? "",
        ...(item.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, active, query]);

  const tabs: Filter[] = ["全部", ...CATEGORIES];

  return (
    <div className="space-y-8">
      {/* 搜尋框 */}
      <div className="relative max-w-xl mx-auto">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋活動、課程、校規或公告…"
          className="w-full rounded-xl border-2 border-foreground bg-card pl-11 pr-4 py-3 font-mono text-sm font-medium text-foreground placeholder:text-muted-foreground shadow-[3px_3px_0_0_var(--color-foreground)] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-[5px_5px_0_0_var(--color-foreground)]"
        />
      </div>

      {/* 分類 tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tabs.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`inline-flex items-center gap-2 rounded-xl border-2 border-foreground px-4 py-2 font-mono text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-foreground text-[oklch(0.99_0_0)] shadow-[3px_3px_0_0_var(--color-primary)]"
                  : "bg-card text-foreground shadow-[2px_2px_0_0_var(--color-foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-foreground)]"
              }`}
            >
              {tab}
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                  isActive
                    ? "bg-[oklch(0.99_0_0)/20] text-[oklch(0.99_0_0)]"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* 結果 */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <ContentCard key={`${item.dir}/${item.slug}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="font-mono text-sm font-bold text-muted-foreground">
            找不到符合的資訊
          </p>
          <p className="font-mono text-xs font-medium text-muted-foreground/70">
            試試其他關鍵字或切換分類
          </p>
        </div>
      )}
    </div>
  );
}
