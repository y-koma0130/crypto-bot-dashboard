export const dynamic = "force-dynamic";

import {
  getPnlByBot,
  getPnlBySymbol,
  getDailyPnlByBot,
  getWinRateByBot,
} from "@/lib/queries";
import { formatPnl, pnlColor } from "@/lib/constants";
import { BotName } from "@/components/bot-name";
import { BotComparisonChart } from "@/components/bot-comparison-chart";
import { BotPnlChart } from "@/components/bot-pnl-chart";

export default async function PerformancePage() {
  const [pnlByBot, pnlBySymbol, dailyPnlByBot, winRateByBot] =
    await Promise.all([
      getPnlByBot(),
      getPnlBySymbol(),
      getDailyPnlByBot(),
      getWinRateByBot(),
    ]);

  const winRateMap = new Map(
    winRateByBot.map((w) => [w.botName, w])
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">パフォーマンス分析</h1>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground/80">
          ボット別サマリー
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pnlByBot.map((bot) => {
            const wr = winRateMap.get(bot.botName);
            return (
              <div
                key={bot.botName}
                className="bg-card-bg border border-card-border rounded-lg p-4"
              >
                <h3 className="text-sm font-semibold mb-3">
                  <BotName name={bot.botName} />
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">トレード数</span>
                    <span className="text-foreground/70">
                      {bot.tradeCount} 件
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">総PnL（USDT）</span>
                    <span className={pnlColor(bot.totalPnl)}>
                      {formatPnl(bot.totalPnl)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">平均PnL（USDT）</span>
                    <span className={pnlColor(bot.avgPnl)}>
                      {formatPnl(bot.avgPnl)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">勝率</span>
                    <span className="text-foreground/70">
                      {wr ? `${wr.winRate}%` : "-"}
                      {wr && (
                        <span className="text-muted ml-1">
                          ({wr.wins}W / {wr.losses}L)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground/80">
          ボット別収益比較
        </h2>
        <div className="bg-card-bg border border-card-border rounded-lg p-4">
          <BotComparisonChart data={pnlByBot} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground/80">
          日次PnL推移（ボット別）
        </h2>
        <div className="bg-card-bg border border-card-border rounded-lg p-4">
          <BotPnlChart data={dailyPnlByBot} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground/80">
          ペア別パフォーマンス
        </h2>
        {pnlBySymbol.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-lg p-6 text-center text-sm text-muted">
            データがありません
          </div>
        ) : (
          <div className="overflow-x-auto bg-card-bg border border-card-border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border text-left text-xs text-muted">
                  <th className="px-4 py-3 font-medium">通貨ペア</th>
                  <th className="px-4 py-3 font-medium text-right">
                    トレード数
                  </th>
                  <th className="px-4 py-3 font-medium text-right">総PnL（USDT）</th>
                  <th className="px-4 py-3 font-medium text-right">勝率</th>
                </tr>
              </thead>
              <tbody>
                {pnlBySymbol.map((row) => (
                  <tr
                    key={row.symbol}
                    className="border-b border-card-border/50 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono">{row.symbol}</td>
                    <td className="px-4 py-3 text-right">{row.tradeCount} 件</td>
                    <td
                      className={`px-4 py-3 text-right font-mono ${pnlColor(row.totalPnl)}`}
                    >
                      {formatPnl(row.totalPnl)}
                    </td>
                    <td className="px-4 py-3 text-right">{row.winRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
