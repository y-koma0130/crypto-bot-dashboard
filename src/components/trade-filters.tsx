"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { BOT_NAMES, SYMBOLS, getBotLabel } from "@/lib/constants";

export function TradeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentBot = searchParams.get("botName") ?? "";
  const currentSymbol = searchParams.get("symbol") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/trades?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted">ボット</label>
        <select
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
        <label className="text-xs text-muted">ペア</label>
        <select
          value={currentSymbol}
          onChange={(e) => updateParams("symbol", e.target.value)}
          className="bg-card-bg border border-card-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent-blue"
        >
          <option value="">全て</option>
          {SYMBOLS.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
