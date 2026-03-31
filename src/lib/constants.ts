export const BOT_NAMES = ["momentum", "range", "sentiment"] as const;
export type BotName = (typeof BOT_NAMES)[number];

export const SYMBOLS = ["BTC/USDT", "ETH/USDT", "XRP/USDT", "SOL/USDT"] as const;
export type Symbol = (typeof SYMBOLS)[number];

export const BOT_META: Record<string, { label: string; color: string; strategy: string; pairs: string; interval: string }> = {
  momentum: {
    label: "モメンタム",
    color: "#3b82f6",
    strategy: "EMA(20/50)クロス + MACD / 出来高 + ATR + 4h MTF + GPTレジーム",
    pairs: "BTC/USDT, ETH/USDT",
    interval: "毎時",
  },
  range: {
    label: "レンジ",
    color: "#a855f7",
    strategy: "RSI(30/70)反転 + BB外側 / BB幅 + ADX(≤25) + GPTニュース",
    pairs: "XRP/USDT, SOL/USDT",
    interval: "15分毎",
  },
  sentiment: {
    label: "センチメント",
    color: "#eab308",
    strategy: "RSSニュース → GPTバッチ分析 + EMA(20)確認（司令塔）",
    pairs: "全4ペア",
    interval: "30分毎",
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
  const meta = BOT_META[botName];
  if (!meta) return "";
  return `${meta.strategy}｜${meta.pairs}｜${meta.interval}`;
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
