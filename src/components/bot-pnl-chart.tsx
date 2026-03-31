"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getBotColor, getBotLabel } from "@/lib/constants";
import {
  GRID_PROPS,
  AXIS_TICK,
  AXIS_LINE,
  TICK_LINE,
  TOOLTIP_STYLE,
  LEGEND_STYLE,
  dollarFormatter,
} from "@/lib/chart-config";

type DailyBotPnl = {
  date: string;
  botName: string;
  pnl: number;
};

function pivotData(
  data: DailyBotPnl[]
): { date: string; [botName: string]: string | number }[] {
  const dateMap = new Map<string, Record<string, string | number>>();

  for (const row of data) {
    if (!dateMap.has(row.date)) {
      dateMap.set(row.date, { date: row.date });
    }
    const entry = dateMap.get(row.date)!;
    entry[row.botName] = row.pnl;
  }

  return Array.from(dateMap.values()) as { date: string; [botName: string]: string | number }[];
}

function getBotNames(data: DailyBotPnl[]): string[] {
  return [...new Set(data.map((d) => d.botName))];
}

export function BotPnlChart({ data }: { data: DailyBotPnl[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        データがありません
      </div>
    );
  }

  const pivoted = pivotData(data);
  const botNames = getBotNames(data);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={pivoted}
        margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
      >
        <CartesianGrid {...GRID_PROPS} />
        <XAxis
          dataKey="date"
          tick={AXIS_TICK}
          tickLine={TICK_LINE}
          axisLine={AXIS_LINE}
        />
        <YAxis
          tick={AXIS_TICK}
          tickLine={TICK_LINE}
          axisLine={AXIS_LINE}
          tickFormatter={dollarFormatter}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value: unknown, name: unknown) => [
            `$${Number(value).toFixed(2)}`,
            String(name),
          ]}
          labelFormatter={(label: unknown) => `日付: ${label}`}
        />
        <Legend wrapperStyle={LEGEND_STYLE} />
        {botNames.map((name) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            name={getBotLabel(name)}
            stroke={getBotColor(name)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
