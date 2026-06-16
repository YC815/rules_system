import { Header } from "@/components/Header";
import { ContentExplorer } from "@/components/ContentExplorer";
import { getAllContent, countByCategory } from "@/lib/content";

export default async function HomePage() {
  const items = await getAllContent();
  const counts = countByCategory(items);

  const stats: { label: string; value: number }[] = [
    { label: "資訊總數", value: items.length },
    { label: "學生活動", value: counts["活動"] },
    { label: "校規規定", value: counts["校規"] },
  ];

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(color-mix(in oklch, var(--color-foreground) 16%, transparent) 1.4px, transparent 1.4px)",
              backgroundSize: "22px 22px",
              maskImage:
                "radial-gradient(75% 65% at 50% 0%, black, transparent)",
            }}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
              <span className="rounded-md border-2 border-foreground bg-card px-3 py-1 font-mono text-xs font-bold text-foreground">
                CAMPUS INFO HUB
              </span>
              <h1 className="font-extrabold text-4xl sm:text-5xl text-foreground tracking-tight leading-tight">
                校園資訊彙整站
              </h1>
              <p className="text-lg font-medium text-muted-foreground max-w-md">
                學生活動、課程資訊、校規規定與校園公告，一站查閱。搜尋與篩選，快速找到你要的資訊。
              </p>

              {/* stats */}
              <div className="flex items-center gap-6 mt-2">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-6">
                    {i > 0 && <div className="w-px h-10 bg-foreground/20" />}
                    <div className="text-center">
                      <p className="font-extrabold text-3xl text-foreground">
                        {stat.value}
                      </p>
                      <p className="font-mono text-xs font-bold text-muted-foreground mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="border-b-2 border-dashed border-foreground/30" />

        {/* Explorer */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <ContentExplorer items={items} />
        </section>
      </main>

      <footer className="border-t-2 border-dashed border-foreground/30 py-8">
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
