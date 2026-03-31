export const BOT_NAMES = ["momentum", "range", "sentiment"] as const;
export type BotName = (typeof BOT_NAMES)[number];

export const SYMBOLS = ["BTC/USDT", "ETH/USDT", "XRP/USDT", "SOL/USDT"] as const;
export type Symbol = (typeof SYMBOLS)[number];

export const BOT_META: Record<string, { label: string; color: string; description: string }> = {
  momentum: {
    label: "モメンタム",
    color: "#3b82f6",
    description: "EMA(20/50)クロスオーバー + 出来高確認｜BTC・ETH｜1時間足｜資金40%",
  },
  range: {
    label: "レンジ",
    color: "#a855f7",
    description: "RSI + ボリンジャーバンド逆張り｜XRP・SOL｜15分足｜資金35%",
  },
  sentiment: {
    label: "センチメント",
    color: "#eab308",
    description: "RSSニュース → GPT分析｜全4ペア監視｜HALT判定｜資金25%",
  },
};

export const BOT_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(BOT_META).map(([k, v]) => [k, v.color])
);

export function getBotColor(botName: string): string {
  return BOT_META[botName]?.color ?? "#6b7280";
}

export function getBotLabel(botName: string): string {
  return BOT_META[botName]?.label ?? botName;
}

export function getBotDescription(botName: string): string {
  return BOT_META[botName]?.description ?? "";
}

export function formatPnl(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPrice(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatAmount(value: string | number, symbol: string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  const base = symbol.split("/")[0];
  return `${num} ${base}`;
}

export function formatJST(date: Date | null | undefined): string {
  if (!date) return "-";
  return date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

export function pnlColor(value: number): string {
  return value >= 0 ? "text-accent-green" : "text-accent-red";
}

export function sideColor(side: string): string {
  return side === "buy" ? "text-accent-green" : "text-accent-red";
}
