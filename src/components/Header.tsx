import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-background/90 backdrop-blur-md border-b-2 border-foreground/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-lg font-extrabold tracking-tight text-foreground"
        >
          SA<span className="text-primary">-</span>法規
        </Link>

        <span className="rounded-md border-2 border-foreground bg-card px-2 py-0.5 font-mono text-[11px] font-bold text-foreground">
          公開查閱
        </span>
      </div>
    </header>
  );
}
