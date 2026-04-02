export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getClosedTrades, getWinRateByBot, getDailyPnl } from "@/lib/queries";
import { formatPnl, formatPrice, formatSide, sideColor, pnlColor, formatJST } from "@/lib/constants";
import { BotName } from "@/components/bot-name";
import { PnlChart } from "@/components/pnl-chart";
import { TradeFilters } from "@/components/trade-filters";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 30;

type SearchParams = Promise<{ botName?: string; symbol?: string; page?: string }>;

export default async function TradesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const botName = params.botName;
  const symbol = params.symbol;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const [{ data: trades, total }, winRates, dailyPnl] = await Promise.all([
    getClosedTrades({ botName, symbol, limit: PAGE_SIZE, offset }),
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {winRates.map((wr) => (
            <div
              key={wr.botName}
              className="bg-card-bg border border-card-border rounded-lg p-4"
            >
              <p className="text-sm text-muted mb-1"><BotName name={wr.botName} /></p>
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
                <th className="px-4 py-3 font-medium">方向</th>
                <th className="px-4 py-3 font-medium text-right">
                  エントリー（USDT）
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  エグジット（USDT）
                </th>
                <th className="px-4 py-3 font-medium text-right">部分利確（USDT）</th>
                <th className="px-4 py-3 font-medium text-right">総PnL（USDT）</th>
                <th className="px-4 py-3 font-medium text-right">決済日時</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => {
                const pnlNum = trade.pnl ? parseFloat(trade.pnl) : null;
                const partialPnlNum = trade.partialPnl ? parseFloat(trade.partialPnl) : null;
                const totalPnl = (pnlNum ?? 0) + (partialPnlNum ?? 0);
                return (
                  <tr
                    key={trade.id}
                    className="border-b border-card-border last:border-b-0 hover:bg-card-border/30 transition-colors"
                  >
                    <td className="px-4 py-3"><BotName name={trade.botName} /></td>
                    <td className="px-4 py-3">{trade.symbol}</td>
                    <td className="px-4 py-3">
                      <span className={sideColor(trade.side)}>
                        {formatSide(trade.side)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatPrice(trade.entryPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {trade.exitPrice ? formatPrice(trade.exitPrice) : "—"}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono font-medium ${
                        partialPnlNum !== null ? pnlColor(partialPnlNum) : "text-muted"
                      }`}
                    >
                      {partialPnlNum !== null ? formatPnl(partialPnlNum) : "—"}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono font-medium ${
                        pnlNum !== null || partialPnlNum !== null ? pnlColor(totalPnl) : "text-muted"
                      }`}
                    >
                      {pnlNum !== null || partialPnlNum !== null ? formatPnl(totalPnl) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">
                      {formatJST(trade.closedAt)}
                    </td>
                  </tr>
                );
              })}
              {trades.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted"
                  >
                    トレードデータがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {total > PAGE_SIZE && (
          <div className="px-4 py-3 border-t border-card-border">
            <Suspense fallback={null}>
              <Pagination total={total} pageSize={PAGE_SIZE} basePath="/trades" />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}
