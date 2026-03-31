export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getClosedTrades, getWinRateByBot, getDailyPnl } from "@/lib/queries";
import { formatPnl, sideColor, pnlColor } from "@/lib/constants";
import { PnlChart } from "@/components/pnl-chart";
import { TradeFilters } from "@/components/trade-filters";

type SearchParams = Promise<{ botName?: string; symbol?: string }>;

export default async function TradesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const botName = params.botName;
  const symbol = params.symbol;

  const [trades, winRates, dailyPnl] = await Promise.all([
    getClosedTrades({ botName, symbol }),
    getWinRateByBot(),
    getDailyPnl(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">トレード履歴</h1>

      <Suspense fallback={null}>
        <TradeFilters />
      </Suspense>

      <section>
        <h2 className="text-sm font-medium text-muted mb-3">ボット別勝率</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {winRates.map((wr) => (
            <div
              key={wr.botName}
              className="bg-card-bg border border-card-border rounded-lg p-4"
            >
              <p className="text-sm text-muted mb-1">{wr.botName}</p>
              <p className="text-2xl font-bold">
                {wr.winRate != null ? `${wr.winRate}%` : "—"}
              </p>
              <p className="text-xs text-muted mt-1">
                {wr.wins}勝 / {wr.losses}敗
              </p>
            </div>
          ))}
          {winRates.length === 0 && (
            <p className="text-sm text-muted col-span-full">データなし</p>
          )}
        </div>
      </section>

      <section className="bg-card-bg border border-card-border rounded-lg p-4">
        <h2 className="text-sm font-medium text-muted mb-4">PnL推移</h2>
        <PnlChart data={dailyPnl} />
      </section>

      <section className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-left text-muted">
                <th className="px-4 py-3 font-medium">ボット</th>
                <th className="px-4 py-3 font-medium">ペア</th>
                <th className="px-4 py-3 font-medium">サイド</th>
                <th className="px-4 py-3 font-medium text-right">
                  エントリー価格
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  エグジット価格
                </th>
                <th className="px-4 py-3 font-medium text-right">PnL</th>
                <th className="px-4 py-3 font-medium text-right">決済日時</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => {
                const pnlNum = trade.pnl ? parseFloat(trade.pnl) : null;
                return (
                  <tr
                    key={trade.id}
                    className="border-b border-card-border last:border-b-0 hover:bg-card-border/30 transition-colors"
                  >
                    <td className="px-4 py-3">{trade.botName}</td>
                    <td className="px-4 py-3">{trade.symbol}</td>
                    <td className="px-4 py-3">
                      <span className={sideColor(trade.side)}>
                        {trade.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {parseFloat(trade.entryPrice).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {trade.exitPrice
                        ? parseFloat(trade.exitPrice).toLocaleString()
                        : "—"}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono font-medium ${
                        pnlNum !== null ? pnlColor(pnlNum) : "text-muted"
                      }`}
                    >
                      {pnlNum !== null ? `$${formatPnl(pnlNum)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">
                      {trade.closedAt
                        ? new Date(trade.closedAt).toLocaleString("ja-JP", {
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                  </tr>
                );
              })}
              {trades.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted"
                  >
                    トレードデータがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
