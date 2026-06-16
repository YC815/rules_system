import { Header } from "@/components/Header";
import { RegulationCard } from "@/components/RegulationCard";
import { getAllRegulations, groupByCategory } from "@/lib/regulations";

export default async function HomePage() {
  const regulations = await getAllRegulations();
  const grouped = groupByCategory(regulations);

  const totalActive = regulations.filter((r) => r.status === "現行").length;
  const totalDraft = regulations.filter((r) => r.status === "草案").length;

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-14">
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
                OPEN ACCESS
              </span>
              <h1 className="font-extrabold text-4xl sm:text-5xl text-foreground tracking-tight leading-tight">
                學生會法規彙編
              </h1>
              <p className="text-lg font-medium text-muted-foreground max-w-md">
                TSchool 學生會內部法規的官方公示平台。條文透明，治理清晰。
              </p>

              {/* stats */}
              <div className="flex items-center gap-6 mt-2">
                <div className="text-center">
                  <p className="font-extrabold text-3xl text-foreground">
                    {totalActive}
                  </p>
                  <p className="font-mono text-xs font-bold text-muted-foreground mt-0.5">
                    現行法規
                  </p>
                </div>
                <div className="w-px h-10 bg-foreground/20" />
                <div className="text-center">
                  <p className="font-extrabold text-3xl text-foreground">
                    {regulations.length}
                  </p>
                  <p className="font-mono text-xs font-bold text-muted-foreground mt-0.5">
                    法規總數
                  </p>
                </div>
                {totalDraft > 0 && (
                  <>
                    <div className="w-px h-10 bg-foreground/20" />
                    <div className="text-center">
                      <p className="font-extrabold text-3xl text-tone-orange-text">
                        {totalDraft}
                      </p>
                      <p className="font-mono text-xs font-bold text-muted-foreground mt-0.5">
                        草案審議中
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="border-b-2 border-dashed border-foreground/30" />

        {/* Regulation groups */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          {Array.from(grouped.entries()).map(([category, regs]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-extrabold text-xl text-foreground">
                  {category}
                </h2>
                <span className="rounded-md border-2 border-foreground bg-card px-2 py-0.5 font-mono text-[11px] font-bold text-foreground">
                  {regs.length} 份
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {regs.map((regulation) => (
                  <RegulationCard
                    key={regulation.slug}
                    regulation={regulation}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t-2 border-dashed border-foreground/30 py-8">
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
