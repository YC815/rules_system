import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/Header";
import {
  getAllRegulations,
  getRegulationBySlug,
} from "@/lib/regulations";

export async function generateStaticParams() {
  const regulations = await getAllRegulations();
  return regulations.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const regulation = await getRegulationBySlug(slug);
  if (!regulation) return {};
  return {
    title: `${regulation.title} — SA-法規`,
    description: regulation.summary,
  };
}

export default async function RegulationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const regulation = await getRegulationBySlug(slug);
  if (!regulation) notFound();

  const statusColor =
    regulation.status === "現行"
      ? "bg-tone-green-bg border-tone-green-text text-tone-green-text"
      : regulation.status === "草案"
        ? "bg-tone-orange-bg border-tone-orange-text text-tone-orange-text"
        : "bg-muted border-foreground/30 text-muted-foreground";

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
            返回彙編首頁
          </Link>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* sidebar TOC */}
            {regulation.chapters.length > 0 && (
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-24">
                  <p className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    章節目錄
                  </p>
                  <nav className="space-y-1">
                    {regulation.chapters.map((ch) => (
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
                      {regulation.code}
                    </p>
                    <h1 className="font-extrabold text-2xl sm:text-3xl leading-tight">
                      {regulation.title}
                    </h1>
                  </div>
                  <span
                    className={`rounded-md border-2 px-2 py-0.5 font-mono text-[11px] font-bold ${statusColor}`}
                  >
                    {regulation.status}
                  </span>
                </div>

                <p className="mt-4 text-sm font-medium text-[oklch(0.99_0_0)/70] leading-relaxed">
                  {regulation.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-6 border-t border-[oklch(0.99_0_0)/15] pt-4">
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[oklch(0.99_0_0)/40]">
                      分類
                    </p>
                    <p className="font-mono text-xs font-bold text-[oklch(0.99_0_0)/80] mt-0.5">
                      {regulation.category}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[oklch(0.99_0_0)/40]">
                      施行日期
                    </p>
                    <p className="font-mono text-xs font-bold text-[oklch(0.99_0_0)/80] mt-0.5">
                      {regulation.enacted}
                    </p>
                  </div>
                  {regulation.lastAmended && (
                    <div>
                      <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[oklch(0.99_0_0)/40]">
                        最後修正
                      </p>
                      <p className="font-mono text-xs font-bold text-[oklch(0.99_0_0)/80] mt-0.5">
                        {regulation.lastAmended}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* regulation body */}
              <article
                className="reg-prose"
                dangerouslySetInnerHTML={{ __html: regulation.contentHtml }}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-dashed border-foreground/30 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span className="font-mono text-sm font-extrabold text-foreground">
            SA<span className="text-primary">-</span>法規
          </span>
          <span className="font-mono text-xs font-bold text-muted-foreground">
            © 2026 TSchool 學生會
          </span>
        </div>
      </footer>
    </>
  );
}
