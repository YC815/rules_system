import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { getAllContent, getContentByPath } from "@/lib/content";

export async function generateStaticParams() {
  const items = await getAllContent();
  return items.map((i) => ({ category: i.dir, slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const item = await getContentByPath(category, slug);
  if (!item) return {};
  return {
    title: `${item.title} — 校園資訊`,
    description: item.summary,
  };
}

// status 徽章配色（沿用 globals.css token）
function statusColor(status?: string): string {
  switch (status) {
    case "現行":
    case "報名中":
      return "bg-tone-green-bg border-tone-green-text text-tone-green-text";
    case "草案":
      return "bg-tone-orange-bg border-tone-orange-text text-tone-orange-text";
    case "已結束":
    case "已廢止":
      return "bg-muted border-foreground/30 text-muted-foreground";
    default:
      return "bg-tone-blue-bg border-tone-blue-text text-tone-blue-text";
  }
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const item = await getContentByPath(category, slug);
  if (!item) notFound();

  // 依存在的欄位條件組出 metadata 欄位，不分類分支
  const metaFields: { label: string; value: string }[] = [
    { label: "分類", value: item.category },
    ...(item.host ? [{ label: "主辦單位", value: item.host }] : []),
    ...(item.location ? [{ label: "地點", value: item.location }] : []),
    {
      label: item.code ? "施行日期" : "日期",
      value: item.date,
    },
    ...(item.lastAmended
      ? [{ label: "最後修正", value: item.lastAmended }]
      : []),
  ];

  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-mono text-xs font-bold text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            返回資訊首頁
          </Link>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* sidebar TOC */}
            {item.chapters.length > 0 && (
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-24">
                  <p className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    章節目錄
                  </p>
                  <nav className="space-y-1">
                    {item.chapters.map((ch) => (
                      <a
                        key={ch.id}
                        href={`#${ch.id}`}
                        className="block rounded-lg border-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-card hover:shadow-[2px_2px_0_0_var(--color-foreground)] transition-all duration-200"
                      >
                        {ch.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            {/* main content */}
            <div className="flex-1 min-w-0">
              {/* metadata card */}
              <div className="rounded-2xl border-2 border-foreground bg-foreground p-6 shadow-[4px_4px_0_0_var(--color-primary)] mb-10 text-[oklch(0.99_0_0)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[oklch(0.99_0_0)/50] mb-1">
                      {item.code ?? item.category}
                    </p>
                    <h1 className="font-extrabold text-2xl sm:text-3xl leading-tight">
                      {item.title}
                    </h1>
                  </div>
                  {item.status && (
                    <span
                      className={`rounded-md border-2 px-2 py-0.5 font-mono text-[11px] font-bold ${statusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm font-medium text-[oklch(0.99_0_0)/70] leading-relaxed">
                  {item.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-6 border-t border-[oklch(0.99_0_0)/15] pt-4">
                  {metaFields.map((f) => (
                    <div key={f.label}>
                      <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[oklch(0.99_0_0)/40]">
                        {f.label}
                      </p>
                      <p className="font-mono text-xs font-bold text-[oklch(0.99_0_0)/80] mt-0.5">
                        {f.value}
                      </p>
                    </div>
                  ))}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-[oklch(0.99_0_0)/25] px-2 py-0.5 font-mono text-[10px] font-bold text-[oklch(0.99_0_0)/70]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* body */}
              <article
                className="content-prose"
                dangerouslySetInnerHTML={{ __html: item.contentHtml }}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-dashed border-foreground/30 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span className="font-mono text-sm font-extrabold text-foreground">
            校園<span className="text-primary">-</span>資訊
          </span>
          <span className="font-mono text-xs font-bold text-muted-foreground">
            © 2026 TSchool
          </span>
        </div>
      </footer>
    </>
  );
}
