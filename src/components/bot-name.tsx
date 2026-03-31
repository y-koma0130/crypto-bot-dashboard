import { getBotLabel, getBotColor, BOT_META } from "@/lib/constants";

export function BotName({ name, showTooltip = false }: { name: string; showTooltip?: boolean }) {
  const label = getBotLabel(name);
  const color = getBotColor(name);
  const meta = BOT_META[name];

  if (!showTooltip || !meta) {
    return <span style={{ color }}>{label}</span>;
  }

  return (
    <span className="group relative inline-flex items-center gap-1">
      <span style={{ color }}>{label}</span>
      <span
        className="cursor-help text-[10px] leading-none opacity-50"
        style={{ color }}
      >
        ?
      </span>
      <span className="pointer-events-none absolute bottom-full left-0 mb-2 hidden w-72 rounded-lg bg-[#232640] border border-card-border px-3 py-2.5 text-xs text-foreground/90 shadow-lg group-hover:block z-50">
        <span className="font-semibold" style={{ color }}>{label}</span>
        <div className="mt-1.5 space-y-1 text-[11px] leading-relaxed">
          <div className="flex gap-2">
            <span className="text-muted shrink-0">戦略</span>
            <span>{meta.strategy}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted shrink-0">対象</span>
            <span>{meta.pairs}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted shrink-0">間隔</span>
            <span>{meta.interval}</span>
          </div>
        </div>
        <span className="absolute left-4 top-full h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#232640]" />
      </span>
    </span>
  );
}
