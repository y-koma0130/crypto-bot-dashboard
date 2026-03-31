export const dynamic = "force-dynamic";

import { getSignals } from "@/lib/queries";
import { formatJST } from "@/lib/constants";
import { SignalFilters } from "@/components/signal-filters";
import { Suspense } from "react";

type SignalBadgeColor = "green" | "red" | "yellow" | "blue" | "muted";

function getSignalColor(signal: string): SignalBadgeColor {
  switch (signal) {
    case "BULLISH":
    case "BUY_FILTER:SAFE":
    case "TRENDING":
      return "green";
    case "BEARISH":
    case "SELL_FILTER:BLOCKED":
    case "BUY_FILTER:BLOCKED":
      return "red";
    case "HALT":
      return "yellow";
    case "SELL_FILTER:SAFE":
      return "blue";
    case "NEUTRAL":
    case "RANGING":
    default:
      return "muted";
  }
}

const badgeStyles: Record<SignalBadgeColor, string> = {
  green: "bg-accent-green/20 text-accent-green",
  red: "bg-accent-red/20 text-accent-red",
  yellow: "bg-accent-yellow/20 text-accent-yellow",
  blue: "bg-accent-blue/20 text-accent-blue",
  muted: "bg-muted/20 text-muted",
};


export default async function SignalsPage({
  searchParams,
}: {
  searchParams: Promise<{ botName?: string; signal?: string }>;
}) {
  const params = await searchParams;
  const signals = await getSignals({
    botName: params.botName || undefined,
    signal: params.signal || undefined,
    limit: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">シグナルログ</h1>
        <p className="text-sm text-muted mt-1">GPT分析によるシグナル履歴</p>
      </div>

      <Suspense fallback={null}>
        <SignalFilters />
      </Suspense>

      {signals.length === 0 ? (
        <div className="bg-card-bg border border-card-border rounded-lg p-8 text-center text-muted">
          シグナルが見つかりませんでした
        </div>
      ) : (
        <div className="grid gap-4">
          {signals.map((sig) => {
            const color = getSignalColor(sig.signal);
            return (
              <div
                key={sig.id}
                className="bg-card-bg border border-card-border rounded-lg p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{sig.botName}</span>
                    <span className="text-sm text-muted">{sig.symbol}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeStyles[color]}`}
                    >
                      {sig.signal}
                    </span>
                    <span className="text-xs text-muted">
                      {formatJST(sig.createdAt)}
                    </span>
                  </div>
                </div>

                {sig.reasoning && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-muted hover:text-foreground transition-colors">
                      判断理由を表示
                    </summary>
                    <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed bg-background/50 rounded-md p-3">
                      {sig.reasoning}
                    </p>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
