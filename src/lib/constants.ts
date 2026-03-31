export const BOT_NAMES = ["momentum", "range", "sentiment"] as const;
export type BotName = (typeof BOT_NAMES)[number];

export const SYMBOLS = ["BTC/USDT", "ETH/USDT", "XRP/USDT", "SOL/USDT"] as const;
export type Symbol = (typeof SYMBOLS)[number];

export const BOT_COLORS: Record<string, string> = {
  momentum: "#3b82f6",
  range: "#a855f7",
  sentiment: "#eab308",
};

export function getBotColor(botName: string): string {
  return BOT_COLORS[botName] ?? "#6b7280";
}

export function formatPnl(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
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
