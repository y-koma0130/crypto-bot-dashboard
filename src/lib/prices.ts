const SYMBOL_TO_KUCOIN: Record<string, string> = {
  "BTC/USDT": "BTC-USDT",
  "ETH/USDT": "ETH-USDT",
  "XRP/USDT": "XRP-USDT",
  "SOL/USDT": "SOL-USDT",
};

export async function getCurrentPrices(
  symbols: string[]
): Promise<Record<string, number>> {
  const unique = [...new Set(symbols)];
  const kucoinSymbols = unique
    .map((s) => SYMBOL_TO_KUCOIN[s])
    .filter(Boolean)
    .join(",");

  if (!kucoinSymbols) return {};

  try {
    const res = await fetch(
      `https://api.kucoin.com/api/v1/market/allTickers`,
      { next: { revalidate: 30 } }
    );
    const json = await res.json();
    const tickers: { symbol: string; last: string }[] = json?.data?.ticker ?? [];

    const priceMap: Record<string, number> = {};
    for (const sym of unique) {
      const kucoinSym = SYMBOL_TO_KUCOIN[sym];
      if (!kucoinSym) continue;
      const ticker = tickers.find((t) => t.symbol === kucoinSym);
      if (ticker) priceMap[sym] = parseFloat(ticker.last);
    }
    return priceMap;
  } catch {
    return {};
  }
}

export function calcUnrealizedPnl(
  side: string,
  entryPrice: number,
  currentPrice: number,
  amount: number
): number {
  return side === "buy"
    ? (currentPrice - entryPrice) * amount
    : (entryPrice - currentPrice) * amount;
}
