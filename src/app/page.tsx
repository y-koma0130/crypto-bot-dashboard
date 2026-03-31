export const dynamic = "force-dynamic";

import { getBotStatuses, getOpenPositions, getTodayPnl } from "@/lib/queries";
import { formatJST, formatPnl, formatPrice, formatAmount, pnlColor, sideColor, getBotLabel, BOT_NAMES } from "@/lib/constants";
import type { CurrentPosition } from "@/lib/schema";
import { CumulativePnlChart } from "@/components/cumulative-pnl-chart";
import { BotName } from "@/components/bot-name";

function StatusBadge({ active, halted }: { active: boolean; halted: boolean }) {
  if (halted) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-yellow/20 px-2 py-0.5 text-xs font-medium text-accent-yellow">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
        HALTED
      </span>
    );
  }
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/20 px-2 py-0.5 text-xs font-medium text-accent-green">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted/20 px-2 py-0.5 text-xs font-medium text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-muted" />
      Inactive
    </span>
  );
}

export default async function Home() {
  const [botStatuses, openPositions, todayPnl] = await Promise.all([
    getBotStatuses(),
    getOpenPositions(),
    getTodayPnl(),
  ]);

  const sortedBotStatuses = BOT_NAMES.map(
    (name) => botStatuses.find((b) => b.botName === name)!
  ).filter(Boolean);
  const haltedBots = sortedBotStatuses.filter((b) => b.isHalted);
  const totalPnl = todayPnl.reduce((sum, b) => sum + b.totalPnl, 0);
  const totalTrades = todayPnl.reduce((sum, b) => sum + b.trades, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">概要</h1>

      {haltedBots.length > 0 && (
        <div className="rounded-lg border border-accent-yellow/50 bg-accent-yellow/10 p-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-accent-yellow"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <p className="text-sm font-semibold text-accent-yellow">
              HALT状態のボットがあります
            </p>
          </div>
          <ul className="mt-2 space-y-1 pl-7">
            {haltedBots.map((bot) => (
              <li key={bot.botName} className="text-sm text-accent-yellow/80">
                {getBotLabel(bot.botName)} - 最終実行: {formatJST(bot.lastRunAt)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground/80">
          ボット稼働状態
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedBotStatuses.map((bot) => {
            const position = bot.currentPosition as CurrentPosition | null;
            return (
              <div
                key={bot.botName}
                className="bg-card-bg border border-card-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">
                    <BotName name={bot.botName} showTooltip />
                  </h3>
                  <StatusBadge
                    active={bot.isActive ?? false}
                    halted={bot.isHalted ?? false}
                  />
                </div>
                <div className="space-y-2 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>最終実行</span>
                    <span className="text-foreground/70">
                      {formatJST(bot.lastRunAt)}
                    </span>
                  </div>
                  {position && (
                    <div className="flex justify-between">
                      <span>ポジション</span>
                      <span className={sideColor(position.side)}>
                        {position.pair} {position.side.toUpperCase()}{" "}
                        {formatAmount(position.amount, position.pair)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground/80">
          本日の確定損益
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 合計 */}
          <div className="bg-card-bg border border-card-border rounded-lg p-4">
            <p className="text-xs text-muted mb-1">合計 P&L（USDT）</p>
            <p className={`text-2xl font-bold ${pnlColor(totalPnl)}`}>
              {formatPnl(totalPnl)}
            </p>
            <p className="text-xs text-muted mt-1">{totalTrades} 件</p>
          </div>
          {/* ボット別 */}
          {todayPnl.map((bot) => (
            <div
              key={bot.botName}
              className="bg-card-bg border border-card-border rounded-lg p-4"
            >
              <p className="text-xs text-muted mb-1">
                <BotName name={bot.botName} />
                <span className="text-muted">（USDT）</span>
              </p>
              <p className={`text-xl font-bold ${pnlColor(bot.totalPnl)}`}>
                {formatPnl(bot.totalPnl)}
              </p>
              <p className="text-xs text-muted mt-1">{bot.trades} 件</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <CumulativePnlChart />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground/80">
          オープンポジション
        </h2>
        {openPositions.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-lg p-6 text-center text-sm text-muted">
            現在オープンポジションはありません
          </div>
        ) : (
          <div className="overflow-x-auto bg-card-bg border border-card-border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border text-left text-xs text-muted">
                  <th className="px-4 py-3 font-medium">ボット</th>
                  <th className="px-4 py-3 font-medium">通貨ペア</th>
                  <th className="px-4 py-3 font-medium">売買</th>
                  <th className="px-4 py-3 font-medium text-right">数量（枚）</th>
                  <th className="px-4 py-3 font-medium text-right">
                    エントリー価格（USDT）
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    開始日時
                  </th>
                </tr>
              </thead>
              <tbody>
                {openPositions.map((trade) => (
                  <tr
                    key={trade.id}
                    className="border-b border-card-border/50 last:border-0"
                  >
                    <td className="px-4 py-3"><BotName name={trade.botName} /></td>
                    <td className="px-4 py-3 font-mono">{trade.symbol}</td>
                    <td className="px-4 py-3">
                      <span className={sideColor(trade.side)}>
                        {trade.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatAmount(trade.amount, trade.symbol)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatPrice(trade.entryPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">
                      {formatJST(trade.createdAt)}
                    </td>
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
