import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentCategory, ContentMeta } from "@/lib/content";

type ToneClasses = { bg: string; border: string; text: string };

// 分類預設 tone（沿用 globals.css 既有 token）
const CATEGORY_TONE: Record<ContentCategory, ToneClasses> = {
  校規: {
    bg: "bg-tone-green-bg",
    border: "border-tone-green-text",
    text: "text-tone-green-text",
  },
  活動: {
    bg: "bg-tone-blue-bg",
    border: "border-tone-blue-text",
    text: "text-tone-blue-text",
  },
  課程: {
    bg: "bg-tone-rose-bg",
    border: "border-tone-rose-text",
    text: "text-tone-rose-text",
  },
  其他: {
    bg: "bg-tone-violet-bg",
    border: "border-tone-violet-text",
    text: "text-tone-violet-text",
  },
};

// 特定狀態覆寫顏色（草案/結束類用中性或警示色）
const STATUS_TONE: Record<string, ToneClasses> = {
  草案: {
    bg: "bg-tone-orange-bg",
    border: "border-tone-orange-text",
    text: "text-tone-orange-text",
  },
  已結束: {
    bg: "bg-muted",
    border: "border-foreground/30",
    text: "text-muted-foreground",
  },
  已廢止: {
    bg: "bg-muted",
    border: "border-foreground/30",
    text: "text-muted-foreground",
  },
};

function Badge({ tone, label }: { tone: ToneClasses; label: string }) {
  return (
    <span
      className={`rounded-md border-2 px-2 py-0.5 font-mono text-[11px] font-bold ${tone.bg} ${tone.border} ${tone.text}`}
    >
      {label}
    </span>
  );
}

export function ContentCard({ item }: { item: ContentMeta }) {
  const categoryTone = CATEGORY_TONE[item.category];
  const statusTone = item.status
    ? STATUS_TONE[item.status] ?? categoryTone
    : null;

  // 左上識別字串：校規顯示字號，其餘顯示分類
  const eyebrow = item.code ?? item.category;

  return (
    <Link
      href={`/${item.dir}/${item.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0_0_var(--color-foreground)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_var(--color-foreground)] active:translate-y-0 active:shadow-[3px_3px_0_0_var(--color-foreground)]"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge tone={categoryTone} label={eyebrow} />
        {statusTone && <Badge tone={statusTone} label={item.status!} />}
      </div>

      <h3 className="font-extrabold text-base text-foreground leading-snug">
        {item.title}
      </h3>

      <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-2 flex-1">
        {item.summary}
      </p>

      {item.location && (
        <p className="font-mono text-[11px] font-bold text-muted-foreground -mt-1">
          📍 {item.location}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-1 border-t border-dashed border-foreground/20">
        <span className="font-mono text-[11px] font-bold text-muted-foreground">
          {item.date}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
