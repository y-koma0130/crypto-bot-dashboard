export const BOT_NAMES = ["momentum", "momentum-fast", "range", "sentiment"] as const;
export type BotName = (typeof BOT_NAMES)[number];

export const SYMBOLS = ["BTC/USDT", "ETH/USDT", "XRP/USDT", "SOL/USDT"] as const;
export type Symbol = (typeof SYMBOLS)[number];

export const BOT_META: Record<string, { label: string; color: string; strategy: string; pairs: string; interval: string }> = {
  momentum: {
    label: "モメンタム",
    color: "#3b82f6",
    strategy: "L: EMAクロスオーバー + MACD / S: EMAクロスアンダー + MACD<0",
    pairs: "BTC/USDT, ETH/USDT",
    interval: "毎時",
  },
  "momentum-fast": {
    label: "モメンタムFast",
    color: "#06b6d4",
    strategy: "L: EMA(9/21)クロスオーバー + MACD / S: EMA(9/21)クロスアンダー + MACD<0（GPT省略）",
    pairs: "BTC/USDT, ETH/USDT",
    interval: "15分毎",
  },
  range: {
    label: "レンジ",
    color: "#a855f7",
    strategy: "L: RSI<30 + BB下限 / S: RSI>70 + BB上限",
    pairs: "XRP/USDT, SOL/USDT",
    interval: "15分毎",
  },
  sentiment: {
    label: "センチメント",
    color: "#eab308",
    strategy: "L: BULLISH + EMA(20)上 / S: BEARISH + EMA(20)下（司令塔）",
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
  const decimals = num >= 100 ? 2 : num >= 1 ? 4 : 6;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: decimals })}`;
}

export function formatAmount(value: string | number, symbol: string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  const base = symbol.split("/")[0];
  const decimals = num >= 1 ? 4 : 6;
  return `${num.toLocaleString("en-US", { maximumFractionDigits: decimals })} ${base}`;
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

export function formatSide(side: string): string {
  return side === "buy" ? "ロング" : "ショート";
}
