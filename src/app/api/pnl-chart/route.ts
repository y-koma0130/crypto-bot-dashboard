import { NextRequest, NextResponse } from "next/server";
import { getCumulativePnlByBot } from "@/lib/queries";
import { BOT_NAMES } from "@/lib/constants";

const PERIOD_DAYS: Record<string, number> = {
  "1d": 1,
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
};

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") ?? "1m";
  const days = PERIOD_DAYS[period] ?? 30;

  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const raw = await getCumulativePnlByBot(since);

  const defaultEntry = () => {
    const e: Record<string, number> = { total: 0 };
    for (const name of BOT_NAMES) e[name] = 0;
    return e;
  };
  const dateMap = new Map<string, Record<string, number>>();

  for (const row of raw) {
    if (!dateMap.has(row.date)) {
      dateMap.set(row.date, defaultEntry());
    }
    const entry = dateMap.get(row.date)!;
    entry[row.botName] = row.pnl;
    entry.total += row.pnl;
  }

  const cumulative: Record<string, number> = { total: 0 };
  for (const name of BOT_NAMES) cumulative[name] = 0;

  const data = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => {
      const point: Record<string, string | number> = { date };
      for (const name of BOT_NAMES) {
        cumulative[name] += vals[name];
        point[name] = cumulative[name];
      }
      cumulative.total += vals.total;
      point.total = cumulative.total;
      return point;
    });

  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
