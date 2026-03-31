import { db } from "./db";
import { trades, signals, botStatus } from "./schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import type { Trade, Signal, BotStatus } from "./schema";

// Bot status
export async function getBotStatuses(): Promise<BotStatus[]> {
  return db.select().from(botStatus);
}

// Open positions
export async function getOpenPositions(): Promise<Trade[]> {
  return db
    .select()
    .from(trades)
    .where(eq(trades.status, "open"))
    .orderBy(desc(trades.createdAt));
}

// Today's closed PnL
export async function getTodayPnl(): Promise<
  { botName: string; trades: number; totalPnl: number }[]
> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db
    .select({
      botName: trades.botName,
      trades: sql<number>`count(*)::int`,
      totalPnl: sql<number>`coalesce(sum(${trades.pnl}::numeric), 0)::float`,
    })
    .from(trades)
    .where(
      and(eq(trades.status, "closed"), gte(trades.closedAt, today))
    )
    .groupBy(trades.botName);

  return result;
}

// Closed trades with optional filters
export async function getClosedTrades(opts?: {
  botName?: string;
  symbol?: string;
  limit?: number;
  offset?: number;
}): Promise<Trade[]> {
  const conditions = [eq(trades.status, "closed")];
  if (opts?.botName) conditions.push(eq(trades.botName, opts.botName));
  if (opts?.symbol) conditions.push(eq(trades.symbol, opts.symbol));

  return db
    .select()
    .from(trades)
    .where(and(...conditions))
    .orderBy(desc(trades.closedAt))
    .limit(opts?.limit ?? 100)
    .offset(opts?.offset ?? 0);
}

// Win rate by bot
export async function getWinRateByBot(): Promise<
  { botName: string; wins: number; losses: number; winRate: number }[]
> {
  const result = await db
    .select({
      botName: trades.botName,
      wins: sql<number>`count(*) filter (where ${trades.pnl}::numeric > 0)::int`,
      losses: sql<number>`count(*) filter (where ${trades.pnl}::numeric <= 0)::int`,
      winRate: sql<number>`round(count(*) filter (where ${trades.pnl}::numeric > 0)::numeric / nullif(count(*), 0) * 100, 1)::float`,
    })
    .from(trades)
    .where(eq(trades.status, "closed"))
    .groupBy(trades.botName);

  return result;
}

// Daily PnL for chart
export async function getDailyPnl(): Promise<
  { date: string; pnl: number; cumulativePnl: number }[]
> {
  const result = await db
    .select({
      date: sql<string>`to_char(${trades.closedAt}::date, 'YYYY-MM-DD')`,
      pnl: sql<number>`coalesce(sum(${trades.pnl}::numeric), 0)::float`,
    })
    .from(trades)
    .where(eq(trades.status, "closed"))
    .groupBy(sql`${trades.closedAt}::date`)
    .orderBy(sql`${trades.closedAt}::date`);

  let cumulative = 0;
  return result.map((row) => {
    cumulative += row.pnl;
    return { ...row, cumulativePnl: cumulative };
  });
}

// Signals with optional filters
export async function getSignals(opts?: {
  botName?: string;
  signal?: string;
  limit?: number;
}): Promise<Signal[]> {
  const conditions = [];
  if (opts?.botName) conditions.push(eq(signals.botName, opts.botName));
  if (opts?.signal) conditions.push(eq(signals.signal, opts.signal));

  return db
    .select()
    .from(signals)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(signals.createdAt))
    .limit(opts?.limit ?? 50);
}

// Cumulative PnL by bot for chart (with period filter)
export async function getCumulativePnlByBot(since: Date): Promise<
  { date: string; botName: string; pnl: number }[]
> {
  const result = await db
    .select({
      date: sql<string>`to_char(${trades.closedAt}::date, 'YYYY-MM-DD')`,
      botName: trades.botName,
      pnl: sql<number>`coalesce(sum(${trades.pnl}::numeric), 0)::float`,
    })
    .from(trades)
    .where(
      and(eq(trades.status, "closed"), gte(trades.closedAt, since))
    )
    .groupBy(sql`${trades.closedAt}::date`, trades.botName)
    .orderBy(sql`${trades.closedAt}::date`);

  return result;
}

// Performance: PnL by bot
export async function getPnlByBot(): Promise<
  { botName: string; totalPnl: number; tradeCount: number; avgPnl: number }[]
> {
  const result = await db
    .select({
      botName: trades.botName,
      totalPnl: sql<number>`coalesce(sum(${trades.pnl}::numeric), 0)::float`,
      tradeCount: sql<number>`count(*)::int`,
      avgPnl: sql<number>`coalesce(avg(${trades.pnl}::numeric), 0)::float`,
    })
    .from(trades)
    .where(eq(trades.status, "closed"))
    .groupBy(trades.botName);

  return result;
}

// Performance: PnL by symbol
export async function getPnlBySymbol(): Promise<
  { symbol: string; totalPnl: number; tradeCount: number; winRate: number }[]
> {
  const result = await db
    .select({
      symbol: trades.symbol,
      totalPnl: sql<number>`coalesce(sum(${trades.pnl}::numeric), 0)::float`,
      tradeCount: sql<number>`count(*)::int`,
      winRate: sql<number>`round(count(*) filter (where ${trades.pnl}::numeric > 0)::numeric / nullif(count(*), 0) * 100, 1)::float`,
    })
    .from(trades)
    .where(eq(trades.status, "closed"))
    .groupBy(trades.symbol);

  return result;
}

// Performance: Daily PnL by bot
export async function getDailyPnlByBot(): Promise<
  { date: string; botName: string; pnl: number }[]
> {
  const result = await db
    .select({
      date: sql<string>`to_char(${trades.closedAt}::date, 'YYYY-MM-DD')`,
      botName: trades.botName,
      pnl: sql<number>`coalesce(sum(${trades.pnl}::numeric), 0)::float`,
    })
    .from(trades)
    .where(eq(trades.status, "closed"))
    .groupBy(sql`${trades.closedAt}::date`, trades.botName)
    .orderBy(sql`${trades.closedAt}::date`);

  return result;
}
