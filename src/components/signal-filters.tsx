"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { BOT_NAMES, getBotLabel } from "@/lib/constants";

const SIGNAL_OPTIONS = [
  "BULLISH",
  "BEARISH",
  "NEUTRAL",
  "HALT",
  "TRENDING",
  "RANGING",
  "BUY_FILTER:SAFE",
  "BUY_FILTER:BLOCKED",
  "SELL_FILTER:SAFE",
  "SELL_FILTER:BLOCKED",
] as const;

export function SignalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentBot = searchParams.get("botName") ?? "";
  const currentSignal = searchParams.get("signal") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/signals?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="bot-filter" className="text-xs text-muted">
          ボット
        </label>
        <select
          id="bot-filter"
          value={currentBot}
          onChange={(e) => updateParams("botName", e.target.value)}
          className="bg-card-bg border border-card-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent-blue"
        >
          <option value="">全て</option>
          {BOT_NAMES.map((bot) => (
            <option key={bot} value={bot}>
              {getBotLabel(bot)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="signal-filter" className="text-xs text-muted">
          シグナル
        </label>
        <select
          id="signal-filter"
          value={currentSignal}
          onChange={(e) => updateParams("signal", e.target.value)}
          className="bg-card-bg border border-card-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent-blue"
        >
          <option value="">全て</option>
          {SIGNAL_OPTIONS.map((sig) => (
            <option key={sig} value={sig}>
              {sig}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
