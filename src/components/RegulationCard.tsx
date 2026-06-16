import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Regulation, RegulationStatus } from "@/lib/regulations";

const STATUS_CLASSES: Record<
  RegulationStatus,
  { bg: string; border: string; text: string }
> = {
  現行: {
    bg: "bg-tone-green-bg",
    border: "border-tone-green-text",
    text: "text-tone-green-text",
  },
  草案: {
    bg: "bg-tone-orange-bg",
    border: "border-tone-orange-text",
    text: "text-tone-orange-text",
  },
  已廢止: {
    bg: "bg-muted",
    border: "border-foreground/30",
    text: "text-muted-foreground",
  },
};

function StatusBadge({ status }: { status: RegulationStatus }) {
  const c = STATUS_CLASSES[status];
  return (
    <span
      className={`rounded-md border-2 px-2 py-0.5 font-mono text-[11px] font-bold ${c.bg} ${c.border} ${c.text}`}
    >
      {status}
    </span>
  );
}

export function RegulationCard({ regulation }: { regulation: Regulation }) {
  return (
    <Link
      href={`/${regulation.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0_0_var(--color-foreground)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_var(--color-foreground)] active:translate-y-0 active:shadow-[3px_3px_0_0_var(--color-foreground)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-bold text-muted-foreground">
          {regulation.code}
        </span>
        <StatusBadge status={regulation.status} />
      </div>

      <h3 className="font-extrabold text-base text-foreground leading-snug">
        {regulation.title}
      </h3>

      <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-2 flex-1">
        {regulation.summary}
      </p>

      <div className="flex items-center justify-between mt-auto pt-1 border-t border-dashed border-foreground/20">
        <span className="font-mono text-[11px] font-bold text-muted-foreground">
          施行 {regulation.enacted}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
